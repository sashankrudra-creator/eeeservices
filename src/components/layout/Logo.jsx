import { Link } from 'react-router-dom';

export function BoltMark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#5E6B55" />
      <path d="M36 8 15 36h14l-4 20 24-31H35z" fill="#FFFFFF" />
    </svg>
  );
}

export default function Logo({ light = true }) {
  return (
    <Link to="/" className={`logo ${light ? 'logo--light' : ''}`} aria-label="Triple E Services home">
      <img src="/images/Triple E Energy Services Logo.png?v=5" alt="Triple E Services" className="logo__img" />
    </Link>
  );
}
