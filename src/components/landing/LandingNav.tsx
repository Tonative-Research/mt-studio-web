import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled ? "bg-primary-900/95 backdrop-blur-md shadow-lg shadow-black/20" : "bg-transparent"}
      `}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 h-16 flex items-center gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src="/static/images/logos/Tonative-logo-white.png"
            alt="Tonative"
            className="h-7 w-auto"
          />
          <span className="text-sm font-black tracking-tight text-white/80 hover:text-white transition-colors">
            MT Studio
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-7 ml-4">
          <a
            href="#how-it-works"
            className="text-sm font-medium text-white/50 hover:text-white transition-colors"
          >
            How it works
          </a>
          <a
            href="#languages"
            className="text-sm font-medium text-white/50 hover:text-white transition-colors"
          >
            Languages
          </a>
        </div>

        {/* Right */}
        <div className="ml-auto flex items-center gap-3">
          <Link
            to="/dashboard"
            className="hidden sm:flex btn-accent text-xs text-white uppercase tracking-widest px-5 py-2.5"
          >
            Launch App
          </Link>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="sm:hidden p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden bg-primary-900 border-t border-white/10 px-6 py-4 space-y-1">
          <a
            href="#how-it-works"
            onClick={() => setMenuOpen(false)}
            className="block py-2.5 text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            How it works
          </a>
          <a
            href="#languages"
            onClick={() => setMenuOpen(false)}
            className="block py-2.5 text-sm font-medium text-white/60 hover:text-white transition-colors"
          >
            Languages
          </a>
          <div className="pt-2 border-t border-white/10">
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="w-full justify-center text-xs text-white uppercase tracking-widest py-3 mt-2"
            >
              Launch App
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
