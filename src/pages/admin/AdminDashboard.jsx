import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, BookOpen, CalendarClock, ExternalLink, ImageOff, Layers, LogOut, Megaphone, Pencil, Plus, Trash2, X, Search } from 'lucide-react';
import Logo from '../../components/layout/Logo';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import AdFormModal from './AdFormModal';
import BlogModal from './BlogModal';
import { useApp } from '../../context/AppContext';
import { useNow } from '../../hooks/useAds';
import { deleteAd, setAdActive, subscribeToAllAds } from '../../services/adsService';
import { watchAllBlogs, saveBlog, deleteBlog, toggleBlogPublish } from '../../services/blogsService';
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

function Switch({ checked, label, busy, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={busy}
      className={`sw ${checked ? 'is-on' : ''}`}
      onClick={onChange}
    >
      <span className="sw__knob" />
    </button>
  );
}

function AdRow({ ad, now, busy, onToggle, onEdit, onDelete }) {
  const status = adStatus(ad, now);
  const preview = safeImageUrl(ad.imageUrl);
  return (
    <li className={`adm-item adm-item--${status}`}>
      <div className="adm-item__media">
        {preview ? <img src={preview} alt="" loading="lazy" /> : <div className="adm-item__noimg" aria-hidden="true"><ImageOff size={22} /></div>}
      </div>
      <div className="adm-item__body">
        <div className="adm-item__head">
          <span className={`chip-status chip-status--${status}`}>{STATUS_LABEL[status]}</span>
          <span className="adm-item__type">{TYPE_LABEL[ad.type]}</span>
          <span className="adm-item__freq">{freqLabel(ad.frequency)}</span>
          <span className="adm-item__pri">Order {ad.priority}</span>
        </div>
        <h3 className="adm-item__title">{ad.title}</h3>
        {ad.description && <p className="adm-item__desc">{ad.description}</p>}
        <p className="adm-item__sched">
          <CalendarClock size={14} aria-hidden="true" />
          <span>{scheduleLabel(ad)}</span>
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

function BlogRow({ blog, onToggle, onEdit, onDelete }) {
  const thumb = blog.imageUrl || blog.coverImage;
  return (
    <li className={`adm-item ${blog.published ? 'adm-item--live' : 'adm-item--inactive'}`}>
      <div className="adm-item__thumb">
        {thumb ? (
          <img src={thumb} alt="" loading="lazy" />
        ) : (
          <ImageOff size={22} aria-hidden="true" />
        )}
      </div>
      <div className="adm-item__body">
        <div className="adm-item__meta" style={{ margin: '0 0 8px', gap: '8px', alignItems: 'center' }}>
          <span className={`adm-badge ${blog.published ? 'adm-badge--live' : 'adm-badge--inactive'}`}>
            {blog.published ? 'Published' : 'Draft'}
          </span>
          <span className="adm-badge adm-badge--type">{blog.category}</span>
          <span style={{ fontSize: '12.5px', color: 'var(--ink-2)' }}>{blog.readTime}</span>
          <span style={{ fontSize: '12.5px', color: 'var(--ink-2)' }}>{blog.date}</span>
        </div>
        <div className="adm-item__title">
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>{blog.title}</h3>
        </div>
        {blog.excerpt && <p className="adm-item__desc">{blog.excerpt}</p>}
        <div className="adm-item__meta" style={{ marginTop: '8px', fontSize: '12.5px', color: 'var(--ink-2)' }}>
          <span>By <strong>{blog.author}</strong></span>
          <span style={{ color: 'var(--green-d)', fontFamily: 'monospace' }}>/blog/{blog.slug}</span>
        </div>
      </div>
      <div className="adm-item__actions">
        <label className="adm-toggle">
          <Switch
            checked={blog.published}
            label={`${blog.published ? 'Unpublish' : 'Publish'} ${blog.title}`}
            onChange={() => onToggle(blog)}
          />
          <span>{blog.published ? 'Live' : 'Draft'}</span>
        </label>
        <button type="button" className="icon-btn" onClick={() => onEdit(blog)} aria-label={`Edit ${blog.title}`}>
          <Pencil size={18} />
        </button>
        <button type="button" className="icon-btn adm-danger" onClick={() => onDelete(blog)} aria-label={`Delete ${blog.title}`}>
          <Trash2 size={18} />
        </button>
      </div>
    </li>
  );
}

export default function AdminDashboard({ user }) {
  const { toast } = useApp();
  const now = useNow(30000);
  useIdleSignOut(IDLE_MINUTES);

  const [activeTab, setActiveTab] = useState('ads'); // 'ads' | 'blogs'

  // Ads state
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

  // Blogs state
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [blogCatFilter, setBlogCatFilter] = useState('all');
  const [blogSearch, setBlogSearch] = useState('');
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [delBlogOpen, setDelBlogOpen] = useState(false);
  const [delBlogItem, setDelBlogItem] = useState(null);

  // Subscriptions
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

  useEffect(() => {
    const unsub = watchAllBlogs(
      (items) => {
        setBlogs(items);
        setBlogsLoading(false);
      },
      () => setBlogsLoading(false)
    );
    return () => unsub();
  }, []);

  // Ads handlers
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
    if (!delAd) return;
    setDeleting(true);
    try {
      await deleteAd(delAd);
      toast('Advertisement deleted.');
      closeDelete();
    } catch {
      setNotice('Could not delete that advertisement.');
    } finally {
      setDeleting(false);
    }
  };

  // Blogs handlers
  const openNewBlog = () => {
    setEditingBlog(null);
    setBlogModalOpen(true);
  };
  const openEditBlog = (b) => {
    setEditingBlog(b);
    setBlogModalOpen(true);
  };
  const openDeleteBlog = (b) => {
    setDelBlogItem(b);
    setDelBlogOpen(true);
  };
  const togglePublish = async (b) => {
    try {
      await toggleBlogPublish(b.id, b.published);
      toast(b.published ? 'Article unpublished (moved to drafts).' : 'Article published live!');
    } catch {
      toast('Could not update article status.');
    }
  };
  const confirmDeleteBlog = async () => {
    if (!delBlogItem) return;
    try {
      await deleteBlog(delBlogItem.id, delBlogItem.imagePath);
      toast('Article deleted successfully.');
      setDelBlogOpen(false);
    } catch {
      toast('Could not delete article.');
    }
  };
  const handleSaveBlog = async (blogData) => {
    await saveBlog(blogData);
    toast(blogData.id ? 'Article updated successfully!' : 'New article created and published!');
  };

  // Computations
  const counts = useMemo(() => {
    const total = data.ads.length;
    let live = 0; let scheduled = 0; let off = 0;
    for (const a of data.ads) {
      const s = adStatus(a, now);
      if (s === 'live') live += 1;
      else if (s === 'scheduled') scheduled += 1;
      else off += 1;
    }
    return { total, live, scheduled, off };
  }, [data.ads, now]);

  const visible = useMemo(
    () => data.ads.filter((a) => (typeFilter === 'all' || a.type === typeFilter) && (statusFilter === 'all' || adStatus(a, now) === statusFilter)),
    [data.ads, typeFilter, statusFilter, now]
  );

  const blogCategories = useMemo(() => {
    const set = new Set();
    blogs.forEach((b) => b.category && set.add(b.category));
    return ['all', ...Array.from(set)];
  }, [blogs]);

  const visibleBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchesCat = blogCatFilter === 'all' || b.category === blogCatFilter;
      const matchesSearch = !blogSearch.trim() ||
        b.title.toLowerCase().includes(blogSearch.toLowerCase()) ||
        b.excerpt.toLowerCase().includes(blogSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [blogs, blogCatFilter, blogSearch]);

  const blogCounts = useMemo(() => {
    const total = blogs.length;
    const published = blogs.filter((b) => b.published).length;
    const drafts = total - published;
    return { total, published, drafts };
  }, [blogs]);

  return (
    <div className="adm">
      <header className="adm-top">
        <div className="container adm-top__in">
          <Logo />
          <span className="adm-top__title">Portal Manager</span>
          <div className="adm-top__right">
            <span className="adm-top__user" title={user.email}>{user.email}</span>
            <a className="link-btn" href="/" target="_blank" rel="noopener noreferrer"><ExternalLink size={15} aria-hidden="true" /> View website</a>
            <Button size="sm" variant="outline" icon={<LogOut size={15} aria-hidden="true" />} onClick={signOutAdmin}>Sign out</Button>
          </div>
        </div>
      </header>

      <main className="container adm-main">
        {/* Navigation Tabs between Ads and Blogs */}
        <nav className="adm-nav-tabs" aria-label="Admin Modules">
          <button
            type="button"
            className={`adm-nav-tab ${activeTab === 'ads' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('ads')}
          >
            <Megaphone size={18} aria-hidden="true" />
            <span>Advertisements</span>
            <span className="adm-tab-badge">{counts.total}</span>
          </button>
          <button
            type="button"
            className={`adm-nav-tab ${activeTab === 'blogs' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('blogs')}
          >
            <BookOpen size={18} aria-hidden="true" />
            <span>Blogs & Articles</span>
            <span className="adm-tab-badge">{blogCounts.total}</span>
          </button>
        </nav>

        {notice && (
          <div className="adm-alert" role="alert">
            <AlertTriangle size={18} aria-hidden="true" /> <span>{notice}</span>
            <button type="button" className="icon-btn icon-btn--sm" onClick={() => setNotice('')} aria-label="Dismiss"><X size={16} /></button>
          </div>
        )}

        {/* TAB 1: ADVERTISEMENTS */}
        {activeTab === 'ads' && (
          <>
            <div className="adm-head">
              <div>
                <h1>Advertisements</h1>
                <p className="lead">Manage promotional popup alerts and continuous scrolling banner strips on the live site.</p>
              </div>
              <Button icon={<Plus size={18} aria-hidden="true" />} onClick={openNew}>Add advertisement</Button>
            </div>

            <div className="adm-stats">
              <div><strong>{counts.total}</strong><span>Total</span></div>
              <div><strong>{counts.live}</strong><span>Live now</span></div>
              <div><strong>{counts.scheduled}</strong><span>Scheduled</span></div>
              <div><strong>{counts.off}</strong><span>Off or ended</span></div>
            </div>

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
          </>
        )}

        {/* TAB 2: BLOGS & ARTICLES */}
        {activeTab === 'blogs' && (
          <>
            <div className="adm-head">
              <div>
                <h1>Engineering Insights & Blogs</h1>
                <p className="lead">Publish technical articles, case studies, boiler overhauls, and solar updates to the public website.</p>
              </div>
              <Button icon={<Plus size={18} aria-hidden="true" />} onClick={openNewBlog}>Write new article</Button>
            </div>

            <div className="adm-stats">
              <div><strong>{blogCounts.total}</strong><span>Total Articles</span></div>
              <div><strong>{blogCounts.published}</strong><span>Published Live</span></div>
              <div><strong>{blogCounts.drafts}</strong><span>Saved Drafts</span></div>
              <div><strong>{blogCategories.length - 1}</strong><span>Categories</span></div>
            </div>

            <div className="adm-filters" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div className="chips" role="group" aria-label="Filter by category">
                {blogCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`chip chip--btn ${blogCatFilter === cat ? 'is-active' : ''}`}
                    onClick={() => setBlogCatFilter(cat)}
                  >
                    {cat === 'all' ? 'All Categories' : cat}
                  </button>
                ))}
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '220px' }}>
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={blogSearch}
                  onChange={(e) => setBlogSearch(e.target.value)}
                  style={{ height: '38px', borderRadius: '8px', border: '1px solid var(--line)', padding: '0 12px', fontSize: '13.5px', width: '100%' }}
                />
              </div>
            </div>

            {blogsLoading && <p className="empty" role="status">Loading articles…</p>}

            {!blogsLoading && blogs.length === 0 && (
              <div className="empty empty--box">
                <p>No articles yet. Write and publish your company's first engineering insight.</p>
                <Button icon={<Plus size={18} aria-hidden="true" />} onClick={openNewBlog}>Write new article</Button>
              </div>
            )}

            {!blogsLoading && blogs.length > 0 && visibleBlogs.length === 0 && (
              <p className="empty">No articles match your category or search filter.</p>
            )}

            {visibleBlogs.length > 0 && (
              <ul className="adm-list">
                {visibleBlogs.map((b) => (
                  <BlogRow
                    key={b.id}
                    blog={b}
                    onToggle={togglePublish}
                    onEdit={openEditBlog}
                    onDelete={openDeleteBlog}
                  />
                ))}
              </ul>
            )}
          </>
        )}
      </main>

      {/* Ad Modal */}
      <AdFormModal open={formOpen} ad={formAd} onClose={closeForm} onSaved={(msg) => toast(msg)} />

      {/* Blog Modal */}
      {blogModalOpen && (
        <BlogModal
          blog={editingBlog}
          onClose={() => setBlogModalOpen(false)}
          onSave={handleSaveBlog}
        />
      )}

      {/* Delete Ad Confirmation Modal */}
      <Modal open={delOpen} onClose={closeDelete} title="Delete advertisement">
        <p>Delete &ldquo;<strong>{delAd?.title}</strong>&rdquo;?</p>
        <p className="adm-small">This cannot be undone. Any image file in Storage is removed too.</p>
        <div className="modal__foot">
          <Button variant="ghost" onClick={closeDelete} disabled={deleting}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleting}>{deleting ? 'Deleting…' : 'Delete'}</Button>
        </div>
      </Modal>

      {/* Delete Blog Confirmation Modal */}
      <Modal open={delBlogOpen} onClose={() => setDelBlogOpen(false)} title="Delete article">
        <p>Delete article &ldquo;<strong>{delBlogItem?.title}</strong>&rdquo;?</p>
        <p className="adm-small">This article will be permanently removed from the website.</p>
        <div className="modal__foot">
          <Button variant="ghost" onClick={() => setDelBlogOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDeleteBlog}>Delete article</Button>
        </div>
      </Modal>
    </div>
  );
}
