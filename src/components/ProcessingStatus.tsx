import { Clock, HardDrive, Hash, Activity, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProcessingStatus() {
  const progress = 36;

  return (
    <div className="bg-primary text-white rounded-xl shadow-sm p-8 relative overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 text-white/5 pointer-events-none scale-[3]">
        <RefreshCw size={120} strokeWidth={1} />
      </div>

      <div className="relative z-10 flex items-end justify-between mb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 block">
            <span className="text-white/60">Current Task:</span> <span className="text-secondary">Active Translation</span>
          </span>
          <h3 className="text-2xl font-bold">Processing row 412 of 1,200...</h3>
        </div>
        <span className="text-4xl font-black text-secondary">{progress}%</span>
      </div>

      <div className="relative z-10 h-4 w-full bg-white/10 rounded-full overflow-hidden mb-6">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full bg-secondary relative"
        />
      </div>

      <div className="relative z-10 flex items-center gap-8 border-t border-white/10 pt-6">
        <div className="flex items-center gap-2.5">
          <Clock size={16} className="text-white/60" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-white/60 uppercase tracking-wider">Est. Time</span>
            <span className="text-sm font-bold tracking-tight">45s</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Activity size={16} className="text-white/60" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-white/60 uppercase tracking-wider">API Load</span>
            <span className="text-sm font-bold tracking-tight">32%</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <HardDrive size={16} className="text-white/60" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-white/60 uppercase tracking-wider">Nodes</span>
            <span className="text-sm font-bold tracking-tight">4 Active</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 ml-auto bg-white/10 px-4 py-2 rounded-lg">
          <Hash size={16} className="text-white/60" />
          <span className="text-xs font-bold tracking-tight text-white/80 uppercase">ID: MT-2024-X45</span>
        </div>
      </div>
    </div>
  );
}
