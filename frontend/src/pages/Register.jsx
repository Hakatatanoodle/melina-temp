import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import Field from '../components/Field.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { firstName } from '../utils/format.js';

const PASSWORD_MIN = 8;

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [values, setValues] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
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
    if (!values.fullName.trim()) clientErrors.fullName = 'Please enter your name.';
    if (!values.email.trim()) clientErrors.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) clientErrors.email = 'Please enter a valid email address.';
    if (!values.password) clientErrors.password = 'Please choose a password.';
    else if (values.password.length < PASSWORD_MIN) clientErrors.password = `Password must be at least ${PASSWORD_MIN} characters.`;
    if (values.confirmPassword !== values.password) clientErrors.confirmPassword = 'Passwords do not match.';

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setBusy(true);
    try {
      const user = await register(values);
      toast.success(`Welcome to PetCare, ${firstName(user.fullName)}!`);
      const next = searchParams.get('next');
      navigate(next && next.startsWith('/') && next !== '/app' ? next : '/app/onboarding', { replace: true });
    } catch (error) {
      if (error.errors) setErrors(error.errors);
      else setFormError(error.message);
      setBusy(false);
    }
  }

  return (
    <AuthLayout
      image="/images/pets/sample/auth-beagle.jpg"
      quote="Every walk, vaccine and checkup — remembered."
      quoteSub="Join PetCare and give your pets a calm, organized home for their care information."
    >
      <h1>Create your account</h1>
      <p>Free, private, and made for pet owners.</p>

      <form onSubmit={handleSubmit} noValidate>
        {formError && <div className="alert">{formError}</div>}

        <Field label="Full name" htmlFor="reg-name" error={errors.fullName}>
          <input
            id="reg-fullname"
            className="input"
            autoComplete="name"
            value={values.fullName}
            onChange={(event) => set('fullName', event.target.value)}
            placeholder="e.g. Alex Rivera"
          />
        </Field>

        <Field label="Email" htmlFor="reg-email" error={errors.email}>
          <input
            id="reg-email"
            className="input"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => set('email', event.target.value)}
            placeholder="you@example.com"
          />
        </Field>

        <Field
          label="Password"
          htmlFor="reg-password"
          error={errors.password}
          hint="At least 8 characters."
        >
          <input
            id="reg-password"
            className="input"
            type="password"
            autoComplete="new-password"
            value={values.password}
            onChange={(event) => set('password', event.target.value)}
            placeholder="Choose a password"
          />
        </Field>

        <Field label="Confirm password" htmlFor="reg-confirm" error={errors.confirmPassword}>
          <input
            id="reg-confirm"
            className="input"
            type="password"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={(event) => set('confirmPassword', event.target.value)}
            placeholder="Repeat your password"
          />
        </Field>

        <button type="submit" className="btn btn--primary btn--block" disabled={busy}>
          {busy && <span className="spinner" />}
          {busy ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="auth__switch">
        Already have an account?{' '}
        <Link to={searchParams.get('next') ? `/login?next=${searchParams.get('next')}` : '/login'}>Log in</Link>
      </p>
    </AuthLayout>
  );
}
