import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CalendarClock, ExternalLink, ImageOff, LogOut, Pencil, Plus, Trash2, X } from 'lucide-react';
import Logo from '../../components/layout/Logo';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import AdFormModal from './AdFormModal';
import { useApp } from '../../context/AppContext';
import { useNow } from '../../hooks/useAds';
import { deleteAd, setAdActive, subscribeToAllAds } from '../../services/adsService';
import { signOutAdmin } from '../../services/authService';
import { EMPTY_AD, FREQUENCIES, adStatus, safeImageUrl } from '../../utils/adRules';

const IDLE_MINUTES = 30;
const STATUS_LABEL = { live: 'Live', scheduled: 'Scheduled', expired: 'Ended', inactive: 'Off' };
const TYPE_LABEL = { popup: 'Popup', banner: 'Scrolling banner' };
const freqLabel = (value) => FREQUENCIES.find((f) => f.value === value)?.label || value;

const fmt = (ms) => new Date(ms).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });
function scheduleLabel(ad) {
  if (ad.startAt && ad.endAt) return `${fmt(ad.startAt)} → ${fmt(ad.endAt)}`;
  if (ad.startAt) return `From ${fmt(ad.startAt)}`;
  if (ad.endAt) return `Until ${fmt(ad.endAt)}`;
  return 'No schedule (runs until switched off)';
}

// Signs the administrator out after a stretch of no activity.
function useIdleSignOut(minutes) {
  useEffect(() => {
    let timer;
    let last = 0;
    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(() => { signOutAdmin(); }, minutes * 60 * 1000);
    };
    const onActivity = () => {
      const now = Date.now();
      if (now - last < 5000) return;
      last = now;
      arm();
    };
    const events = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    arm();
    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, onActivity));
    };
  }, [minutes]);
}

function Switch({ checked, busy, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} disabled={busy} className={`adm-switch ${checked ? 'is-on' : ''}`} onClick={onChange}>
      <span />
    </button>
  );
}

function AdRow({ ad, now, busy, onToggle, onEdit, onDelete }) {
  const status = adStatus(ad, now);
  const img = safeImageUrl(ad.imageUrl);
  return (
    <li className="adm-item">
      <div className="adm-item__thumb">
        {img ? <img src={img} alt="" loading="lazy" /> : <ImageOff size={22} aria-hidden="true" />}
      </div>
      <div className="adm-item__main">
        <div className="adm-item__title">
          <h3>{ad.title}</h3>
          <span className={`adm-badge adm-badge--${status}`}>{STATUS_LABEL[status]}</span>
          <span className="adm-badge adm-badge--type">{TYPE_LABEL[ad.type]}</span>
        </div>
        {ad.description && <p className="adm-item__desc">{ad.description}</p>}
        <p className="adm-item__meta">
          <span><CalendarClock size={14} aria-hidden="true" /> {scheduleLabel(ad)}</span>
          {ad.type === 'popup' && <span>{freqLabel(ad.frequency)} · after {ad.delaySeconds}s</span>}
          <span>Order {ad.priority}</span>
          {ad.linkUrl && <span className="adm-item__link"><ExternalLink size={14} aria-hidden="true" /> {ad.linkUrl}</span>}
        </p>
      </div>
      <div className="adm-item__actions">
        <label className="adm-toggle">
          <Switch checked={ad.active} busy={busy} label={`${ad.active ? 'Deactivate' : 'Activate'} ${ad.title}`} onChange={() => onToggle(ad)} />
          <span>{ad.active ? 'Active' : 'Inactive'}</span>
        </label>
        <button type="button" className="icon-btn" onClick={() => onEdit(ad)} aria-label={`Edit ${ad.title}`}><Pencil size={18} /></button>
        <button type="button" className="icon-btn adm-danger" onClick={() => onDelete(ad)} aria-label={`Delete ${ad.title}`}><Trash2 size={18} /></button>
      </div>
    </li>
  );
}

export default function AdminDashboard({ user }) {
  const { toast } = useApp();
  const now = useNow(30000);
  useIdleSignOut(IDLE_MINUTES);

  const [data, setData] = useState({ status: 'loading', ads: [], error: '' });
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notice, setNotice] = useState('');
  const [busyIds, setBusyIds] = useState(() => new Set());

  const [formOpen, setFormOpen] = useState(false);
  const [formAd, setFormAd] = useState(null);
  const [delOpen, setDelOpen] = useState(false);
  const [delAd, setDelAd] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(
    () => subscribeToAllAds(
      (ads) => setData({ status: 'ready', ads, error: '' }),
      (err) => setData((d) => ({
        ...d,
        status: 'error',
        error: err?.code === 'permission-denied'
          ? 'Firebase refused to load the advertisements. Publish firestore.rules and make sure your account is listed in the admins collection.'
          : 'Could not load advertisements. Check your connection.',
      }))
    ),
    []
  );

  const closeForm = useCallback(() => setFormOpen(false), []);
  const closeDelete = useCallback(() => setDelOpen(false), []);
  const openNew = () => { setFormAd({ ...EMPTY_AD, priority: 10 }); setFormOpen(true); };
  const openEdit = (ad) => { setFormAd(ad); setFormOpen(true); };
  const openDelete = (ad) => { setDelAd(ad); setDelOpen(true); };

  const toggle = async (ad) => {
    setNotice('');
    setBusyIds((s) => new Set(s).add(ad.id));
    try {
      await setAdActive(ad.id, !ad.active);
      toast(ad.active ? 'Advertisement deactivated.' : 'Advertisement activated.');
    } catch {
      setNotice('Could not change that advertisement. Check your connection and try again.');
    } finally {
      setBusyIds((s) => { const n = new Set(s); n.delete(ad.id); return n; });
    }
  };

  const confirmDelete = async () => {
    if (!delAd || deleting) return;
    setDeleting(true);
    setNotice('');
    try {
      await deleteAd(delAd);
      setDelOpen(false);
      toast('Advertisement deleted.');
    } catch {
      setDelOpen(false);
      setNotice('Could not delete that advertisement. Check your connection and try again.');
    } finally {
      setDeleting(false);
    }
  };

  const counts = useMemo(() => {
    const c = { total: data.ads.length, live: 0, scheduled: 0, off: 0 };
    data.ads.forEach((a) => {
      const s = adStatus(a, now);
      if (s === 'live') c.live += 1;
      else if (s === 'scheduled') c.scheduled += 1;
      else c.off += 1;
    });
    return c;
  }, [data.ads, now]);

  const visible = useMemo(
    () => data.ads.filter((a) => (typeFilter === 'all' || a.type === typeFilter) && (statusFilter === 'all' || adStatus(a, now) === statusFilter)),
    [data.ads, typeFilter, statusFilter, now]
  );

  return (
    <div className="adm">
      <header className="adm-top">
        <div className="container adm-top__in">
          <Logo />
          <span className="adm-top__title">Advertisement manager</span>
          <div className="adm-top__right">
            <span className="adm-top__user" title={user.email}>{user.email}</span>
            <a className="link-btn" href="/" target="_blank" rel="noopener noreferrer"><ExternalLink size={15} aria-hidden="true" /> View website</a>
            <Button size="sm" variant="outline" icon={<LogOut size={15} aria-hidden="true" />} onClick={signOutAdmin}>Sign out</Button>
          </div>
        </div>
      </header>

      <main className="container adm-main">
        <div className="adm-head">
          <div>
            <h1>Advertisements</h1>
            <p className="lead">Changes appear on the website the next time a page loads; pages already open refresh within a few minutes. No redeploy needed.</p>
          </div>
          <Button icon={<Plus size={18} aria-hidden="true" />} onClick={openNew}>Add advertisement</Button>
        </div>

        <div className="adm-stats">
          <div><strong>{counts.total}</strong><span>Total</span></div>
          <div><strong>{counts.live}</strong><span>Live now</span></div>
          <div><strong>{counts.scheduled}</strong><span>Scheduled</span></div>
          <div><strong>{counts.off}</strong><span>Off or ended</span></div>
        </div>

        {notice && (
          <div className="adm-alert" role="alert">
            <AlertTriangle size={18} aria-hidden="true" /> <span>{notice}</span>
            <button type="button" className="icon-btn icon-btn--sm" onClick={() => setNotice('')} aria-label="Dismiss"><X size={16} /></button>
          </div>
        )}

        <div className="adm-filters">
          <div className="chips" role="group" aria-label="Filter by type">
            {[['all', 'All'], ['popup', 'Popups'], ['banner', 'Scrolling banners']].map(([val, label]) => (
              <button key={val} type="button" className={`chip chip--btn ${typeFilter === val ? 'is-active' : ''}`} aria-pressed={typeFilter === val} onClick={() => setTypeFilter(val)}>{label}</button>
            ))}
          </div>
          <div className="field adm-filters__status">
            <label htmlFor="adm-status" className="sr-only">Filter by status</label>
            <select id="adm-status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Any status</option>
              <option value="live">Live</option>
              <option value="scheduled">Scheduled</option>
              <option value="inactive">Off</option>
              <option value="expired">Ended</option>
            </select>
          </div>
        </div>

        {data.status === 'loading' && <p className="empty" role="status">Loading advertisements…</p>}
        {data.status === 'error' && <div className="adm-alert" role="alert"><AlertTriangle size={18} aria-hidden="true" /> <span>{data.error}</span></div>}

        {data.status === 'ready' && data.ads.length === 0 && (
          <div className="empty empty--box">
            <p>No advertisements yet. Create your first popup or scrolling banner.</p>
            <Button icon={<Plus size={18} aria-hidden="true" />} onClick={openNew}>Add advertisement</Button>
          </div>
        )}
        {data.status === 'ready' && data.ads.length > 0 && visible.length === 0 && <p className="empty">Nothing matches these filters.</p>}

        {visible.length > 0 && (
          <ul className="adm-list">
            {visible.map((ad) => (
              <AdRow key={ad.id} ad={ad} now={now} busy={busyIds.has(ad.id)} onToggle={toggle} onEdit={openEdit} onDelete={openDelete} />
            ))}
          </ul>
        )}
      </main>

      <AdFormModal open={formOpen} ad={formAd} onClose={closeForm} onSaved={(msg) => toast(msg)} />

      <Modal open={delOpen} onClose={closeDelete} title="Delete advertisement?" labelId="ad-delete-title">
        <p className="modal__lead">
          <strong>{delAd?.title}</strong> will be removed from the website for good{delAd?.imagePath ? ', along with its uploaded image' : ''}. To hide it for now, switch it off instead.
        </p>
        <div className="adm-form__foot">
          <Button type="button" variant="outline" onClick={closeDelete} disabled={deleting}>Keep it</Button>
          <Button type="button" onClick={confirmDelete} disabled={deleting}>{deleting ? 'Deleting…' : 'Delete'}</Button>
        </div>
      </Modal>
    </div>
  );
}
