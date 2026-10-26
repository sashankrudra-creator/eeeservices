// Prepares an image chosen in the admin page for upload: validates the type and
// shrinks big photos (phone cameras produce 4-8 MB files) so they load fast on
// the public site and stay under the upload limit.

export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const MAX_UPLOAD_BYTES = 3 * 1024 * 1024; // keep in sync with storage.rules
const MAX_INPUT_BYTES = 25 * 1024 * 1024;
const MAX_EDGE = 1600;
const KEEP_AS_IS_BYTES = 1.2 * 1024 * 1024;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('That file could not be read as an image.')); };
    img.src = url;
  });
}

const toBlob = (canvas, type, quality) => new Promise((resolve) => canvas.toBlob(resolve, type, quality));

export async function prepareImage(file) {
  if (!ACCEPTED_TYPES.includes(file.type)) throw new Error('Please choose a JPG, PNG, WebP or GIF image.');
  if (file.size > MAX_INPUT_BYTES) throw new Error('That image is too large. Please choose one under 25 MB.');

  // Animated GIFs would lose their animation when redrawn, so they are sent untouched.
  if (file.type === 'image/gif') {
    if (file.size > MAX_UPLOAD_BYTES) throw new Error('GIFs must be under 3 MB.');
    return file;
  }

  const img = await loadImage(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
  if (scale === 1 && file.size <= KEEP_AS_IS_BYTES) return file;

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);

  // JPEG stays JPEG; PNG/WebP become WebP (keeps transparency, much smaller).
  const blob = await toBlob(canvas, file.type === 'image/jpeg' ? 'image/jpeg' : 'image/webp', 0.86);
  if (!blob) return file.size <= MAX_UPLOAD_BYTES ? file : Promise.reject(new Error('Could not process that image.'));
  const out = blob.size < file.size || scale < 1 ? blob : file;
  if (out.size > MAX_UPLOAD_BYTES) throw new Error('That image is still over 3 MB after shrinking. Please use a smaller one.');
  if (out === file) return file;
  const ext = out.type === 'image/jpeg' ? 'jpg' : out.type === 'image/png' ? 'png' : 'webp';
  return new File([out], `ad.${ext}`, { type: out.type });
}
