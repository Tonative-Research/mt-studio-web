import { LayoutDashboard, Settings2, History, Terminal, Rocket } from 'lucide-react';
import { motion } from 'motion/react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'config', label: 'Engine Config', icon: Settings2 },
  { id: 'history', label: 'Translation History', icon: History },
  { id: 'logs', label: 'System Logs', icon: Terminal },
];

export default function Sidebar() {
  return (
    <div className="w-72 bg-primary text-white sticky top-16 h-[calc(100vh-4rem)] flex flex-col shrink-0 z-20">
      <div className="p-8 border-b border-white/10">
        <h2 className="text-xl font-bold tracking-tight">Project MT</h2>
        <p className="text-xs text-white/50 font-sans mt-0.5">Infrastructure Engine</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
              item.id === 'dashboard' ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon size={20} className={item.id === 'dashboard' ? 'text-white' : 'text-white/40 group-hover:text-white'} />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6">
        <button className="w-full bg-secondary hover:bg-secondary/90 text-white px-6 py-4 rounded-lg flex items-center justify-center gap-3 transition-transform active:scale-95 group shadow-lg">
          <Rocket size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          <span className="font-bold uppercase tracking-wider text-xs">Launch Session</span>
        </button>
      </div>
    </div>
  );
}
