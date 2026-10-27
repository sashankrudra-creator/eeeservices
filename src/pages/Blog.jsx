import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calendar, Clock, Search, Tag, User } from 'lucide-react';
import PageHero from '../components/ui/PageHero';
import CTABanner from '../components/sections/CTABanner';
import Reveal from '../components/ui/Reveal';
import FilterChips from '../components/ui/FilterChips';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { watchLiveBlogs } from '../services/blogsService';
import { useApp } from '../context/AppContext';

export default function Blog() {
  useDocumentTitle('Blog & Engineering Insights');
  const { openQuote } = useApp();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');

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

  const categories = useMemo(() => {
    const set = new Set();
    blogs.forEach((b) => b.category && set.add(b.category));
    return ['All', ...Array.from(set)];
  }, [blogs]);

  const filtered = useMemo(() => {
    return blogs.filter((b) => {
      const matchCat = selectedCat === 'All' || b.category === selectedCat;
      const matchSearch =
        !search.trim() ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        b.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [blogs, selectedCat, search]);

  const featured = filtered.length > 0 ? filtered[0] : null;
  const rest = filtered.length > 1 ? filtered.slice(1) : [];

  const heroCards = [
    {
      type: 'wide',
      thumb: '/images/bed-coil-boiler.jpg',
      title: 'FIELD-TESTED KNOWLEDGE',
      desc: 'Technical insights directly from our IBR-certified engineers and site managers.',
      linkText: 'EXPLORE ARTICLES',
      linkHref: '#articles-grid',
    },
    {
      type: 'stat',
      value: `${blogs.length || 4}`,
      label: 'PUBLISHED GUIDES',
      badgeIcon: true,
    },
    {
      type: 'feature',
      iconImg: '/images/generated/tree_icon.jpg',
      title: 'SPECIALISED SUBJECTS',
      desc: 'Boiler tube erosion, 400 kV quad line maintenance, solar PR and C&I calibration.',
    },
  ];

  return (
    <>
      <PageHero
        image="/images/generated/hero_industrial_plant.jpg"
        eyebrow="ENGINEERING INSIGHTS"
        title="TECHNICAL GUIDES, PLANT CASE STUDIES & UPDATES"
        text="Field-tested engineering knowledge, preventative maintenance methodologies and regulatory best practices from Triple E Services."
        ctaText="Request a Consultation"
        onCtaClick={() => openQuote('Engineering Enquiry')}
        cards={heroCards}
      />

      <section className="section" id="articles-grid">
        <div className="container">
          {/* Controls: Filter chips + Search */}
          <div className="toolbar" style={{ justifyContent: 'space-between', marginBottom: '32px' }}>
            <FilterChips
              options={categories}
              value={selectedCat}
              onChange={setSelectedCat}
              label="Article categories"
            />
            <div className="search" style={{ maxWidth: '300px' }}>
              <Search size={18} aria-hidden="true" />
              <input
                type="search"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search articles"
              />
            </div>
          </div>

          {loading && (
            <div className="empty empty--box">
              <p>Loading engineering insights…</p>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="empty empty--box">
              <p>No articles found matching &ldquo;{search}&rdquo; in {selectedCat}.</p>
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => { setSelectedCat('All'); setSearch(''); }}
                style={{ marginTop: '12px' }}
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Featured Post */}
          {!loading && featured && (
            <Reveal className="blog-featured" delay={0.05}>
              <div className="blog-featured__media">
                <img
                  src={featured.imageUrl || featured.coverImage || '/images/bed-coil-boiler.jpg'}
                  alt={featured.title}
                  loading="eager"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/bed-coil-boiler.jpg';
                  }}
                />
                <span className="blog-card__cat">{featured.category}</span>
              </div>
              <div className="blog-featured__content">
                <div className="blog-card__meta">
                  <span><Calendar size={14} aria-hidden="true" /> {featured.date}</span>
                  <span className="sep">•</span>
                  <span><Clock size={14} aria-hidden="true" /> {featured.readTime}</span>
                </div>
                <h2 className="blog-featured__title">
                  <Link to={`/blog/${featured.slug}`}>{featured.title}</Link>
                </h2>
                <p className="blog-featured__excerpt">{featured.excerpt}</p>
                <div className="blog-featured__foot">
                  <span className="blog-card__author"><User size={14} aria-hidden="true" /> {featured.author}</span>
                  <Link to={`/blog/${featured.slug}`} className="btn btn--primary" style={{ padding: '8px 18px', fontSize: '13.5px' }}>
                    <span>Read Article</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </Reveal>
          )}

          {/* Grid of Other Articles */}
          {!loading && rest.length > 0 && (
            <div className="blog-grid" style={{ marginTop: '40px' }}>
              {rest.map((b, i) => (
                <Reveal key={b.id || b.slug} delay={i * 0.08} className="blog-card">
                  <Link to={`/blog/${b.slug}`} className="blog-card__media">
                    <img
                      src={b.imageUrl || b.coverImage || '/images/bed-coil-boiler.jpg'}
                      alt={b.title}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/bed-coil-boiler.jpg';
                      }}
                    />
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
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
