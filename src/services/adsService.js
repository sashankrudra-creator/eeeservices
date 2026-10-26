// Firestore + Cloud Storage access for advertisements.
// Collection: ads/{adId}   Images: ads/<file> in the default storage bucket.
// Public visitors can only read active ads; every write requires an admin
// (enforced by firestore.rules / storage.rules, not by this file).

import { isFirebaseConfigured, loadFirestore, loadFirestoreLite, loadStorage } from '../lib/firebase';

const COLLECTION = 'ads';
const DEMO_ADS_KEY = 'triplee_demo_ads';
const demoSubscribers = new Set();
const ms = (t) => (t && typeof t.toMillis === 'function' ? t.toMillis() : null);
const num = (v, fallback) => (typeof v === 'number' && Number.isFinite(v) ? v : fallback);

function getInitialDemoAds() {
  const now = Date.now();
  return [
    {
      id: 'demo-live-popup',
      type: 'popup',
      title: 'Diwali Maintenance Offer',
      description: 'Book an annual maintenance contract before 30 Nov and get a free thermography audit.',
      imageUrl: '',
      imagePath: '',
      linkUrl: '/contact',
      linkText: 'Request a quote',
      newTab: false,
      active: true,
      startAt: null,
      endAt: null,
      priority: 1,
      frequency: 'session',
      delaySeconds: 3,
      createdAt: now - 3600000,
      updatedAt: now - 3600000,
    },
    {
      id: 'demo-future-banner',
      type: 'banner',
      title: 'Overhaul 2026',
      description: 'Pre-book your annual overhaul outage with us for prioritized allocation.',
      imageUrl: '',
      imagePath: '',
      linkUrl: '/contact',
      linkText: '',
      newTab: false,
      active: true,
      startAt: now + 86400000,
      endAt: null,
      priority: 10,
      frequency: 'session',
      delaySeconds: 3,
      createdAt: now - 7200000,
      updatedAt: now - 7200000,
    },
    {
      id: 'demo-paused-banner',
      type: 'banner',
      title: 'Boiler O&M Contracts',
      description: 'Comprehensive boiler operation and maintenance with certified IBR engineers.',
      imageUrl: '',
      imagePath: '',
      linkUrl: '/services#boiler-services',
      linkText: '',
      newTab: false,
      active: false,
      startAt: null,
      endAt: null,
      priority: 10,
      frequency: 'session',
      delaySeconds: 3,
      createdAt: now - 10800000,
      updatedAt: now - 10800000,
    },
    {
      id: 'demo-ended-popup',
      type: 'popup',
      title: 'Ended Popup',
      description: 'A live popup',
      imageUrl: '',
      imagePath: '',
      linkUrl: '/contact',
      linkText: '',
      newTab: false,
      active: true,
      startAt: null,
      endAt: now - 86400000,
      priority: 10,
      frequency: 'session',
      delaySeconds: 3,
      createdAt: now - 14400000,
      updatedAt: now - 14400000,
    },
  ];
}

function loadDemoAds() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DEMO_ADS_KEY);
    if (!raw) {
      const initial = getInitialDemoAds();
      localStorage.setItem(DEMO_ADS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return getInitialDemoAds();
  }
}

function saveDemoAds(ads) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DEMO_ADS_KEY, JSON.stringify(ads));
    demoSubscribers.forEach((fn) => fn(ads));
  } catch (err) {
    console.warn('Failed to save demo ads to localStorage', err);
  }
}

function toAd(snap) {
  const d = snap.data({ serverTimestamps: 'estimate' });
  return {
    id: snap.id,
    type: d.type === 'banner' ? 'banner' : 'popup',
    title: d.title || '',
    description: d.description || '',
    imageUrl: d.imageUrl || '',
    imagePath: d.imagePath || '',
    linkUrl: d.linkUrl || '',
    linkText: d.linkText || '',
    newTab: d.newTab !== false,
    active: d.active === true,
    startAt: ms(d.startAt),
    endAt: ms(d.endAt),
    priority: num(d.priority, 100),
    frequency: d.frequency || 'session',
    delaySeconds: num(d.delaySeconds, 3),
    createdAt: ms(d.createdAt),
    updatedAt: ms(d.updatedAt),
  };
}

// Live subscription (admin only). The returned function cancels even if the SDK
// has not finished loading yet.
function subscribe(buildQuery, onData, onError) {
  let unsub = null;
  let cancelled = false;
  (async () => {
    try {
      const { fs, db } = await loadFirestore();
      if (cancelled) return;
      unsub = fs.onSnapshot(
        buildQuery(fs, fs.collection(db, COLLECTION)),
        (snap) => onData(snap.docs.map(toAd)),
        (err) => onError?.(err)
      );
    } catch (err) {
      onError?.(err);
    }
  })();
  return () => {
    cancelled = true;
    unsub?.();
  };
}

/* ---------- public site ---------- */

// Equality filter only, so no composite index is needed. Sorting happens in the browser.
export async function fetchActiveAds() {
  if (!isFirebaseConfigured) {
    const all = loadDemoAds();
    return all.filter((a) => a.active === true);
  }
  const { fs, db } = await loadFirestoreLite();
  const snap = await fs.getDocs(fs.query(fs.collection(db, COLLECTION), fs.where('active', '==', true)));
  return snap.docs.map(toAd);
}

/* ---------- admin ---------- */

export const subscribeToAllAds = (onData, onError) => {
  if (!isFirebaseConfigured) {
    const notify = (ads) => onData(ads || loadDemoAds());
    demoSubscribers.add(notify);
    setTimeout(() => notify(loadDemoAds()), 0);
    return () => demoSubscribers.delete(notify);
  }
  return subscribe((fs, col) => fs.query(col, fs.orderBy('createdAt', 'desc')), onData, onError);
};

// Exactly the fields firestore.rules allows, always all of them.
function payload(fs, v) {
  const ts = (t) => (t ? fs.Timestamp.fromMillis(t) : null);
  return {
    type: v.type === 'banner' ? 'banner' : 'popup',
    title: v.title.trim(),
    description: v.description.trim(),
    imageUrl: v.imageUrl.trim(),
    imagePath: v.imagePath || '',
    linkUrl: v.linkUrl.trim(),
    linkText: v.linkText.trim(),
    newTab: Boolean(v.newTab),
    active: Boolean(v.active),
    startAt: ts(v.startAt),
    endAt: ts(v.endAt),
    priority: v.priority,
    frequency: v.frequency,
    delaySeconds: v.delaySeconds,
  };
}

export async function createAd(values) {
  if (!isFirebaseConfigured) {
    const ads = loadDemoAds();
    const id = `demo-${Date.now()}`;
    const newAd = {
      ...values,
      id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    ads.unshift(newAd);
    saveDemoAds(ads);
    return id;
  }
  const { fs, db } = await loadFirestore();
  const ref = await fs.addDoc(fs.collection(db, COLLECTION), {
    ...payload(fs, values),
    createdAt: fs.serverTimestamp(),
    updatedAt: fs.serverTimestamp(),
  });
  return ref.id;
}

export async function updateAd(id, values) {
  if (!isFirebaseConfigured) {
    const ads = loadDemoAds();
    const idx = ads.findIndex((a) => a.id === id);
    if (idx !== -1) {
      ads[idx] = { ...ads[idx], ...values, updatedAt: Date.now() };
      saveDemoAds(ads);
    }
    return;
  }
  const { fs, db } = await loadFirestore();
  await fs.updateDoc(fs.doc(db, COLLECTION, id), { ...payload(fs, values), updatedAt: fs.serverTimestamp() });
}

export async function setAdActive(id, active) {
  if (!isFirebaseConfigured) {
    const ads = loadDemoAds();
    const idx = ads.findIndex((a) => a.id === id);
    if (idx !== -1) {
      ads[idx] = { ...ads[idx], active, updatedAt: Date.now() };
      saveDemoAds(ads);
    }
    return;
  }
  const { fs, db } = await loadFirestore();
  await fs.updateDoc(fs.doc(db, COLLECTION, id), { active, updatedAt: fs.serverTimestamp() });
}

export async function deleteAd(ad) {
  if (!isFirebaseConfigured) {
    const ads = loadDemoAds().filter((a) => a.id !== ad.id);
    saveDemoAds(ads);
    return;
  }
  const { fs, db } = await loadFirestore();
  await fs.deleteDoc(fs.doc(db, COLLECTION, ad.id));
  if (ad.imagePath) await deleteAdImage(ad.imagePath);
}

/* ---------- images ---------- */

const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };

export async function uploadAdImage(file, onProgress) {
  if (!isFirebaseConfigured) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        onProgress?.(1);
        resolve({ url: e.target.result, path: '' });
      };
      reader.readAsDataURL(file);
    });
  }
  const { st, storage } = await loadStorage();
  const ext = EXT[file.type] || 'jpg';
  const path = `ads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const task = st.uploadBytesResumable(st.ref(storage, path), file, {
    contentType: file.type,
    cacheControl: 'public,max-age=31536000',
  });
  await new Promise((resolve, reject) => {
    task.on('state_changed', (s) => onProgress?.(s.bytesTransferred / s.totalBytes), reject, resolve);
  });
  const url = await st.getDownloadURL(task.snapshot.ref);
  return { url, path };
}

// Best effort: a leftover file is harmless, so failures are ignored.
export async function deleteAdImage(path) {
  if (!path || !path.startsWith('ads/')) return;
  try {
    const { st, storage } = await loadStorage();
    await st.deleteObject(st.ref(storage, path));
  } catch { /* already gone or storage not enabled */ }
}
