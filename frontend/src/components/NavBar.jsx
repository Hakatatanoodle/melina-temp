import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { initials } from '../utils/format.js';
import { LogoutIcon } from './icons.jsx';

const LINKS = [
  { to: '/app', end: true, label: 'Dashboard' },
  { to: '/app/pets', end: false, label: 'My Pets' },
  { to: '/app/health', end: false, label: 'Health Records' },
  { to: '/app/profile', end: false, label: 'Profile' },
];

/** Lightweight top navigation (design.md §16) — logout visually secondary. */
export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();
    navigate('/');
  }

  return (
    <header className="app-nav">
      <div className="container app-nav__inner">
        <Link to="/app" className="wordmark">
          PetCare
        </Link>
        <nav className="app-nav__links" aria-label="Primary">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `app-nav__link${isActive ? ' is-active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="app-nav__user">
          <span className="avatar" title={user?.fullName}>
            {initials(user?.fullName)}
          </span>
          <button
            type="button"
            className="btn btn--ghost btn--sm app-nav__logout"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <LogoutIcon size={16} />
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
