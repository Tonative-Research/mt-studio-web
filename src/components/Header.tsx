import { Bell, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { resetTranslateState } from '@/redux/translateSlice';
import { useAppDispatch } from '@/redux/hooks';
import { resetUploadState } from '@/redux/uploadSlice';
import { resetModelConfig } from '@/redux/modelConfigSlice';
import { persistor } from '@/redux/store';

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'History', to: '/dashboard/history' },
  // { label: 'Settings', to: '/dashboard/settings' },
];

export default function AppHeader() {
 const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  async function handleNewSession() {
    dispatch(resetTranslateState());
    dispatch(resetUploadState());
    dispatch(resetModelConfig());
    await persistor.flush(); // ensure the reset is written before navigating
    navigate('/dashboard');
  }

  return (
    <header className="h-16 bg-primary-800 border-b border-white/10 px-4 sm:px-8 flex items-center sticky top-0 z-30 gap-6">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
        <img
          src="/static/images/logos/Tonative-logo-white.png"
          alt="Tonative"
          className="h-7 w-auto"
        />
        <span className="text-sm font-black tracking-tight text-white/80 group-hover:text-white transition-colors">
          MT Studio
        </span>
        <span className="hidden sm:inline-flex px-2 py-0.5 bg-white/10 rounded text-[9px] font-black uppercase tracking-widest text-white/50">
          Beta
        </span>
      </Link>

      {/* Nav tabs */}
      <nav
        className="hidden sm:flex items-center h-16 gap-1"
        aria-label="Main navigation"
      >
        {navItems.map(({ label, to }) => {
          const active =
            pathname === to || (to !== "/dashboard" && pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={`
                px-4 h-full inline-flex items-center text-sm font-medium border-b-2 transition-colors
                ${
                  active
                    ? "text-white border-accent-500"
                    : "text-white/60 border-transparent hover:text-white hover:border-white/30"
                }
              `}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="accent"
          size="sm"
          className="hidden sm:flex font-black uppercase tracking-widest"
          onClick={handleNewSession}
        >
          New Session
        </Button>

        <div className="hidden sm:block h-6 w-px bg-white/10 mx-1" />

        <button
          className="p-2 text-white/60 hover:bg-white/10 rounded-full transition-colors relative"
          aria-label="Notifications"
        >
          <Bell size={19} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full border-2 border-primary-800" />
        </button>

        <button
          className="p-2 text-white/60 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Account"
        >
          <User size={19} />
        </button>
      </div>
    </header>
  );
}
