import { useState } from 'react';
import Modal from './Modal.jsx';
import { Spinner } from './Spinner.jsx';
import { WarningIcon } from './icons.jsx';

/** Confirmation dialog for destructive actions (design.md §24). */
export default function ConfirmDialog({ title, message, confirmLabel = 'Delete', onCancel, onConfirm }) {
  const [busy, setBusy] = useState(false);

  async function handleConfirm() {
    setBusy(true);
    try {
      await onConfirm();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title={title} onClose={onCancel}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ color: 'var(--error)', marginTop: 2 }}>
          <WarningIcon size={20} />
        </span>
        <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{message}</p>
      </div>
      <div className="modal__foot">
        <button type="button" className="btn btn--secondary" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button type="button" className="btn btn--danger" onClick={handleConfirm} disabled={busy}>
          {busy && <Spinner />}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
