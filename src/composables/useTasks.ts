import { ref, onUnmounted, computed } from 'vue'
import { auth, db } from '@/firebase/firebase'
import {
  addDoc, collection, doc, getDoc, getDocs, onSnapshot,
  orderBy, query, serverTimestamp, updateDoc, where, limit, startAfter, type QueryDocumentSnapshot
} from 'firebase/firestore'
import type { Task, TaskStatus } from '@/types'

const colTasks = collection(db, 'tasks')
const colUsers = collection(db, 'users')
const colLogs  = collection(db, 'taskLogs')

async function logAction(taskId: string, type: 'create'|'update'|'status'|'transfer', message: string) {
  const u = auth.currentUser
  await addDoc(colLogs, {
    taskId,
    type,
    message,
    byId: u?.uid ?? null,
    byName: u?.displayName ?? (u?.email?.split('@')[0] ?? 'Utilisateur'),
    at: serverTimestamp(),
  })
}

type Opts = { ownerOnly?: boolean, pageSize?: number }

export function useTasks(status: TaskStatus, opts: Opts = {}) {
  const pageSize = opts.pageSize ?? 20
  const ownerOnly = ref(!!opts.ownerOnly)
  const tasks = ref<Task[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)
  const liveCount = ref(0)
  let unsub: (() => void) | null = null
  let lastDoc: QueryDocumentSnapshot | null = null
  let starting = false

  const uid = computed(() => auth.currentUser?.uid ?? null)

  function buildBaseQuery() {
    const filters = [ where('status','==', status) ]
    if (ownerOnly.value && uid.value) filters.push(where('ownerId','==', uid.value))
    return query(colTasks, ...filters, orderBy('createdAt','desc'))
  }

  async function start() {
    if (starting) return
    starting = true
    stop()
    tasks.value = []
    loading.value = true
    lastDoc = null; liveCount.value = 0
    const q = query(buildBaseQuery(), limit(pageSize))
    unsub = onSnapshot(q, snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
      tasks.value = list
      liveCount.value = list.length
      lastDoc = snap.docs.at(-1) ?? null
      loading.value = false
    }, e => { error.value = 'Erreur de lecture'; loading.value = false; console.error(e) })
    starting = false
  }
  function stop() { if (unsub) { unsub(); unsub = null } }
  onUnmounted(stop)

  async function loadMore() {
    if (!lastDoc) return
    const q = query(buildBaseQuery(), orderBy('createdAt','desc'), startAfter(lastDoc), limit(pageSize))
    const snap = await getDocs(q)
    if (snap.empty) { lastDoc = null; return }
    const more = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
    tasks.value = [...tasks.value, ...more]
    lastDoc = snap.docs.at(-1) ?? lastDoc
  }

  async function createTask(payload: { title: string; description?: string }) {
    const u = auth.currentUser
    if (!u) throw new Error('Non connecté.')
    const ownerName = u.displayName || (u.email?.split('@')[0] ?? 'Utilisateur')
    const docRef = await addDoc(colTasks, {
      title: payload.title.trim(),
      description: payload.description?.trim() || '',
      status: 'active',
      ownerId: u.uid,
      ownerName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    await logAction(docRef.id, 'create', `Création de la tâche`)
  }

  async function updateTask(id: string, patch: Partial<Omit<Task,'id'|'ownerId'|'createdAt'>>) {
    await updateDoc(doc(db, 'tasks', id), { ...patch, updatedAt: serverTimestamp() })
    const changed = Object.keys(patch).join(', ')
    await logAction(id, 'update', `Champs mis à jour: ${changed || '—'}`)
  }

  async function setStatus(id: string, next: TaskStatus) {
    await updateDoc(doc(db, 'tasks', id), { status: next, updatedAt: serverTimestamp() })
    await logAction(id, 'status', `Nouveau statut: ${next}`)
  }

  async function transferTask(id: string, recipientEmail: string) {
    const email = recipientEmail.trim().toLowerCase()
    if (!email) throw new Error('Email destinataire requis.')
    const userSnap = await getDocs(query(colUsers, where('email','==', email), limit(1)))
    if (userSnap.empty) throw new Error('Aucun utilisateur avec cet email.')
    const target = userSnap.docs[0].data() as any
    const uref = doc(db, 'users', target.uid)
    const exists = await getDoc(uref)
    if (!exists.exists()) throw new Error('Profil destinataire introuvable.')
    await updateDoc(doc(db, 'tasks', id), {
      ownerId: target.uid,
      ownerName: target.displayName || (target.email?.split('@')[0] ?? 'Utilisateur'),
      updatedAt: serverTimestamp(),
    })
    await logAction(id, 'transfer', `Transférée à ${target.displayName ?? target.email}`)
  }

  return { tasks, loading, error, ownerOnly, start, stop, loadMore, createTask, updateTask, setStatus, transferTask, liveCount }
}
