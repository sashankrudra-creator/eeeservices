import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, Clock, Share2, Tag, User, CheckCircle2, BookmarkCheck, Phone } from 'lucide-react';
import { watchLiveBlogs } from '../services/blogsService';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Button from '../components/ui/Button';
import CTABanner from '../components/sections/CTABanner';
import { useApp } from '../context/AppContext';

export default function BlogPost() {
  const { slug } = useParams();
  const { openQuote, toast } = useApp();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsub = watchLiveBlogs(
      (items) => {
        setBlogs(items);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, []);

  const blog = useMemo(() => {
    return blogs.find((b) => b.slug === slug || b.id === slug);
  }, [blogs, slug]);

  const related = useMemo(() => {
    if (!blog) return [];
    return blogs
      .filter((b) => b.slug !== slug && b.id !== slug)
      .slice(0, 3);
  }, [blogs, blog, slug]);

  useDocumentTitle(blog ? `${blog.title} — Triple E Services` : 'Engineering Article');

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    toast('Article link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="section">
        <div className="container" style={{ minHeight: '50vh', display: 'grid', placeItems: 'center' }}>
          <p className="empty">Loading article…</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
          <h1>Article Not Found</h1>
          <p className="lead" style={{ marginTop: '12px' }}>The article you are looking for may have been updated or moved.</p>
          <Link to="/blog" className="btn btn--primary" style={{ marginTop: '20px' }}>
            <ArrowLeft size={16} /> Back to all articles
          </Link>
        </div>
      </div>
    );
  }

  // Simple rich parser for markdown headings & bullet lists
  const renderFormattedContent = (rawText) => {
    if (!rawText) return null;
    const lines = rawText.split('\n');
    const elements = [];
    let currentList = [];

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="article-body__list">
            {currentList.map((item, idx) => (
              <li key={idx}><CheckCircle2 size={16} aria-hidden="true" /> <span>{item}</span></li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) {
        flushList();
        return;
      }

      if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(<h3 key={i} className="article-body__h3">{trimmed.replace('### ', '')}</h3>);
      } else if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(<h2 key={i} className="article-body__h2">{trimmed.replace('## ', '')}</h2>);
      } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
        const cleaned = trimmed.replace(/^(\*|-|\d+\.)\s+/, '');
        currentList.push(cleaned);
      } else {
        flushList();
        elements.push(<p key={i} className="article-body__p">{trimmed}</p>);
      }
    });

    flushList();
    return elements;
  };

  return (
    <article className="article-page">
      {/* Top Breadcrumb & Hero */}
      <header className="article-header">
        <div className="container container--narrow">
          <nav className="article-breadcrumbs" aria-label="Breadcrumbs">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <Link to="/blog">Blog</Link>
            <span className="sep">/</span>
            <span className="current">{blog.category}</span>
          </nav>

          <div className="article-header__meta">
            <span className="article-header__cat">{blog.category}</span>
            <span className="article-header__dot" aria-hidden="true">•</span>
            <span><Calendar size={14} aria-hidden="true" /> {blog.date}</span>
            <span className="article-header__dot" aria-hidden="true">•</span>
            <span><Clock size={14} aria-hidden="true" /> {blog.readTime}</span>
          </div>

          <h1 className="article-header__title">{blog.title}</h1>

          <div className="article-header__author-row">
            <div className="article-header__author-info">
              <span className="article-header__avatar"><User size={18} /></span>
              <div>
                <strong>{blog.author}</strong>
                <span>Engineering & O&M Division</span>
              </div>
            </div>
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={handleCopyLink}
              aria-label="Share article link"
              style={{ padding: '6px 14px', fontSize: '13px' }}
            >
              <Share2 size={15} />
              <span>{copied ? 'Link Copied!' : 'Share Article'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Featured Cover Banner */}
      {(blog.imageUrl || blog.coverImage) && (
        <div className="container container--narrow article-cover">
          <img
            src={blog.imageUrl || blog.coverImage || '/images/bed-coil-boiler.jpg'}
            alt={blog.title}
            loading="eager"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/bed-coil-boiler.jpg';
            }}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="container container--narrow article-content">
        {/* Executive summary callout */}
        {blog.excerpt && (
          <div className="article-callout" role="note">
            <BookmarkCheck size={24} aria-hidden="true" />
            <div>
              <strong>Executive Summary:</strong>
              <p>{blog.excerpt}</p>
            </div>
          </div>
        )}

        <div className="article-body">
          {renderFormattedContent(blog.content)}
        </div>

        {/* Article consultation prompt */}
        <div className="article-cta-box">
          <div>
            <h3>Need specialised engineering support for your facility?</h3>
            <p>Our Special Class IBR certified engineers, BOE team, and high-voltage specialists can audit, revamp, or operate your plant assets.</p>
          </div>
          <Button onClick={() => openQuote(`${blog.title} Consultation`)}>
            Request Technical Consultation
          </Button>
        </div>

        {/* Back Link */}
        <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: '1px solid var(--line)' }}>
          <Link to="/blog" className="link-btn" style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={16} /> Back to all insights
          </Link>
        </div>
      </div>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="section section--mist" style={{ marginTop: '60px' }}>
          <div className="container">
            <h2 style={{ fontSize: '1.6rem', marginBottom: '28px' }}>Related Engineering Articles</h2>
            <div className="grid grid--3 blog-grid">
              {related.map((b) => (
                <div key={b.id || b.slug} className="blog-card">
                  <Link to={`/blog/${b.slug}`} className="blog-card__media">
                    <img src={b.imageUrl || '/images/bed-coil-boiler.jpg'} alt={b.title} loading="lazy" />
                    <span className="blog-card__cat">{b.category}</span>
                  </Link>
                  <div className="blog-card__body">
                    <div className="blog-card__meta">
                      <span><Calendar size={13} aria-hidden="true" /> {b.date}</span>
                      <span className="sep">•</span>
                      <span><Clock size={13} aria-hidden="true" /> {b.readTime}</span>
                    </div>
                    <h3 className="blog-card__title">
                      <Link to={`/blog/${b.slug}`}>{b.title}</Link>
                    </h3>
                    <p className="blog-card__excerpt">{b.excerpt}</p>
                    <div className="blog-card__foot">
                      <span className="blog-card__author"><User size={13} aria-hidden="true" /> {b.author}</span>
                      <Link to={`/blog/${b.slug}`} className="blog-card__link">
                        <span>Read</span>
                        <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABanner />
    </article>
  );
}
