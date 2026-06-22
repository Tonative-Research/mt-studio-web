import { motion } from 'motion/react';
import UploadZone from '@/components/dashboard/UploadZone';
import EngineConfigForm from '@/components/dashboard/EngineConfigForm';
import ProcessingStatus from '@/components/common/ProcessingStatus';
import PreviewTable from '@/components/dashboard/PreviewTable';

export default function Dashboard() {
  return (
    <main className="flex-1 min-h-[calc(100vh-4rem)] p-6 lg:p-12 max-w-7xl mx-auto w-full space-y-8 lg:space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <h1 className="text-3xl lg:text-4xl font-black tracking-tighter text-primary-500">
            MT Studio
          </h1>
          <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded font-black text-[9px] uppercase tracking-widest text-primary-500/70">
            Translation Engine
          </span>
        </div>
        <p className="text-gray-500 max-w-2xl leading-relaxed text-sm lg:text-base">
          Orchestrate large-scale dataset translations across high-performance
          LLM infrastructures with MTStudio's linguistic bridge.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        <div className="lg:col-span-3 h-full">
          <UploadZone />
        </div>
        <div className="lg:col-span-2 h-full">
          <EngineConfigForm />
        </div>
      </div>

      <ProcessingStatus />

      <PreviewTable />
    </main>
  );
}
