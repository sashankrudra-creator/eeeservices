import { useRef, useState } from 'react';
import { ImagePlus, Trash2, Upload, CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { uploadAdImage } from '../../services/adsService';
import { ACCEPTED_TYPES, prepareImage } from '../../utils/imageTools';
import { safeImageUrl } from '../../utils/adRules';

function uploadMessage(err) {
  switch (err?.code) {
    case 'storage/unauthorized':
      return 'Upload was refused. Check that you are signed in as an administrator.';
    case 'storage/bucket-not-found':
    case 'storage/project-not-found':
      return 'Cloud Storage is not enabled for this Firebase project. Image saved locally.';
    case 'storage/retry-limit-exceeded':
    case 'storage/network-request-failed':
      return 'The upload timed out. Check your connection or use an image link.';
    default:
      return err?.message && !err.code ? err.message : 'Could not process that image. Try again, or paste an image address below.';
  }
}

export default function ImageField({ type, imageUrl, error, onChange, onUploaded }) {
  const fileRef = useRef(null);
  const [progress, setProgress] = useState(null); // null = idle, 0..1 = uploading
  const [message, setMessage] = useState('');
  const [sourceNote, setSourceNote] = useState('');
  const [dragging, setDragging] = useState(false);
  const preview = safeImageUrl(imageUrl);
  const uploading = progress !== null;

  const handleFile = async (file) => {
    if (!file || uploading) return;
    setMessage('');
    setSourceNote('');
    setProgress(0);
    try {
      const prepared = await prepareImage(file);
      const { url, path } = await uploadAdImage(prepared, setProgress);
      onUploaded?.(path);
      onChange({ imageUrl: url, imagePath: path });
      setSourceNote(`Loaded "${file.name}" from local storage`);
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
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const quickPresets = [
    { label: 'Drone Thermography', url: '/images/drone-thermography.jpg' },
    { label: 'Thermal Scan', url: '/images/thermal-scan-transmission.jpg' },
    { label: 'Plant Maintenance', url: '/images/ai/ad-maintenance.jpg' },
    { label: 'Boiler Overhaul', url: '/images/ai/boiler-overhaul.jpg' },
    { label: 'Solar EPC', url: '/images/ai/solar-epc.jpg' },
    { label: '400kV Lines', url: '/images/ai/transmission-line.jpg' },
    { label: 'C&I Automation', url: '/images/ai/ci-automation.jpg' },
    { label: 'Switchyards', url: '/images/switchyard-towers.jpg' },
    { label: 'Bed Coil Boiler', url: '/images/bed-coil-boiler.jpg' },
  ];

  return (
    <div className="field">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <label htmlFor="ad-imageUrl" style={{ margin: 0 }}>Image <span className="adm-opt">(optional)</span></label>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--olive, #3d502d)',
            fontWeight: 600,
            fontSize: '12px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 6px',
          }}
        >
          <Upload size={13} aria-hidden="true" /> Browse local files
        </button>
      </div>

      <div
        className={`adm-drop ${dragging ? 'is-drag' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={(e) => {
          if (!imageUrl && !uploading && !e.target.closest('button')) {
            fileRef.current?.click();
          }
        }}
        style={{ cursor: !imageUrl ? 'pointer' : 'default' }}
      >
        {preview ? (
          <img src={preview} alt="Selected advertisement" className="adm-drop__img" />
        ) : (
          <div className="adm-drop__empty">
            <ImagePlus size={28} aria-hidden="true" />
            <span style={{ fontWeight: 600, fontSize: '13.5px' }}>
              Drag an image here, or click to choose from local storage
            </span>
            <small style={{ color: 'var(--ink-muted, #777)', fontSize: '12px' }}>
              Supports JPG, PNG, WebP, GIF from your computer
            </small>
          </div>
        )}

        <div className="adm-drop__btns">
          <Button
            size="sm"
            variant="outline"
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            icon={<Upload size={15} aria-hidden="true" />}
          >
            {uploading ? 'Processing…' : preview ? 'Change image from device' : 'Upload from Local Storage'}
          </Button>

          {imageUrl && (
            <Button
              size="sm"
              variant="outline"
              type="button"
              disabled={uploading}
              onClick={() => {
                onChange({ imageUrl: '', imagePath: '' });
                setSourceNote('');
              }}
              icon={<Trash2 size={15} aria-hidden="true" />}
            >
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

      {/* Always render hidden input so local storage file selection is ALWAYS accessible */}
      <input
        ref={fileRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
        aria-label="Choose an image file from local storage"
      />

      {sourceNote && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--olive, #3d502d)', fontWeight: 600, marginTop: '4px' }}>
          <CheckCircle2 size={14} /> {sourceNote}
        </span>
      )}

      {message && <span className="field__err" role="alert">{message}</span>}

      <div style={{ marginTop: '8px' }}>
        <input
          id="ad-imageUrl"
          type="text"
          placeholder="…or paste an image address (https://… or /images/…)"
          value={imageUrl}
          onChange={(e) => {
            onChange({ imageUrl: e.target.value, imagePath: '' });
            setSourceNote('');
          }}
        />
      </div>

      <div style={{ marginTop: '10px' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink-2)' }}>
          Quick Site & AI Presets:
        </span>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
          {quickPresets.map((preset) => (
            <button
              key={preset.url}
              type="button"
              className="chip chip--btn"
              style={{
                fontSize: '11.5px',
                padding: '4px 10px',
                height: 'auto',
                cursor: 'pointer',
                background: imageUrl === preset.url ? 'var(--olive, #3d502d)' : undefined,
                color: imageUrl === preset.url ? '#fff' : undefined,
              }}
              onClick={() => {
                onChange({ imageUrl: preset.url, imagePath: '' });
                setSourceNote(`Selected preset "${preset.label}"`);
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {error && <span className="field__err">{error}</span>}
      <span className="form__hint" style={{ marginTop: '8px', display: 'block' }}>
        {type === 'banner'
          ? 'Scrolling banners look best with a wide image, about 2:1 (for example 1200 × 560). JPG, PNG, WebP or GIF; large photos from local storage are compressed automatically.'
          : 'Wide or square images work best, at least 800 px across. JPG, PNG, WebP or GIF; large photos from local storage are compressed automatically.'}
      </span>
    </div>
  );
}
