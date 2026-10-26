import { useCallback, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { BannerCard, PopupAdBody } from '../../components/ads/AdViews';
import ImageField from './ImageField';
import { createAd, deleteAdImage, updateAd } from '../../services/adsService';
import {
  AD_TYPES, EMPTY_AD, FREQUENCIES, LIMITS,
  fromLocalInput, normalizeLink, toLocalInput, validateAd,
} from '../../utils/adRules';

const TYPE_HINT = {
  popup: 'A window that opens over the page.',
  banner: 'A clickable banner in the scrolling strip.',
};

function saveMessage(err) {
  if (err?.code === 'permission-denied') return 'Saving was refused. Make sure the Firestore rules are published and your account is an administrator.';
  return 'Could not save. Check your connection and try again.';
}

const intOrBlank = (s) => (s === '' || Number.isNaN(Number.parseInt(s, 10)) ? '' : Number.parseInt(s, 10));

function Preview({ values }) {
  // Show what will actually be saved: a bare "example.com" becomes https://example.com on save.
  const ad = { ...values, linkUrl: normalizeLink(values.linkUrl), title: values.title.trim() || 'Your title appears here' };
  return (
    <div className="adm-prev" aria-hidden="true">
      <p className="adm-prev__label">{values.type === 'popup' ? 'Popup preview' : 'Banner preview'}</p>
      {values.type === 'popup' ? (
        <div className="modal adm-prev__modal">
          <div className="modal__head"><h2>{ad.title}</h2></div>
          <div className="modal__body"><PopupAdBody ad={ad} preview /></div>
        </div>
      ) : (
        <div className="adm-prev__banner"><BannerCard ad={ad} preview /></div>
      )}
    </div>
  );
}

function AdFormBody({ ad, onDone, onClose, cancelRef }) {
  const isEdit = Boolean(ad.id);
  const [v, setV] = useState(() => ({ ...EMPTY_AD, ...ad }));
  // Date fields keep their raw text so half-typed values are not wiped while editing.
  const [startStr, setStartStr] = useState(() => toLocalInput(ad.startAt));
  const [endStr, setEndStr] = useState(() => toLocalInput(ad.endAt));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const initialPath = useRef(ad.imagePath || '');
  const uploaded = useRef([]);
  const saved = useRef(false);

  // If the form is dismissed, files uploaded during this session are thrown away.
  cancelRef.current = () => {
    if (!saved.current) uploaded.current.forEach((p) => deleteAdImage(p));
  };

  // A field's error goes away as soon as the person edits that field.
  const clearErrors = (...keys) => setErrors((cur) => (keys.some((k) => k in cur) ? Object.fromEntries(Object.entries(cur).filter(([k]) => !keys.includes(k))) : cur));
  const set = (patch) => {
    setV((cur) => ({ ...cur, ...patch }));
    clearErrors(...Object.keys(patch), ...('type' in patch ? ['delaySeconds', 'linkText'] : []));
  };
  const values = { ...v, startAt: fromLocalInput(startStr), endAt: fromLocalInput(endStr) };

  const submit = async (e) => {
    e.preventDefault();
    if (saving) return;
    const final = { ...values, linkUrl: normalizeLink(v.linkUrl), title: v.title.trim() };
    const errs = validateAd(final);
    setErrors(errs);
    setSaveError('');
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      document.getElementById(`ad-${first}`)?.focus();
      return;
    }
    setSaving(true);
    try {
      if (isEdit) await updateAd(ad.id, final);
      else await createAd(final);
      saved.current = true;
      // Delete files that are no longer used: the one that was replaced, and any uploaded then swapped out.
      new Set([initialPath.current, ...uploaded.current]).forEach((p) => { if (p && p !== final.imagePath) deleteAdImage(p); });
      onDone(isEdit ? 'Advertisement updated.' : 'Advertisement created.');
    } catch (err) {
      setSaveError(saveMessage(err));
      setSaving(false);
    }
  };

  const isPopup = v.type === 'popup';

  return (
    <form className="adm-form" onSubmit={submit} noValidate>
      <div className="adm-form__grid">
        <div className="form">
          <fieldset className="adm-types">
            <legend>Advertisement type</legend>
            <div className="adm-types__row">
              {AD_TYPES.map((t) => (
                <label key={t.value} className={`adm-type ${v.type === t.value ? 'is-on' : ''}`}>
                  <input type="radio" name="ad-type" value={t.value} checked={v.type === t.value} onChange={() => set({ type: t.value })} />
                  <strong>{t.label}</strong>
                  <small>{TYPE_HINT[t.value]}</small>
                </label>
              ))}
            </div>
          </fieldset>

          <div className={`field ${errors.title ? 'has-error' : ''}`}>
            <label htmlFor="ad-title">Title</label>
            <input id="ad-title" value={v.title} maxLength={LIMITS.title} onChange={(e) => set({ title: e.target.value })} aria-invalid={Boolean(errors.title)} />
            {errors.title && <span className="field__err">{errors.title}</span>}
          </div>

          <div className={`field ${errors.description ? 'has-error' : ''}`}>
            <label htmlFor="ad-description">Description <span className="adm-opt">(optional)</span></label>
            <textarea id="ad-description" rows={3} value={v.description} maxLength={LIMITS.description} onChange={(e) => set({ description: e.target.value })} />
            {errors.description && <span className="field__err">{errors.description}</span>}
          </div>

          <div className={errors.imageUrl ? 'has-error' : ''}>
            <ImageField
              type={v.type}
              imageUrl={v.imageUrl}
              error={errors.imageUrl}
              onChange={(patch) => set(patch)}
              onUploaded={(path) => uploaded.current.push(path)}
            />
          </div>

          <div className="form__row">
            <div className={`field ${errors.linkUrl ? 'has-error' : ''}`}>
              <label htmlFor="ad-linkUrl">Link <span className="adm-opt">(optional)</span></label>
              <input id="ad-linkUrl" value={v.linkUrl} placeholder="https://… or /contact" onChange={(e) => set({ linkUrl: e.target.value })} />
              {errors.linkUrl && <span className="field__err">{errors.linkUrl}</span>}
            </div>
            {isPopup && (
              <div className={`field ${errors.linkText ? 'has-error' : ''}`}>
                <label htmlFor="ad-linkText">Button label</label>
                <input id="ad-linkText" value={v.linkText} maxLength={LIMITS.linkText} placeholder="Learn more" onChange={(e) => set({ linkText: e.target.value })} />
                {errors.linkText && <span className="field__err">{errors.linkText}</span>}
              </div>
            )}
          </div>
          <label className="adm-check">
            <input type="checkbox" checked={v.newTab} onChange={(e) => set({ newTab: e.target.checked })} />
            Open outside links in a new tab
          </label>

          <h3 className="adm-sub">Display</h3>
          <label className="adm-check adm-check--strong">
            <input type="checkbox" checked={v.active} onChange={(e) => set({ active: e.target.checked })} />
            Active (visible on the website)
          </label>
          <div className="form__row">
            <div className={`field ${errors.priority ? 'has-error' : ''}`}>
              <label htmlFor="ad-priority">Display order</label>
              <input id="ad-priority" type="number" min="0" max="999" inputMode="numeric" value={v.priority} onChange={(e) => set({ priority: intOrBlank(e.target.value) })} />
              {errors.priority ? <span className="field__err">{errors.priority}</span> : <span className="form__hint">Lower numbers show first.</span>}
            </div>
            {isPopup && (
              <div className={`field ${errors.delaySeconds ? 'has-error' : ''}`}>
                <label htmlFor="ad-delaySeconds">Show after (seconds)</label>
                <input id="ad-delaySeconds" type="number" min="0" max="60" inputMode="numeric" value={v.delaySeconds} onChange={(e) => set({ delaySeconds: intOrBlank(e.target.value) })} />
                {errors.delaySeconds && <span className="field__err">{errors.delaySeconds}</span>}
              </div>
            )}
          </div>
          {isPopup && (
            <div className="field">
              <label htmlFor="ad-frequency">How often a visitor sees it</label>
              <select id="ad-frequency" value={v.frequency} onChange={(e) => set({ frequency: e.target.value })}>
                {FREQUENCIES.map((f) => (<option key={f.value} value={f.value}>{f.label}</option>))}
              </select>
              <span className="form__hint">Saving changes to a popup shows it again to visitors who already saw it.</span>
            </div>
          )}

          <h3 className="adm-sub">Schedule <span className="adm-opt">(optional)</span></h3>
          <div className="form__row">
            <div className="field">
              <label htmlFor="ad-startAt">Start</label>
              <input id="ad-startAt" type="datetime-local" value={startStr} onChange={(e) => { setStartStr(e.target.value); clearErrors('endAt'); }} />
            </div>
            <div className={`field ${errors.endAt ? 'has-error' : ''}`}>
              <label htmlFor="ad-endAt">End</label>
              <input id="ad-endAt" type="datetime-local" value={endStr} onChange={(e) => { setEndStr(e.target.value); clearErrors('endAt'); }} />
              {errors.endAt && <span className="field__err">{errors.endAt}</span>}
            </div>
          </div>
          <span className="form__hint">Times use this device&rsquo;s time zone. Leave both empty to run until you switch it off.</span>
        </div>

        <aside className="adm-form__side">
          <Preview values={values} />
        </aside>
      </div>

      {saveError && <p className="field__err adm-form__err" role="alert">{saveError}</p>}
      <div className="adm-form__foot">
        <Button type="button" variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
        <Button type="submit" disabled={saving} icon={saving ? <Loader2 size={16} className="spin" aria-hidden="true" /> : null}>
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create advertisement'}
        </Button>
      </div>
    </form>
  );
}

// The Modal keeps the callbacks it is given stable (it re-focuses when they change),
// so close handling goes through a ref instead of being recreated on every keystroke.
export default function AdFormModal({ open, ad, onClose, onSaved }) {
  const cancelRef = useRef(() => {});
  const requestClose = useCallback(() => {
    cancelRef.current();
    onClose();
  }, [onClose]);

  return (
    <Modal open={open} onClose={requestClose} title={ad?.id ? 'Edit advertisement' : 'Add advertisement'} size="xl" labelId="ad-form-title">
      {ad && (
        <AdFormBody
          key={ad.id || 'new'}
          ad={ad}
          cancelRef={cancelRef}
          onClose={requestClose}
          onDone={(msg) => { onClose(); onSaved(msg); }}
        />
      )}
    </Modal>
  );
}
