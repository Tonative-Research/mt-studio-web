import { Clock, HardDrive, Activity, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProcessingStatus() {
  const progress = 36;

  return (
    <div className="bg-primary-500 text-white rounded-xl shadow-lg shadow-primary-500/20 p-6 lg:p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 text-white/5 pointer-events-none">
        <RefreshCw size={200} strokeWidth={1} />
      </div>

      <div className="relative z-10 flex items-start justify-between mb-4 gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 block">
            <span className="text-white/50">Current Task:</span>{' '}
            <span className="text-accent-400">Active Translation</span>
          </span>
          <h3 className="text-xl lg:text-2xl font-bold">Processing row 412 of 1,200...</h3>
        </div>
        <span className="text-3xl lg:text-4xl font-black text-accent-400 shrink-0">
          {progress}%
        </span>
      </div>

      <div className="relative z-10 h-3 w-full bg-white/10 rounded-full overflow-hidden mb-6">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="h-full bg-accent-500 rounded-full"
        />
      </div>

      <div className="relative z-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/10 pt-5">
        {[
          { icon: Clock, label: 'Est. Time', value: '45s' },
          { icon: Activity, label: 'API Load', value: '32%' },
          { icon: HardDrive, label: 'Nodes', value: '4 Active' },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-2.5">
            <Icon size={16} className="text-white/50" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-white/50 uppercase tracking-wider">{label}</span>
              <span className="text-sm font-bold tracking-tight">{value}</span>
            </div>
          </div>
        ))}

        <div className="ml-auto bg-white/10 px-4 py-2 rounded-lg">
          <span className="text-xs font-bold tracking-tight text-white/70 uppercase">
            ID: MT-2024-X45
          </span>
        </div>
      </div>
    </div>
  );
}
