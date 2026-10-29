import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import Tabs from '../ui/Tabs';
import SearchInput from '../ui/SearchInput';
import FilterChips from '../ui/FilterChips';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Counter from '../ui/Counter';
import { contracts, contractCategories } from '../../data/contracts';
import { electricalProjects } from '../../data/electricalProjects';
import { solarProjects } from '../../data/solarProjects';
import { useApp } from '../../context/AppContext';

const sorters = {
  name: (a, b) => a.client.localeCompare(b.client),
  new: (a, b) => b.year - a.year,
  old: (a, b) => a.year - b.year,
};

export default function ProjectsExplorer() {
  const [tab, setTab] = useState('solar');
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [loc, setLoc] = useState('All');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('new');
  const [detail, setDetail] = useState(null);
  const { openQuote } = useApp();

  const data = tab === 'om' ? contracts : tab === 'solar' ? solarProjects : electricalProjects;
  const states = useMemo(() => [...new Set(data.map((d) => d.state))].sort(), [data]);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return data
      .filter((d) => (tab !== 'om' || cat === 'All' || d.category === cat))
      .filter((d) => loc === 'All' || d.state === loc)
      .filter((d) => status === 'All' || (status === 'Ongoing' ? d.ongoing : !d.ongoing))
      .filter((d) => !s || `${d.work} ${d.client} ${d.location} ${d.duration} ${d.capacity || ''} ${d.scope || ''}`.toLowerCase().includes(s))
      .sort(sorters[sort]);
  }, [data, tab, q, cat, loc, status, sort]);

  const switchTab = (t) => { setTab(t); setCat('All'); setLoc('All'); setStatus('All'); setQ(''); };
  const clear = () => { setQ(''); setCat('All'); setLoc('All'); setStatus('All'); };
  const filtered = q || cat !== 'All' || loc !== 'All' || status !== 'All';

  const summary = [
    ['Total projects', data.length],
    ['States covered', new Set(data.map((d) => d.state)).size],
    ['Ongoing', data.filter((d) => d.ongoing).length],
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="summary">
          {summary.map(([l, v]) => (<div key={`${tab}-${l}`}><strong><Counter value={v} /></strong><span>{l}</span></div>))}
        </div>

        <Tabs
          variant="underline"
          label="Project types"
          active={tab}
          onChange={switchTab}
          tabs={[
            { id: 'solar', label: 'Solar Erection & Commissioning', icon: 'Sun', count: solarProjects.length },
            { id: 'om', label: 'O&M Services', icon: 'Settings', count: contracts.length },
            { id: 'elec', label: 'Electrical Projects', icon: 'Zap', count: electricalProjects.length },
          ]}
        />

        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
          <div className="filters">
            <SearchInput value={q} onChange={setQ} placeholder="Search client, work, capacity or location" label="Search projects" />
            <label className="select">
              <span className="sr-only">Location</span>
              <select value={loc} onChange={(e) => setLoc(e.target.value)}>
                <option value="All">All states</option>
                {states.map((s) => (<option key={s}>{s}</option>))}
              </select>
            </label>
            <label className="select">
              <span className="sr-only">Status</span>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="All">Ongoing + Completed</option>
                <option>Ongoing</option>
                <option>Completed</option>
              </select>
            </label>
            <label className="select">
              <span className="sr-only">Sort by</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="new">Newest first</option>
                <option value="old">Oldest first</option>
                <option value="name">Client A–Z</option>
              </select>
            </label>
          </div>
          {tab === 'om' && <FilterChips options={contractCategories} value={cat} onChange={setCat} label="Category" />}

          <p className="count" aria-live="polite">Showing {rows.length} of {data.length}</p>

          {rows.length === 0 ? (
            <div className="empty empty--box">
              <p>No projects match your filters.</p>
              <Button variant="dark" onClick={clear}>Clear filters</Button>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>Nature of work</th><th>Client</th><th>Duration</th><th>Location</th><th><span className="sr-only">Details</span></th></tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <motion.tr key={`${tab}-${r.id}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 10) * 0.025 }} onClick={() => setDetail(r)}>
                      <td data-label="Work" className="t-work">
                        <span style={{ fontWeight: 600 }}>{r.work}</span>
                        {r.capacity && <span style={{ display: 'block', fontSize: '12px', color: 'var(--olive-d, #495e35)', marginTop: '2px' }}>Capacity: {r.capacity}</span>}
                      </td>
                      <td data-label="Client">{r.client}</td>
                      <td data-label="Duration"><span className={`dotted ${r.ongoing ? 'on' : ''}`}>{r.duration}</span></td>
                      <td data-label="Location">{r.location}</td>
                      <td className="t-act"><button className="link-btn" onClick={(e) => { e.stopPropagation(); setDetail(r); }} aria-label={`Details: ${r.client}`}>Details <ArrowRight size={14} aria-hidden="true" /></button></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {filtered && rows.length > 0 && <button className="link-btn" onClick={clear}>Clear filters</button>}
        </div>
      </div>

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.client || ''} labelId="proj-title">
        {detail && (
          <div className="detail-modal">
            <p className="detail-modal__work">{detail.work}</p>
            <dl className="dl">
              <div><dt><Calendar size={16} aria-hidden="true" /> Duration</dt><dd>{detail.duration}</dd></div>
              <div><dt><MapPin size={16} aria-hidden="true" /> Location</dt><dd>{detail.location}</dd></div>
              <div><dt>Status</dt><dd><span className={`badge ${detail.ongoing ? 'badge--green' : ''}`}>{detail.ongoing ? 'Ongoing' : 'Completed'}</span></dd></div>
              {detail.capacity && <div><dt>Capacity / Scale</dt><dd>{detail.capacity}</dd></div>}
              {detail.category && <div><dt>Category</dt><dd>{detail.category}</dd></div>}
              {detail.scope && <div style={{ gridColumn: '1 / -1' }}><dt>Scope of Execution</dt><dd style={{ fontSize: '13.5px', lineHeight: 1.5 }}>{detail.scope}</dd></div>}
            </dl>
            <p className="muted">Related services</p>
            <ul className="chips">
              <li className="chip">
                {tab === 'solar'
                  ? 'Solar Erection & Commissioning'
                  : tab === 'om'
                  ? 'Operations & Maintenance'
                  : 'Electrical EPC & E&I'}
              </li>
              {detail.category && <li className="chip">{detail.category}</li>}
              {detail.capacity && <li className="chip">{detail.capacity}</li>}
            </ul>
            <Button onClick={() => {
              const svc = tab === 'solar'
                ? 'Solar Plant Erection, Commissioning & O&M'
                : tab === 'om'
                ? 'Power Plant O&M'
                : 'Erection & Commissioning';
              setDetail(null);
              setTimeout(() => openQuote(svc), 250);
            }}>
              Discuss a similar project
            </Button>
          </div>
        )}
      </Modal>
    </section>
  );
}
