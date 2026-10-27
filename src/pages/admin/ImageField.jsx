import { useRef, useState } from 'react';
import { ImagePlus, Trash2, Upload } from 'lucide-react';
import Button from '../../components/ui/Button';
import { hasStorage } from '../../lib/firebase';
import { uploadAdImage } from '../../services/adsService';
import { ACCEPTED_TYPES, prepareImage } from '../../utils/imageTools';
import { safeImageUrl } from '../../utils/adRules';

function uploadMessage(err) {
  switch (err?.code) {
    case 'storage/unauthorized':
      return 'Upload was refused. Check that the Storage rules are published and that you are signed in as an administrator.';
    case 'storage/bucket-not-found':
    case 'storage/project-not-found':
      return 'Cloud Storage is not enabled for this Firebase project. Paste an image address below instead.';
    case 'storage/retry-limit-exceeded':
    case 'storage/network-request-failed':
      return 'The upload timed out. Check your connection and try again.';
    default:
      return err?.message && !err.code ? err.message : 'Could not upload that image. Try again, or paste an image address below.';
  }
}

export default function ImageField({ type, imageUrl, error, onChange, onUploaded }) {
  const fileRef = useRef(null);
  const [progress, setProgress] = useState(null); // null = idle, 0..1 = uploading
  const [message, setMessage] = useState('');
  const [dragging, setDragging] = useState(false);
  const preview = safeImageUrl(imageUrl);
  const uploading = progress !== null;

  const handleFile = async (file) => {
    if (!file || uploading) return;
    setMessage('');
    setProgress(0);
    try {
      const prepared = await prepareImage(file);
      const { url, path } = await uploadAdImage(prepared, setProgress);
      onUploaded(path);
      onChange({ imageUrl: url, imagePath: path });
    } catch (err) {
      setMessage(uploadMessage(err));
    } finally {
      setProgress(null);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (hasStorage) handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="field">
      <label htmlFor="ad-imageUrl">Image <span className="adm-opt">(optional)</span></label>
      <div
        className={`adm-drop ${dragging ? 'is-drag' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {preview ? (
          <img src={preview} alt="Selected advertisement" className="adm-drop__img" />
        ) : (
          <div className="adm-drop__empty">
            <ImagePlus size={26} aria-hidden="true" />
            <span>{hasStorage ? 'Drag an image here, or use Upload' : 'Paste an image address below'}</span>
          </div>
        )}
        <div className="adm-drop__btns">
          {hasStorage && (
            <Button size="sm" variant="outline" type="button" disabled={uploading} onClick={() => fileRef.current?.click()} icon={<Upload size={15} aria-hidden="true" />}>
              {uploading ? 'Uploading…' : preview ? 'Replace image' : 'Upload image'}
            </Button>
          )}
          {imageUrl && (
            <Button size="sm" variant="outline" type="button" disabled={uploading} onClick={() => onChange({ imageUrl: '', imagePath: '' })} icon={<Trash2 size={15} aria-hidden="true" />}>
              Remove
            </Button>
          )}
        </div>
        {uploading && (
          <div className="adm-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
            <span style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
        )}
      </div>
      {hasStorage && (
        // `hidden` removes it from layout entirely (a visually-hidden input would inherit the form's width:100% rule and make the modal scroll sideways).
        <input ref={fileRef} type="file" accept={ACCEPTED_TYPES.join(',')} hidden onChange={(e) => handleFile(e.target.files?.[0])} aria-label="Choose an image file" />
      )}
      {message && <span className="field__err" role="alert">{message}</span>}

      <input
        id="ad-imageUrl"
        type="text"
        placeholder="…or paste an image address (https://… or /images/…)"
        value={imageUrl}
        onChange={(e) => onChange({ imageUrl: e.target.value, imagePath: '' })}
      />
      <div style={{ marginTop: '8px' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink-2)' }}>Quick AI Image Presets:</span>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
          {[
            { label: 'Plant Maintenance', url: '/images/ai/ad-maintenance.jpg' },
            { label: 'Boiler Overhaul', url: '/images/ai/boiler-overhaul.jpg' },
            { label: 'Solar EPC', url: '/images/ai/solar-epc.jpg' },
            { label: '400kV Lines', url: '/images/ai/transmission-line.jpg' },
            { label: 'C&I Automation', url: '/images/ai/ci-automation.jpg' },
          ].map((preset) => (
            <button
              key={preset.url}
              type="button"
              className="chip chip--btn"
              style={{ fontSize: '11.5px', padding: '3px 10px', height: 'auto', cursor: 'pointer' }}
              onClick={() => onChange({ imageUrl: preset.url, imagePath: '' })}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
      {error && <span className="field__err">{error}</span>}
      <span className="form__hint">
        {type === 'banner'
          ? 'Scrolling banners look best with a wide image, about 2:1 (for example 1200 × 560). JPG, PNG, WebP or GIF; large photos are shrunk automatically.'
          : 'Wide or square images work best, at least 800 px across. JPG, PNG, WebP or GIF; large photos are shrunk automatically.'}
      </span>
    </div>
  );
}
