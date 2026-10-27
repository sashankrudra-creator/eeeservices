import { useState, useEffect } from 'react';
import { X, Loader2, BookOpen, Sparkles, Image, Check } from 'lucide-react';
import Button from '../../components/ui/Button';

const CATEGORIES = [
  'Boiler Engineering',
  'Power Plant O&M',
  'Solar Energy',
  'Transmission & Substations',
  'Instrumentation & Automation',
  'Industry Insights',
];

export default function BlogModal({ blog, onClose, onSave }) {
  const [title, setTitle] = useState(blog?.title || '');
  const [category, setCategory] = useState(blog?.category || CATEGORIES[0]);
  const [customCat, setCustomCat] = useState('');
  const [author, setAuthor] = useState(blog?.author || 'Triple E Engineering Team');
  const [readTime, setReadTime] = useState(blog?.readTime || '5 min read');
  const [imageUrl, setImageUrl] = useState(blog?.imageUrl || '');
  const [excerpt, setExcerpt] = useState(blog?.excerpt || '');
  const [content, setContent] = useState(blog?.content || '');
  const [published, setPublished] = useState(blog ? blog.published : true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Sample image suggestions for fast selection
  const imagePresets = [
    { label: 'AI Boiler Bed Coils', url: '/images/ai/boiler-overhaul.jpg' },
    { label: 'AI Utility Solar EPC', url: '/images/ai/solar-epc.jpg' },
    { label: 'AI 400kV Lines', url: '/images/ai/transmission-line.jpg' },
    { label: 'AI C&I Automation', url: '/images/ai/ci-automation.jpg' },
    { label: 'AI Plant Maintenance', url: '/images/ai/ad-maintenance.jpg' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setError('');

    if (!title.trim()) {
      setError('Article title is required.');
      return;
    }
    if (!excerpt.trim()) {
      setError('Please provide a short summary/excerpt.');
      return;
    }
    if (!content.trim()) {
      setError('Article content cannot be empty.');
      return;
    }

    setBusy(true);
    try {
      const finalCategory = category === 'Custom' ? (customCat.trim() || 'General') : category;
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      await onSave({
        id: blog?.id,
        title: title.trim(),
        slug,
        category: finalCategory,
        author: author.trim() || 'Triple E Team',
        readTime: readTime.trim() || '5 min read',
        imageUrl: imageUrl.trim() || '/images/bed-coil-boiler.jpg',
        excerpt: excerpt.trim(),
        content: content.trim(),
        published,
      });
      onClose();
    } catch (err) {
      setError(err?.message || 'Failed to save blog post.');
      setBusy(false);
    }
  };

  return (
    <div className="adm-modal" role="dialog" aria-modal="true" aria-label="Blog post editor">
      <div className="adm-modal__backdrop" onClick={onClose} />
      <div className="adm-modal__body adm-modal__body--wide">
        <div className="adm-modal__head">
          <h2>
            <BookOpen size={20} aria-hidden="true" />
            {blog ? 'Edit Article' : 'Write New Article'}
          </h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="adm-modal__form">
          {error && <div className="adm-alert" role="alert">{error}</div>}

          <div className="field">
            <label htmlFor="blog-title">Article Title *</label>
            <input
              id="blog-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Best Practices for High-Pressure Boiler Bed Coil Overhauls"
              required
              autoFocus
            />
          </div>

          <div className="adm-grid-2">
            <div className="field">
              <label htmlFor="blog-category">Category</label>
              <select
                id="blog-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="Custom">+ Custom Category...</option>
              </select>
              {category === 'Custom' && (
                <input
                  type="text"
                  value={customCat}
                  onChange={(e) => setCustomCat(e.target.value)}
                  placeholder="Enter custom category"
                  style={{ marginTop: '8px' }}
                />
              )}
            </div>

            <div className="field">
              <label htmlFor="blog-author">Author / Byline</label>
              <input
                id="blog-author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Triple E Engineering Team"
              />
            </div>
          </div>

          <div className="adm-grid-2">
            <div className="field">
              <label htmlFor="blog-readtime">Estimated Read Time</label>
              <input
                id="blog-readtime"
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="5 min read"
              />
            </div>

            <div className="field">
              <label htmlFor="blog-status">Publication Status</label>
              <div style={{ display: 'flex', alignItems: 'center', height: '48px', gap: '12px' }}>
                <label className="adm-check" style={{ margin: 0, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                  />
                  <span>{published ? '🟢 Published (Visible on website)' : '🟡 Draft (Saved privately)'}</span>
                </label>
              </div>
            </div>
          </div>

          <div className="field">
            <label htmlFor="blog-image">Cover Image URL</label>
            <input
              id="blog-image"
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste image URL or pick a preset below"
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
              <span style={{ fontSize: '12px', color: '#666', alignSelf: 'center', marginRight: '4px' }}>Quick Presets:</span>
              {imagePresets.map((p) => (
                <button
                  type="button"
                  key={p.label}
                  className="chip chip--btn"
                  style={{ fontSize: '11.5px', padding: '3px 9px' }}
                  onClick={() => setImageUrl(p.url)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {imageUrl && (
              <div style={{ marginTop: '10px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd', maxWidth: '240px' }}>
                <img src={imageUrl} alt="Cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
            )}
          </div>

          <div className="field">
            <label htmlFor="blog-excerpt">Summary / Excerpt * <span className="adm-opt">(Displays on blog cards)</span></label>
            <textarea
              id="blog-excerpt"
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A concise 2-sentence summary explaining key takeaways..."
              required
            />
          </div>

          <div className="field">
            <label htmlFor="blog-content">Full Article Content * <span className="adm-opt">(Supports paragraphs and ### Headings)</span></label>
            <textarea
              id="blog-content"
              rows={9}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the article content here. Use ### Subheading to create sections, bullet points with *, and clear paragraphs..."
              required
              style={{ fontFamily: 'inherit', lineHeight: '1.6' }}
            />
          </div>

          <div className="adm-modal__foot">
            <Button type="button" variant="ghost" onClick={onClose} disabled={busy}>Cancel</Button>
            <Button type="submit" disabled={busy} icon={busy ? <Loader2 size={16} className="spin" /> : <Check size={16} />}>
              {busy ? 'Saving...' : blog ? 'Update Article' : 'Publish Article'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
