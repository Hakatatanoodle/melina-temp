import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import Field from '../components/Field.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { firstName } from '../utils/format.js';

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');

    const clientErrors = {};
    if (!values.email.trim()) clientErrors.email = 'Please enter your email.';
    if (!values.password) clientErrors.password = 'Please enter your password.';
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setBusy(true);
    try {
      const user = await login(values.email, values.password);
      toast.success(`Welcome back, ${firstName(user.fullName)}.`);
      const next = searchParams.get('next');
      navigate(next && next.startsWith('/') ? next : '/app', { replace: true });
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
      quoteSub="PetCare keeps your pet's important information close, so care feels effortless."
    >
      <h1>Welcome back</h1>
      <p>Log in to see how your pets are doing.</p>

      <form onSubmit={handleSubmit} noValidate>
        {formError && <div className="alert">{formError}</div>}

        <Field label="Email" htmlFor="login-email" error={errors.email}>
          <input
            id="login-email"
            className="input"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => setValues({ ...values, email: event.target.value })}
            placeholder="you@example.com"
          />
        </Field>

        <Field label="Password" htmlFor="login-password" error={errors.password}>
          <input
            id="login-password"
            className="input"
            type="password"
            autoComplete="current-password"
            value={values.password}
            onChange={(event) => setValues({ ...values, password: event.target.value })}
            placeholder="Your password"
          />
        </Field>

        <button type="submit" className="btn btn--primary btn--block" disabled={busy}>
          {busy && <span className="spinner" />}
          {busy ? 'Logging in…' : 'Log In'}
        </button>
      </form>

      <p className="auth__switch">
        New to PetCare?{' '}
        <Link to={searchParams.get('next') ? `/register?next=${searchParams.get('next')}` : '/register'}>
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
