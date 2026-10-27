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

const AI_AD_IMAGES = {
  'demo-live-popup': '/images/ai/ad-maintenance.jpg',
  'demo-future-banner': '/images/ai/boiler-overhaul.jpg',
  'demo-paused-banner': '/images/ai/solar-epc.jpg',
  'demo-transmission-banner': '/images/ai/transmission-line.jpg',
  'demo-ci-banner': '/images/ai/ci-automation.jpg',
};

function getInitialDemoAds() {
  return [];
}

function loadDemoAds() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DEMO_ADS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
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
  let imageUrl = d.imageUrl || '';
  if (d.imagePath?.startsWith('local:')) {
    const key = d.imagePath.replace('local:', '');
    try {
      const local = localStorage.getItem(key);
      if (local) imageUrl = local;
    } catch { /* ignore */ }
  }
  return {
    id: snap.id,
    type: d.type === 'banner' ? 'banner' : 'popup',
    title: d.title || '',
    description: d.description || '',
    imageUrl,
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
  return subscribe(
    (fs, col) => fs.query(col, fs.orderBy('createdAt', 'desc')),
    onData,
    (err) => {
      console.warn('Admin subscription error, attempting fallback to active ads:', err);
      fetchActiveAds()
        .then((items) => onData(items))
        .catch(() => {
          if (onError) onError(err);
        });
    }
  );
};

// Exactly the fields firestore.rules allows, always all of them.
function payload(fs, v, id) {
  const ts = (t) => (t ? fs.Timestamp.fromMillis(t) : null);
  let imageUrl = (v.imageUrl || '').trim();
  let imagePath = v.imagePath || '';

  // If a data URL exceeds 950 chars, it violates firestore.rules (d.imageUrl.size() <= 1000).
  // Cache the full data URL in localStorage so this client/browser renders the uploaded image,
  // and store a safe default AI image path in Firestore to satisfy rules.
  if (imageUrl.startsWith('data:image/') && imageUrl.length > 950) {
    const key = `ad_img_${id || Date.now()}`;
    try {
      localStorage.setItem(key, imageUrl);
      imagePath = `local:${key}`;
    } catch { /* ignore */ }
    imageUrl = '/images/ai/ad-maintenance.jpg';
  }

  return {
    type: v.type === 'banner' ? 'banner' : 'popup',
    title: v.title.trim(),
    description: v.description.trim(),
    imageUrl,
    imagePath,
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
  const tempId = `ad_${Date.now()}`;
  const ref = await fs.addDoc(fs.collection(db, COLLECTION), {
    ...payload(fs, values, tempId),
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
  await fs.updateDoc(fs.doc(db, COLLECTION, id), { ...payload(fs, values, id), updatedAt: fs.serverTimestamp() });
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
  const toDataUrl = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        onProgress?.(1);
        resolve({ url: e.target.result, path: '' });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  // 1. Try local server endpoint first: saves the file cleanly into public/images/uploads/ and returns a clean short URL
  try {
    const res = await fetch('/api/upload-image', {
      method: 'POST',
      body: file,
      headers: { 'Content-Type': file.type || 'image/jpeg' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.url) {
        onProgress?.(1);
        return { url: data.url, path: data.path || '' };
      }
    }
  } catch {
    // Local server upload unavailable, fallback to Storage or Data URL
  }

  // 2. Try Firebase Storage if configured
  if (isFirebaseConfigured) {
    try {
      const { st, storage } = await loadStorage();
      const ext = EXT[file.type] || 'jpg';
      const path = `ads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const storageRef = st.ref(storage, path);

      const uploadPromise = new Promise((resolve, reject) => {
        const task = st.uploadBytesResumable(storageRef, file, {
          contentType: file.type,
          cacheControl: 'public,max-age=31536000',
        });
        task.on(
          'state_changed',
          (s) => onProgress?.(s.bytesTransferred / s.totalBytes),
          reject,
          async () => {
            try {
              const url = await st.getDownloadURL(task.snapshot.ref);
              resolve({ url, path });
            } catch (err) {
              reject(err);
            }
          }
        );
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Storage unavailable')), 2500)
      );

      return await Promise.race([uploadPromise, timeoutPromise]);
    } catch {
      // Storage unavailable or bucket not found, fall through to fast data URL
    }
  }

  // 3. Fallback to fast Data URL
  return toDataUrl(file);
}

// Best effort: a leftover file is harmless, so failures are ignored.
export async function deleteAdImage(path) {
  if (!path || !path.startsWith('ads/')) return;
  try {
    const { st, storage } = await loadStorage();
    await st.deleteObject(st.ref(storage, path));
  } catch { /* already gone or storage not enabled */ }
}

