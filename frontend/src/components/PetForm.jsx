import { useState } from 'react';
import Field from './Field.jsx';

/**
 * Shared create/edit pet form. The page decides product copy ("Add Pet" vs
 * "Edit Bruno"); this component handles fields, client-side validation and
 * server-side field errors.
 */

export const SPECIES_OPTIONS = ['Dog', 'Cat', 'Rabbit', 'Bird', 'Fish', 'Small pet', 'Other'];

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Please give your pet a name.';
  if (!values.species) errors.species = 'Please choose a species.';
  if (values.weightKg && !(Number(values.weightKg) > 0)) errors.weightKg = 'Weight must be a positive number.';
  return errors;
}

export function petToFormValues(pet) {
  return {
    name: pet?.name || '',
    species: pet?.species || '',
    breed: pet?.breed || '',
    dateOfBirth: pet?.dateOfBirth || '',
    gender: pet?.gender || '',
    weightKg: pet?.weightKg ?? '',
    imageUrl: pet?.imageUrl || '',
    notes: pet?.notes || '',
  };
}

export default function PetForm({ initialValues, submitLabel, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  function set(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');

    const clientErrors = validate(values);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setBusy(true);
    try {
      await onSubmit({
        name: values.name,
        species: values.species,
        breed: values.breed,
        dateOfBirth: values.dateOfBirth || null,
        gender: values.gender || null,
        weightKg: values.weightKg === '' ? null : Number(values.weightKg),
        imageUrl: values.imageUrl,
        notes: values.notes,
      });
    } catch (error) {
      if (error.errors) setErrors(error.errors);
      else setFormError(error.message || 'Something went wrong. Please try again.');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {formError && <div className="alert">{formError}</div>}

      <div className="form-grid">
        <Field label="Name" htmlFor="pet-name" error={errors.name}>
          <input
            id="pet-name"
            className="input"
            value={values.name}
            onChange={(event) => set('name', event.target.value)}
            placeholder="e.g. Bruno"
            autoComplete="off"
          />
        </Field>

        <Field label="Species" htmlFor="pet-species" error={errors.species}>
          <select id="pet-species" className="select" value={values.species} onChange={(e) => set('species', e.target.value)}>
            <option value="">Choose species…</option>
            {SPECIES_OPTIONS.map((species) => (
              <option key={species} value={species}>
                {species}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Breed" htmlFor="pet-breed" error={errors.breed} optional>
          <input
            id="pet-breed"
            className="input"
            value={values.breed}
            onChange={(event) => set('breed', event.target.value)}
            placeholder="e.g. Golden Retriever"
            autoComplete="off"
          />
        </Field>

        <Field label="Date of birth" htmlFor="pet-dob" error={errors.dateOfBirth} optional>
          <input
            id="pet-dob"
            className="input"
            type="date"
            value={values.dateOfBirth}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(event) => set('dateOfBirth', event.target.value)}
          />
        </Field>

        <Field label="Gender" htmlFor="pet-gender" error={errors.gender} optional>
          <select id="pet-gender" className="select" value={values.gender} onChange={(e) => set('gender', e.target.value)}>
            <option value="">Not specified</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </Field>

        <Field label="Weight (kg)" htmlFor="pet-weight" error={errors.weightKg} optional>
          <input
            id="pet-weight"
            className="input"
            type="number"
            step="0.1"
            min="0"
            value={values.weightKg}
            onChange={(event) => set('weightKg', event.target.value)}
            placeholder="e.g. 28"
          />
        </Field>

        <Field
          label="Photo URL"
          htmlFor="pet-image"
          error={errors.imageUrl}
          optional
          hint="Leave empty and PetCare will use a warm placeholder portrait."
          className="field--full"
        >
          <input
            id="pet-image"
            className="input"
            value={values.imageUrl}
            onChange={(event) => set('imageUrl', event.target.value)}
            placeholder="https://…"
            autoComplete="off"
          />
        </Field>

        <Field label="Notes" htmlFor="pet-notes" error={errors.notes} optional className="field--full">
          <textarea
            id="pet-notes"
            className="textarea"
            value={values.notes}
            onChange={(event) => set('notes', event.target.value)}
            placeholder="Feeding habits, personality, anything worth remembering…"
          />
        </Field>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn--primary" disabled={busy}>
          {busy && <span className="spinner" />}
          {busy ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
