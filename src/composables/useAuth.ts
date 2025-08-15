// src/composables/useAuth.ts
import { ref } from 'vue'
import { auth, db } from '@/firebase/firebase'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

// ✅ Après
import type { User } from 'firebase/auth'
export const currentUser = ref<User | null>(null)

export const authReady = new Promise<void>((resolve) => {
  const stop = onAuthStateChanged(auth, (u) => {
    currentUser.value = u
    stop(); resolve()
  })
})

function mapError(e: any): string {
  const code = String(e?.code || '')
  const table: Record<string, string> = {
    'auth/invalid-email': 'Email invalide.',
    'auth/user-disabled': 'Compte désactivé.',
    'auth/user-not-found': 'Utilisateur introuvable.',
    'auth/wrong-password': 'Mot de passe incorrect.',
    'auth/email-already-in-use': 'Email déjà utilisé.',
    'auth/weak-password': 'Mot de passe trop faible (min 6 caractères).',
    'auth/requires-recent-login': 'Action sensible: veuillez vous reconnecter.',
  }
  return table[code] ?? 'Une erreur est survenue.'
}

async function createOrMergeUserProfile(u: NonNullable<typeof auth.currentUser>, displayName?: string) {
  const refUser = doc(db, 'users', u.uid)
  await setDoc(
    refUser,
    {
      uid: u.uid,
      email: u.email ?? null,
      displayName: displayName ?? u.displayName ?? null,
      photoURL: u.photoURL ?? null,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export async function login(email: string, password: string) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    currentUser.value = cred.user
    await createOrMergeUserProfile(cred.user)
    return cred.user
  } catch (e) { throw new Error(mapError(e)) }
}

export async function register(email: string, password: string, displayName: string) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) {
      await updateProfile(cred.user, { displayName })
    }
    await createOrMergeUserProfile(cred.user, displayName)
    currentUser.value = cred.user
    return cred.user
  } catch (e) { throw new Error(mapError(e)) }
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (e) { throw new Error(mapError(e)) }
}

export async function changePassword(currentPlain: string, newPlain: string) {
  try {
    const u = auth.currentUser
    if (!u || !u.email) throw new Error('Utilisateur non connecté.')
    const cred = EmailAuthProvider.credential(u.email, currentPlain)
    await reauthenticateWithCredential(u, cred)
    await updatePassword(u, newPlain)
  } catch (e) { throw new Error(mapError(e)) }
}

export async function logout() {
  try {
    await signOut(auth)
    currentUser.value = null
  } catch (e) { throw new Error(mapError(e)) }
}


export async function updateUserProfile(displayName?: string, photoURL?: string) {
    const u = auth.currentUser
    if (!u) throw new Error('Utilisateur non connecté.')
    await updateProfile(u, { displayName, photoURL })
    await setDoc(doc(db, 'users', u.uid), {
      displayName: displayName ?? null,
      photoURL: photoURL ?? null,
      updatedAt: serverTimestamp(),
    }, { merge: true })
    currentUser.value = auth.currentUser
  }