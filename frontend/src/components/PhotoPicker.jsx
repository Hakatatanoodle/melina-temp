import { useRef, useState } from 'react';
import { api } from '../api/client.js';
import { Spinner } from './Spinner.jsx';

const MAX_BYTES = 5 * 1024 * 1024;
const isUploaded = (value) => /^\/api\/uploads\//.test(value || '');

/**
 * Pet photo control with two sources (design-friendly, no external deps):
 *  1. Upload from device — verified and stored by the backend, previewed live.
 *  2. Paste a URL — for photos already hosted somewhere.
 * Removing the value falls back to the warm branded placeholder.
 */
export default function PhotoPicker({ value, error, onChange }) {
  const inputRef = useRef(null);
  const [showUrl, setShowUrl] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState('');

  async function handleFile(file) {
    setLocalError('');

    if (!file) return;
    if (!file.type || !file.type.startsWith('image/')) {
      setLocalError('Please choose an image file (JPG, PNG, WebP or GIF).');
      return;
    }
    if (file.size > MAX_BYTES) {
      setLocalError('Photo must be 5 MB or smaller.');
      return;
    }

    const form = new FormData();
    form.append('photo', file);

    setUploading(true);
    try {
      const data = await api.upload(form);
      onChange(data.path);
      setShowUrl(false);
    } catch (err) {
      setLocalError(err.message || 'Could not upload that photo.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className="photo-picker">
      <span className="field__label">
        Photo <small>(optional)</small>
      </span>

      <div className="photo-picker__row">
        <span className="photo-picker__preview">
          {value ? (
            <img src={value} alt="Current photo preview" />
          ) : (
            <span className="photo-picker__empty">A warm placeholder portrait will be used.</span>
          )}
        </span>

        <div className="photo-picker__controls">
          <input
            ref={inputRef}
            type="file"
            id="pet-photo-file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="visually-hidden"
            disabled={uploading}
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
          <label htmlFor="pet-photo-file" className={`btn btn--secondary btn--sm${uploading ? ' is-busy' : ''}`}>
            {uploading ? <Spinner dark /> : 'Upload photo'}
          </label>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => setShowUrl((value) => !value)}
            aria-expanded={showUrl}
          >
            {isUploaded(value) && !showUrl ? 'Replace photo' : 'Paste URL'}
          </button>
          {value && (
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => {
                onChange('');
                setShowUrl(false);
                setLocalError('');
              }}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {showUrl && (
        <input
          className="input photo-picker__url"
          type="text"
          placeholder="https://…"
          autoComplete="off"
          value={isUploaded(value) ? '' : value}
          onChange={(event) => onChange(event.target.value)}
          aria-label="Photo URL"
        />
      )}

      {(localError || error) && <p className="field__error">{localError || error}</p>}
      <p className="field__hint">Upload a photo from your device, or paste an image URL.</p>
    </div>
  );
}