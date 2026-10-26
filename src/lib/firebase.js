// Firebase bootstrap for the advertisement features.
//
// Nothing runs until an ads feature asks for it, and the SDK is pulled in with
// dynamic import() so the public site's first paint and bundle are unaffected.
// If the VITE_FIREBASE_* variables are not set, every ads feature quietly
// switches itself off and the website behaves exactly as it did before.

const env = import.meta.env;

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
// Image upload needs Cloud Storage. Without a bucket the admin falls back to image URLs.
export const hasStorage = Boolean(firebaseConfig.storageBucket);

let appPromise;
function loadApp() {
  if (!isFirebaseConfigured) return Promise.reject(new Error('Firebase is not configured'));
  if (!appPromise) {
    appPromise = import('firebase/app').then(({ initializeApp, getApps, getApp }) =>
      getApps().length ? getApp() : initializeApp(firebaseConfig)
    );
  }
  return appPromise;
}

let firestorePromise;
export function loadFirestore() {
  if (!firestorePromise) {
    firestorePromise = Promise.all([loadApp(), import('firebase/firestore')]).then(([app, fs]) => ({
      fs,
      db: fs.getFirestore(app),
    }));
  }
  return firestorePromise;
}

// The public website only needs to read a few documents, so it uses the much
// smaller "lite" Firestore. The full SDK (live updates, writes) is for /admin only.
let litePromise;
export function loadFirestoreLite() {
  if (!litePromise) {
    litePromise = Promise.all([loadApp(), import('firebase/firestore/lite')]).then(([app, fs]) => ({
      fs,
      db: fs.getFirestore(app),
    }));
  }
  return litePromise;
}

let authPromise;
export function loadAuth() {
  if (!authPromise) {
    authPromise = Promise.all([loadApp(), import('firebase/auth')]).then(([app, mod]) => ({
      mod,
      auth: mod.getAuth(app),
    }));
  }
  return authPromise;
}

let storagePromise;
export function loadStorage() {
  if (!hasStorage) return Promise.reject(new Error('Cloud Storage is not configured'));
  if (!storagePromise) {
    storagePromise = Promise.all([loadApp(), import('firebase/storage')]).then(([app, st]) => ({
      st,
      storage: st.getStorage(app),
    }));
  }
  return storagePromise;
}
