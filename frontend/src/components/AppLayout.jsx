import { Outlet } from 'react-router-dom';
import NavBar from './NavBar.jsx';

/** Authenticated application shell. */
export default function AppLayout() {
  return (
    <>
      <NavBar />
      <main className="app-main page-enter">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </>
  );
}
