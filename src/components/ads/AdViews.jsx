import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import { isInternalLink, isWebLink, safeImageUrl, safeUrl } from '../../utils/adRules';
import './ads.css';

// Link props for an ad: internal paths use the router, everything else a normal anchor.
function linkProps(ad) {
  const href = safeUrl(ad.linkUrl);
  if (!href) return null;
  if (isInternalLink(href)) return { internal: true, to: href };
  const newTab = ad.newTab && isWebLink(href);
  return { internal: false, href, ...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}) };
}

/* Body of the popup: image, description and the call-to-action button.
   The title is rendered by the surrounding modal header. */
export function PopupAdBody({ ad, onAction, preview = false }) {
  const img = safeImageUrl(ad.imageUrl);
  const link = linkProps(ad);
  const label = ad.linkText || 'Learn more';
  return (
    <div className="adpop">
      {img && (
        <div className="adpop__media">
          <img src={img} alt="" draggable={false} />
        </div>
      )}
      {ad.description && <p className="adpop__text">{ad.description}</p>}
      {link && (
        <div className="adpop__actions">
          {preview ? (
            <Button type="button" iconRight={<ArrowRight size={16} aria-hidden="true" />}>{label}</Button>
          ) : link.internal ? (
            <Button to={link.to} onClick={onAction} iconRight={<ArrowRight size={16} aria-hidden="true" />}>{label}</Button>
          ) : (
            <Button href={link.href} target={link.target} rel={link.rel} onClick={onAction} iconRight={<ArrowRight size={16} aria-hidden="true" />}>{label}</Button>
          )}
        </div>
      )}
    </div>
  );
}

/* One scrolling banner card. The whole card is the link. */
export function BannerCard({ ad, preview = false, duplicate = false, solo = false }) {
  const img = safeImageUrl(ad.imageUrl);
  const link = preview ? null : linkProps(ad);
  const cls = `adban ${solo ? 'adban--solo' : ''} ${img ? '' : 'adban--text'} ${link ? 'is-link' : ''}`;
  // The second copy of the loop is hidden from assistive tech and the tab order.
  const dup = duplicate ? { tabIndex: -1 } : {};
  const inner = (
    <>
      {img && <img className="adban__img" src={img} alt="" draggable={false} loading="lazy" />}
      <span className="adban__shade" aria-hidden="true" />
      <span className="adban__text">
        <strong>{ad.title}</strong>
        {ad.description && <small>{ad.description}</small>}
      </span>
      {link && <span className="adban__go" aria-hidden="true"><ArrowRight size={16} /></span>}
    </>
  );
  if (!link) return <div className={cls}>{inner}</div>;
  if (link.internal) return <Link className={cls} to={link.to} {...dup}>{inner}</Link>;
  return <a className={cls} href={link.href} target={link.target} rel={link.rel} {...dup}>{inner}</a>;
}
