import { useEffect, useState, useSyncExternalStore } from 'react';
import { isFirebaseConfigured } from '../lib/firebase';
import { fetchActiveAds } from '../services/adsService';

// One shared copy of the active ads for the whole public site (the popup and the
// scrolling banners both read from it). Ads are fetched fresh on every page load,
// and open pages refresh themselves, so edits made in the admin page show up
// without a redeploy.

const REFRESH_MS = 3 * 60 * 1000; // refresh open pages every 3 minutes
const STALE_MS = 60 * 1000; // ...and when a tab is revisited after a minute away

let snapshot = { status: 'idle', ads: [] };
const listeners = new Set();
let started = false;
let lastLoad = 0;

function emit(next) {
  snapshot = next;
  listeners.forEach((l) => l());
}

async function load() {
  lastLoad = Date.now();
  try {
    emit({ status: 'ready', ads: await fetchActiveAds() });
  } catch (err) {
    // The site must never break because ads could not load: keep what we have and carry on.
    console.warn('[ads] advertisements unavailable:', err?.code || err?.message || err);
    emit({ status: 'error', ads: snapshot.ads });
  }
}

function start() {
  if (started) return;
  started = true;
  emit({ status: 'loading', ads: [] });
  load();
  setInterval(() => { if (!document.hidden) load(); }, REFRESH_MS);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && Date.now() - lastLoad > STALE_MS) load();
  });
}

const subscribe = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const getSnapshot = () => snapshot;

export default function useAds() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // Wait until the browser is idle so ads never compete with the page's first paint.
  useEffect(() => {
    if (started) return undefined;
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(start, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(start, 1200);
    return () => clearTimeout(t);
  }, []);

  return state;
}

// Re-renders on an interval so scheduled start/end times take effect without a reload.
export function useNow(intervalMs = 30000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
