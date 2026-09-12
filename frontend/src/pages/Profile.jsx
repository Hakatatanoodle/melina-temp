import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { formatDate } from '../utils/format.js';
import { initials } from '../utils/format.js';
import { LogoutIcon, UserIcon } from '../components/icons.jsx';

/** Profile — a calm account summary (design.md lists Profile as a destination). */
export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div className="page-enter">
      <div className="page-head">
        <div>
          <h1 className="page-head__title">Profile</h1>
          <p className="page-head__sub">Your PetCare account.</p>
        </div>
      </div>

      <div className="health-card" style={{ maxWidth: 520 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="avatar" style={{ width: 56, height: 56, fontSize: 18 }}>
            {initials(user?.fullName)}
          </span>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>{user?.fullName}</h2>
            <p style={{ fontSize: 14, color: 'var(--ink-soft)' }}>{user?.email}</p>
          </div>
        </div>

        <div className="pet-hero__stats" style={{ marginTop: 22 }}>
          <div className="pet-hero__stat">
            <b>{user?.createdAt ? formatDate(user.createdAt.slice(0, 10)) : '—'}</b>
            <span>Member since</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button type="button" className="btn btn--danger btn--sm" onClick={handleLogout}>
            <LogoutIcon size={15} />
            Log out
          </button>
        </div>
      </div>

      <p style={{ marginTop: 18, fontSize: 13.5, color: 'var(--ink-faint)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <UserIcon size={15} />
        Your pets and health records stay private to your account — the backend verifies ownership on every request.
      </p>
    </div>
  );
}
