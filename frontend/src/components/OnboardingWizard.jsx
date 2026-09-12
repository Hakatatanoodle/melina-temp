import { useEffect, useRef, useState } from 'react';
import { petsService } from '../services/pets.service.js';
import { useToast } from './Toast.jsx';
import { Spinner } from './Spinner.jsx';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BirthdayIcon,
  BirdIcon,
  BreedIcon,
  CatIcon,
  CheckIcon,
  DogIcon,
  GenderIcon,
  OtherIcon,
  PetFaceIcon,
  RabbitIcon,
  SmallPetIcon,
} from './icons.jsx';

const SPECIES = [
  { value: 'Dog', label: 'Dog', plural: 'Dogs', image: '/images/pets/sample/dog-1.jpg', Icon: DogIcon },
  { value: 'Cat', label: 'Cat', plural: 'Cats', image: '/images/pets/sample/cat-1.jpg', Icon: CatIcon },
  { value: 'Rabbit', label: 'Rabbit', plural: 'Rabbits', image: '/images/pets/sample/rabbit-1.jpg', Icon: RabbitIcon },
  { value: 'Bird', label: 'Bird', plural: 'Birds', image: '/images/pets/sample/bird-1.jpg', Icon: BirdIcon },
  { value: 'Small pet', label: 'Small pet', plural: 'Small pets', image: '/images/pets/sample/hamster-1.jpg', Icon: SmallPetIcon },
  { value: 'Other', label: 'Other', plural: 'companions', image: '/images/pets/sample/other-1.jpg', Icon: OtherIcon },
];


function FieldIcon({ children }) {
  return <span className="wiz-field__icon" aria-hidden="true">{children}</span>;
}

function WizardField({ label, htmlFor, error, hint, icon, children }) {
  return (
    <div className={`wiz-field${error ? ' wiz-field--error' : ''}`}>
      <label className="wiz-field__label" htmlFor={htmlFor}>
        {label}
      </label>
      <div className="wiz-field__control">
        <FieldIcon>{icon}</FieldIcon>
        {children}
      </div>
      {error ? (
        <p className="wiz-field__error" role="alert">{error}</p>
      ) : hint ? (
        <p className="wiz-field__hint">{hint}</p>
      ) : null}
    </div>
  );
}

export default function OnboardingWizard({ mode = 'addPet', onComplete, onCancel }) {
  const toast = useToast();
  const headingRef = useRef(null);
  const [step, setStep] = useState(1);
  const [species, setSpecies] = useState('');
  const [values, setValues] = useState({ name: '', gender: '', breed: '', dateOfBirth: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const selected = SPECIES.find((s) => s.value === species);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    headingRef.current?.focus?.();
  }, [step]);

  function set(field, value) {
    setValues((cur) => ({ ...cur, [field]: value }));
    setErrors((cur) => {
      if (!cur[field]) return cur;
      const next = { ...cur };
      delete next[field];
      return next;
    });
  }

  function chooseSpecies(value) {
    setSpecies(value);
    setErrors({});
    setStep(2);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');
    const clientErrors = {};
    if (!values.name.trim()) clientErrors.name = 'Please give your pet a name.';
    if (values.dateOfBirth && values.dateOfBirth > today) clientErrors.dateOfBirth = 'Birthday cannot be in the future.';
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }
    setBusy(true);
    try {
      const data = await petsService.create({
        name: values.name.trim(),
        species,
        breed: values.breed.trim(),
        dateOfBirth: values.dateOfBirth || null,
        gender: values.gender || null,
        weightKg: null,
        imageUrl: '',
        notes: '',
      });
      toast.success(mode === 'onboarding' ? `Welcome to the family, ${data.pet.name}!` : `${data.pet.name} joined your family.`);
      if (onComplete) onComplete(data.pet);
    } catch (err) {
      if (err.errors) setErrors(err.errors);
      else setFormError(err.message || 'Something went wrong. Please try again.');
      setBusy(false);
    }
  }
  return (
    <div className="wizard-card page-enter" data-step={step}>
      <ol className="wizard__steps" aria-label="Add pet progress">
        <li className={`wizard__dot${step === 1 ? ' is-current' : ' is-done'}`} aria-current={step === 1 ? 'step' : undefined}>
          <span className="wizard__dot-num">{step > 1 ? <CheckIcon size={13} /> : '1'}</span> Species
        </li>
        <li className={`wizard__dot${step === 2 ? ' is-current' : ''}`} aria-current={step === 2 ? 'step' : undefined}>
          <span className="wizard__dot-num">2</span> Details
        </li>
      </ol>
      {step === 1 ? (
        <>
          <h2 className="wizard__title" ref={headingRef} tabIndex={-1}>Get Started by Adding Each Pet in Your Pack</h2>
          <p className="wizard__sub">Choose the kind of companion you are adding. You can add more any time.</p>
          <div className="species-grid" role="list">
            {SPECIES.map(({ value, label, image, Icon }) => (
              <button key={value} type="button" role="listitem" className="species-card" onClick={() => chooseSpecies(value)} aria-label={`Add a ${label.toLowerCase()}`}>
                <span className="species-card__media">
                  <img src={image} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  <span className="species-card__badge"><Icon size={16} /></span>
                </span>
                <span className="species-card__row">
                  <span className="species-card__label">{label === 'Other' ? 'Something else' : `Add a ${label}`}</span>
                  <span className="species-card__plus" aria-hidden="true">+</span>
                </span>
              </button>
            ))}
          </div>
          {mode === 'addPet' && (
            <div className="wiz-actions wiz-actions--single">
              <button type="button" className="btn btn--ghost" onClick={onCancel}>Not right now</button>
            </div>
          )}
        </>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <h2 className="wizard__title" ref={headingRef} tabIndex={-1}>Tell Us About Your {selected ? selected.label : 'Pet'}</h2>
          <p className="wizard__sub">Just the essentials to start {selected && selected.value !== 'Other' ? `your ${selected.label.toLowerCase()}'s` : 'their'} profile. You can add weight, photos and notes later.</p>
          {formError && <div className="alert">{formError}</div>}
          <div className="wiz-fields">
            <WizardField label="Name" htmlFor="wiz-name" error={errors.name} icon={<PetFaceIcon size={19} />}>
              <input id="wiz-name" className="wiz-input" value={values.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Bruno" autoComplete="off" autoFocus />
            </WizardField>
            <WizardField label="Gender" htmlFor="wiz-gender" error={errors.gender} icon={<GenderIcon size={19} />}>
              <select id="wiz-gender" className="wiz-input wiz-input--select" value={values.gender} onChange={(e) => set('gender', e.target.value)}>
                <option value="">Not specified yet</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </WizardField>
            <WizardField label="Breed" htmlFor="wiz-breed" error={errors.breed} hint="Optional — your best guess is fine." icon={<BreedIcon size={19} />}>
              <input id="wiz-breed" className="wiz-input" value={values.breed} onChange={(e) => set('breed', e.target.value)} placeholder="e.g. Golden Retriever" autoComplete="off" />
            </WizardField>
            <WizardField label="Birthday (Or Best Guess)" htmlFor="wiz-birthday" error={errors.dateOfBirth} hint="An estimate keeps reminders and age just right." icon={<BirthdayIcon size={19} />}>
              <input id="wiz-birthday" className="wiz-input" type="date" value={values.dateOfBirth} max={today} onChange={(e) => set('dateOfBirth', e.target.value)} />
            </WizardField>
          </div>
          <div className="wiz-actions">
            <button type="button" className="wiz-back" onClick={() => setStep(1)} aria-label="Back to species selection" disabled={busy}>
              <ArrowLeftIcon size={17} />
            </button>
            <button type="submit" className="btn btn--primary wiz-continue" disabled={busy}>
              {busy ? (<><Spinner /> Saving…</>) : (<>Continue <ArrowRightIcon size={16} /></>)}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
