import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { PageLoader } from './Spinner.jsx';

/**
 * Shared split layout for login/registration (design.md §14): a warm pet
 * photo + brand message on the left, the calm form on the right. Already
 * authenticated visitors go straight to the dashboard.
 */
export default function AuthLayout({ quote, quoteSub, image, children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <PageLoader label="Checking your session…" />;
  if (status === 'authed') {
    const params = new URLSearchParams(location.search);
    const next = params.get('next');
    return <Navigate to={next && next.startsWith('/') ? next : '/app'} replace />;
  }

  return (
    <div className="auth">
      <aside className="auth__panel">
        <img src={image} alt="" />
        <div className="auth__panel-top">
          <Link to="/" className="wordmark">
            PetCare
          </Link>
        </div>
        <div className="auth__panel-quote">
          <h2>{quote}</h2>
          <p>{quoteSub}</p>
        </div>
      </aside>
      <main className="auth__main page-enter">
        <Link to="/" className="btn btn--ghost btn--sm auth__back">
          ← Back to home
        </Link>
        <div className="auth__card">{children}</div>
      </main>
    </div>
  );
}
