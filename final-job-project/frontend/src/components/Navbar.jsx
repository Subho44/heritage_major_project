import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ dark, setDark }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-bold text-slate-900 dark:text-white">
          AI Smart Job Portal
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link to="/jobs" className="text-slate-700 dark:text-slate-200">Jobs</Link>
          {user && <Link to="/dashboard" className="text-slate-700 dark:text-slate-200">Dashboard</Link>}
          <button
            onClick={() => setDark(!dark)}
            className="rounded-full border p-2 dark:border-slate-700"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {!user ? (
            <Link to="/login" className="rounded-lg bg-slate-900 px-4 py-2 text-white dark:bg-indigo-600">
              Login
            </Link>
          ) : (
            <button onClick={handleLogout} className="rounded-lg bg-rose-600 px-4 py-2 text-white">
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
