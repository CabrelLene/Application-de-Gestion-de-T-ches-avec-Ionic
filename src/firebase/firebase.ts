import { initializeApp } from 'firebase/app'
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  CACHE_SIZE_UNLIMITED,
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE,
  messagingSenderId: import.meta.env.VITE_FB_MSG_SENDER,
  appId: import.meta.env.VITE_FB_APP_ID,
}

export const fbApp = initializeApp(firebaseConfig)

/** Firestore avec cache persistant offline + multi-onglets */
export const db = initializeFirestore(fbApp, {
  ignoreUndefinedProperties: true,
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  }),
})

export const auth = getAuth(fbApp)
