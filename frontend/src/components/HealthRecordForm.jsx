import { useState } from 'react';
import Modal from './Modal.jsx';
import Field from './Field.jsx';
import { RECORD_TYPES } from '../services/health.service.js';
import { todayIso } from '../utils/format.js';

/**
 * Add/edit health record dialog. Used from the pet detail page (petId known)
 * and — in stage B — from the aggregate records page (choose the pet).
 */
export default function HealthRecordForm({ record, pet, petOptions, onSubmit, onClose }) {
  const [values, setValues] = useState({
    type: record?.type || 'vaccination',
    title: record?.title || '',
    date: record?.date || todayIso(),
    clinic: record?.clinic || '',
    description: record?.description || '',
    petId: record?.petId || pet?.id || (petOptions?.length === 1 ? petOptions[0].id : ''),
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  function set(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');

    const clientErrors = {};
    if (!values.petId) clientErrors.petId = 'Please choose a pet.';
    if (!values.title.trim()) clientErrors.title = 'Please give the record a title.';
    if (!values.date) clientErrors.date = 'Please choose a date.';
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setBusy(true);
    try {
      await onSubmit({
        petId: values.petId,
        type: values.type,
        title: values.title,
        date: values.date,
        clinic: values.clinic,
        description: values.description,
      });
    } catch (error) {
      if (error.errors) setErrors(error.errors);
      else setFormError(error.message || 'Something went wrong. Please try again.');
      setBusy(false);
    }
  }

  return (
    <Modal
      title={record ? 'Edit health record' : 'Add health record'}
      subtitle={record ? undefined : pet ? `For ${pet.name}` : undefined}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} noValidate>
        {formError && <div className="alert">{formError}</div>}

        {!record && !pet && (
          <Field label="Pet" htmlFor="record-pet" error={errors.petId}>
            <select id="record-pet" className="select" value={values.petId} onChange={(e) => set('petId', e.target.value)}>
              <option value="">Choose a pet…</option>
              {(petOptions || []).map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </Field>
        )}

        <div className="form-grid">
          <Field label="Record type" htmlFor="record-type" error={errors.type}>
            <select id="record-type" className="select" value={values.type} onChange={(e) => set('type', e.target.value)}>
              {RECORD_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Date" htmlFor="record-date" error={errors.date}>
            <input id="record-date" className="input" type="date" value={values.date} onChange={(e) => set('date', e.target.value)} />
          </Field>

          <Field label="Title" htmlFor="record-title" error={errors.title}>
            <input
              id="record-title"
              className="input"
              value={values.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder={values.type === 'vaccination' ? 'e.g. Rabies Vaccination' : 'e.g. Annual checkup'}
              autoComplete="off"
            />
          </Field>

          <Field label="Veterinarian / clinic" htmlFor="record-clinic" error={errors.clinic} optional>
            <input
              id="record-clinic"
              className="input"
              value={values.clinic}
              onChange={(e) => set('clinic', e.target.value)}
              placeholder="e.g. Green Valley Clinic"
              autoComplete="off"
            />
          </Field>

          <Field label="Description" htmlFor="record-description" error={errors.description} optional className="field--full">
            <textarea
              id="record-description"
              className="textarea"
              value={values.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="What happened, dosage, next steps…"
            />
          </Field>
        </div>

        <div className="modal__foot">
          <button type="button" className="btn btn--secondary" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={busy}>
            {busy && <span className="spinner" />}
            {busy ? 'Saving…' : record ? 'Save changes' : 'Add record'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
