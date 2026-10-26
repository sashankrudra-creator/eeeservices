// Admin authentication. Accounts are created by the site owner in the Firebase
// console (there is no sign-up). Being signed in is not enough: an account is an
// administrator only if a document exists at admins/{uid}. The same check runs
// inside firestore.rules / storage.rules, so the UI check below is just for UX.

import { isFirebaseConfigured, loadAuth, loadFirestore } from '../lib/firebase';

const DEMO_USER_KEY = 'triplee_demo_admin';
const demoListeners = new Set();

function getDemoUser() {
  if (typeof window === 'undefined') return null;
  const email = localStorage.getItem(DEMO_USER_KEY);
  return email ? { email, uid: 'demo-admin-uid' } : null;
}

export function watchAuth(onUser, onError) {
  if (!isFirebaseConfigured) {
    const notify = () => onUser(getDemoUser());
    demoListeners.add(notify);
    setTimeout(notify, 0);
    return () => demoListeners.delete(notify);
  }

  let unsub = null;
  let cancelled = false;
  loadAuth()
    .then(({ auth, mod }) => {
      if (cancelled) return;
      unsub = mod.onAuthStateChanged(auth, onUser, onError);
    })
    .catch((err) => onError?.(err));
  return () => {
    cancelled = true;
    unsub?.();
  };
}

export async function signIn(email, password, remember) {
  if (!isFirebaseConfigured) {
    const userEmail = email.trim() || 'admin@triple-e.test';
    localStorage.setItem(DEMO_USER_KEY, userEmail);
    demoListeners.forEach((l) => l());
    return;
  }

  const { auth, mod } = await loadAuth();
  await mod.setPersistence(auth, remember ? mod.browserLocalPersistence : mod.browserSessionPersistence);
  await mod.signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function signOutAdmin() {
  if (!isFirebaseConfigured) {
    localStorage.removeItem(DEMO_USER_KEY);
    demoListeners.forEach((l) => l());
    return;
  }

  const { auth, mod } = await loadAuth();
  await mod.signOut(auth);
}

export async function sendReset(email) {
  if (!isFirebaseConfigured) {
    return;
  }

  const { auth, mod } = await loadAuth();
  await mod.sendPasswordResetEmail(auth, email.trim());
}

export async function checkIsAdmin(uid) {
  if (!isFirebaseConfigured) {
    return true;
  }

  try {
    const { fs, db } = await loadFirestore();
    const snap = await fs.getDoc(fs.doc(db, 'admins', uid));
    return snap.exists();
  } catch {
    return false; // rules denied the read, or offline: treat as not an admin
  }
}

// Deliberately vague for credential errors so the form never reveals whether an email exists.
export function authMessage(err) {
  switch (err?.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
    case 'auth/invalid-email':
    case 'auth/missing-password':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a few minutes, or reset your password.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/network-request-failed':
      return 'Network problem. Check your connection and try again.';
    default:
      return 'Could not sign in. Please try again.';
  }
}
