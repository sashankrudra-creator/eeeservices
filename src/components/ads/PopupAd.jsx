import { useCallback, useEffect, useRef, useState } from 'react';
import Modal from '../ui/Modal';
import { PopupAdBody } from './AdViews';
import useAds from '../../hooks/useAds';
import { markPopupShown, pickPopup } from '../../utils/adRules';

// Shows at most one popup advertisement per page load, after the delay the admin
// chose, and only if it is active, inside its schedule and allowed by its
// frequency setting. Renders nothing at all when there is nothing to show.
export default function PopupAd() {
  const { ads } = useAds();
  const [ad, setAd] = useState(null);
  const [open, setOpen] = useState(false);
  const shown = useRef(false);

  useEffect(() => {
    if (shown.current) return undefined;
    const candidate = pickPopup(ads);
    if (!candidate) return undefined;
    const timer = setTimeout(() => {
      shown.current = true;
      markPopupShown(candidate);
      setAd(candidate);
      setOpen(true);
    }, Math.max(0, candidate.delaySeconds) * 1000);
    return () => clearTimeout(timer);
  }, [ads]);

  const close = useCallback(() => setOpen(false), []);

  if (!ad) return null;
  return (
    <Modal open={open} onClose={close} title={ad.title} labelId="ad-popup-title">
      <PopupAdBody ad={ad} onAction={close} />
    </Modal>
  );
}
