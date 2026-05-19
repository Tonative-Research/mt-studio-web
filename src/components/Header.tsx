import { Bell, HelpCircle, User, Settings } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 bg-primary border-b border-white/10 px-8 flex items-center sticky top-0 z-30">
      <div className="flex items-center w-72 shrink-0 -ml-4">
        <h1 className="text-xl font-bold tracking-tight text-white pl-4">MT Studio</h1>
      </div>

      <div className="flex-1 flex items-center justify-between">
        <nav className="flex items-center gap-8 h-16">
          <button className="text-sm font-semibold text-white border-b-2 border-secondary h-full flex items-center">Dashboard</button>
          <button className="text-sm font-medium text-white/60 hover:text-white transition-colors h-full flex items-center">Engine Config</button>
          <button className="text-sm font-medium text-white/60 hover:text-white transition-colors h-full flex items-center">History</button>
        </nav>

        <div className="flex items-center gap-4">
          <button className="bg-secondary text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded hover:bg-secondary/90 transition-colors">
            Initialize Engine
          </button>
          <div className="h-8 w-px bg-white/10 mx-2" />
          <button className="p-2 text-white/60 hover:bg-white/10 rounded-full transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-secondary rounded-full border-2 border-primary" />
          </button>
          <button className="p-2 text-white/60 hover:bg-white/10 rounded-full transition-colors">
            <HelpCircle size={20} />
          </button>
          <button className="p-2 text-white/60 hover:bg-white/10 rounded-full transition-colors">
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
