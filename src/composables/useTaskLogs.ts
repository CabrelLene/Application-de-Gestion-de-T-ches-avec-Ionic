import { ref, onUnmounted } from 'vue'
import { db } from '@/firebase/firebase'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'

export type TaskLog = {
  id: string
  taskId: string
  type: 'create'|'update'|'status'|'transfer'
  message: string
  byId?: string
  byName?: string
  at: any // Timestamp
}

export function useTaskLogs(taskId: string | null) {
  const logs = ref<TaskLog[]>([])
  let unsub: (() => void) | null = null

  function start() {
    if (!taskId) return
    const col = collection(db, 'taskLogs')
    const q = query(col, where('taskId','==', taskId), orderBy('at','desc'))
    unsub?.()
    unsub = onSnapshot(q, snap => {
      logs.value = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }))
    })
  }

  function stop(){ unsub?.(); unsub = null }
  onUnmounted(stop)

  return { logs, start, stop }
}
