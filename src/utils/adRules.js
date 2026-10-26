// Pure helpers for advertisements: scheduling, popup frequency, link safety,
// and form validation. No Firebase or React in here so it is easy to test.

export const AD_TYPES = [
  { value: 'popup', label: 'Popup' },
  { value: 'banner', label: 'Scrolling banner' },
];

export const FREQUENCIES = [
  { value: 'always', label: 'Every page load' },
  { value: 'session', label: 'Once per visit (browser session)' },
  { value: 'daily', label: 'Once a day' },
  { value: 'weekly', label: 'Once a week' },
  { value: 'once', label: 'Only once per visitor' },
];

export const LIMITS = { title: 120, description: 400, link: 500, linkText: 30, image: 1000 };

const DAY = 24 * 60 * 60 * 1000;

/* ---------------- links & images ---------------- */

// Only http(s), mailto, tel and same-site paths are allowed. Anything else
// (javascript:, data:, protocol-relative //host, ...) is dropped.
export function safeUrl(raw) {
  const url = String(raw ?? '').trim();
  if (!url) return '';
  if (url[0] === '/') return url[1] === '/' || url[1] === '\\' ? '' : url;
  try {
    const u = new URL(url);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(u.protocol) ? url : '';
  } catch {
    return '';
  }
}

export function safeImageUrl(raw) {
  const url = String(raw ?? '').trim();
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:' ? url : '';
  } catch {
    return '';
  }
}

export const isInternalLink = (url) => url.startsWith('/');
export const isWebLink = (url) => /^https?:/i.test(url);

// Tidy what an admin typed: "example.com/offer" becomes "https://example.com/offer".
export function normalizeLink(input) {
  const v = String(input ?? '').trim();
  if (!v) return '';
  if (v[0] === '/' || /^[a-z][a-z0-9+.-]*:/i.test(v)) return v;
  if (/^[^\s/]+\.[^\s/]{2,}/.test(v)) return `https://${v}`;
  return v;
}

/* ---------------- schedule & status ---------------- */

export const isWithinSchedule = (ad, now = Date.now()) =>
  (!ad.startAt || ad.startAt <= now) && (!ad.endAt || now < ad.endAt);

export function adStatus(ad, now = Date.now()) {
  if (!ad.active) return 'inactive';
  if (ad.startAt && ad.startAt > now) return 'scheduled';
  if (ad.endAt && ad.endAt <= now) return 'expired';
  return 'live';
}

export const sortAds = (ads) =>
  [...ads].sort((a, b) => (a.priority - b.priority) || ((b.createdAt || 0) - (a.createdAt || 0)));

export const liveAds = (ads, type, now = Date.now()) =>
  sortAds(ads.filter((a) => a.type === type && a.active && isWithinSchedule(a, now)));

/* ---------------- popup frequency ---------------- */

const KEY = 'eee_ad_';

function bucket(frequency) {
  try {
    return frequency === 'session' ? window.sessionStorage : window.localStorage;
  } catch {
    return null; // storage blocked (private mode, etc.)
  }
}

function readSeen(ad) {
  try {
    const raw = bucket(ad.frequency)?.getItem(KEY + ad.id);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// An edit made in the admin page (which bumps updatedAt) counts as a new
// campaign, so returning visitors see the changed popup again.
export function canShowPopup(ad, now = Date.now()) {
  if (!ad.frequency || ad.frequency === 'always') return true;
  const seen = readSeen(ad);
  if (!seen || seen.v !== (ad.updatedAt || 0)) return true;
  switch (ad.frequency) {
    case 'daily': return now - seen.t >= DAY;
    case 'weekly': return now - seen.t >= 7 * DAY;
    case 'session':
    case 'once': return false;
    default: return true;
  }
}

export function markPopupShown(ad, now = Date.now()) {
  if (!ad.frequency || ad.frequency === 'always') return;
  try {
    bucket(ad.frequency)?.setItem(KEY + ad.id, JSON.stringify({ t: now, v: ad.updatedAt || 0 }));
  } catch { /* storage full or blocked: the popup simply may show again */ }
}

export function pickPopup(ads, now = Date.now()) {
  return liveAds(ads, 'popup', now).find((a) => canShowPopup(a, now)) || null;
}

/* ---------------- admin form ---------------- */

export const EMPTY_AD = {
  type: 'popup',
  title: '',
  description: '',
  imageUrl: '',
  imagePath: '',
  linkUrl: '',
  linkText: 'Learn more',
  newTab: true,
  active: true,
  startAt: null,
  endAt: null,
  priority: 10,
  frequency: 'session',
  delaySeconds: 3,
};

export function validateAd(v) {
  const e = {};
  const title = v.title.trim();
  if (!title) e.title = 'Give the advertisement a title.';
  else if (title.length > LIMITS.title) e.title = `Keep the title under ${LIMITS.title} characters.`;
  if (v.description.length > LIMITS.description) e.description = `Keep the description under ${LIMITS.description} characters.`;
  if (v.linkUrl.trim()) {
    if (!safeUrl(normalizeLink(v.linkUrl))) e.linkUrl = 'Enter a full link such as https://example.com, a /page path, mailto: or tel:.';
    else if (v.linkUrl.length > LIMITS.link) e.linkUrl = 'That link is too long.';
  }
  if (v.linkText.length > LIMITS.linkText) e.linkText = `Keep the button label under ${LIMITS.linkText} characters.`;
  if (v.imageUrl.trim() && !safeImageUrl(v.imageUrl)) e.imageUrl = 'The image address must start with https://';
  if (v.startAt && v.endAt && v.endAt <= v.startAt) e.endAt = 'The end must be after the start.';
  if (!Number.isInteger(v.priority) || v.priority < 0 || v.priority > 999) e.priority = 'Use a whole number from 0 to 999.';
  if (v.type === 'popup' && (!Number.isInteger(v.delaySeconds) || v.delaySeconds < 0 || v.delaySeconds > 60)) {
    e.delaySeconds = 'Use a whole number of seconds from 0 to 60.';
  }
  return e;
}

// <input type="datetime-local"> <-> epoch milliseconds (admin's local time)
export function toLocalInput(ms) {
  if (!ms) return '';
  const d = new Date(ms);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export function fromLocalInput(str) {
  if (!str) return null;
  const t = new Date(str).getTime();
  return Number.isNaN(t) ? null : t;
}
