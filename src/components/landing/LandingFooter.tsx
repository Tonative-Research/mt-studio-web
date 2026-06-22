import { Link } from 'react-router-dom';

export default function LandingFooter() {
  return (
    <footer className="bg-primary-950 border-t border-white/5 py-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <img
            src="/static/images/logos/Tonative-logo-white.png"
            alt="Tonative"
            className="h-6 w-auto opacity-60"
          />
          <span className="text-xs font-bold text-white/30 uppercase tracking-widest">MT Studio</span>
        </div>

        <p className="text-xs text-white/20 text-center">
          Built by the Tonative team · African Language AI · MVP
        </p>

        <Link
          to="/dashboard"
          className="text-xs font-semibold text-white/30 hover:text-white/60 transition-colors"
        >
          Launch App →
        </Link>
      </div>
    </footer>
  );
}
