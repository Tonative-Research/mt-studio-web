import { CloudUpload, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function UploadZone() {
  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">1</div>
        <h3 className="font-semibold text-lg">File Handling</h3>
      </div>

      <div className="flex-1 border-2 border-dashed border-outline/20 rounded-xl flex flex-col items-center justify-center p-8 transition-colors hover:border-primary/30 group cursor-pointer bg-surface/50">
        <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
          <CloudUpload size={24} />
        </div>
        <p className="font-semibold text-sm">Drop your CSV files here</p>
        <p className="text-xs text-on-surface-variant mt-1">Maximum file size: 50MB</p>
      </div>

      <div className="mt-6 p-4 bg-surface rounded-lg border border-outline/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/5 text-primary rounded-lg">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold">dataset_alpha.csv</p>
            <p className="text-[10px] text-on-surface-variant">4.2 MB</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-green-600">
          <CheckCircle2 size={16} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
        </div>
      </div>
    </div>
  );
}
