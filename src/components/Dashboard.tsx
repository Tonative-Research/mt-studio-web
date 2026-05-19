import { Wand2 } from 'lucide-react';
import { motion } from 'motion/react';
import UploadZone from './UploadZone';
import EngineConfigForm from './EngineConfigForm';
import ProcessingStatus from './ProcessingStatus';
import PreviewTable from './PreviewTable';

export default function Dashboard() {
  return (
    <main className="flex-1 min-h-[calc(100vh-4rem)] p-12 max-w-7xl mx-auto space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-black tracking-tighter text-primary">MT Studio</h1>
          <span className="px-3 py-1 bg-surface-container border border-outline/10 rounded font-black text-[9px] uppercase tracking-widest text-primary/60">
            Translation Engine
          </span>
        </div>
        <p className="text-on-surface-variant max-w-2xl leading-relaxed">
          Orchestrate large-scale dataset translations across high-performance LLM infrastructures with Project MT's proprietary linguistic bridge.
        </p>
      </motion.div>

      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-3 h-full">
          <UploadZone />
        </div>
        <div className="col-span-2 h-full">
          <EngineConfigForm />
        </div>
      </div>

      <ProcessingStatus />

      <PreviewTable />

      <footer className="pt-12 pb-8 text-center border-t border-outline/5 text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
        Project MT Infrastructure System • Version 2.0.4 • © 2024
      </footer>
    </main>
  );
}
