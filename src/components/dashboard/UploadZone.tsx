import { CloudUpload, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function UploadZone() {
  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
          1
        </div>
        <h3 className="font-semibold text-lg text-gray-900">File Handling</h3>
      </div>

      <div className="flex-1 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-8 transition-colors hover:border-primary-400 hover:bg-primary-50/30 group cursor-pointer">
        <motion.div
          whileHover={{ scale: 1.08 }}
          className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 mb-4"
        >
          <CloudUpload size={24} />
        </motion.div>
        <p className="font-semibold text-sm text-gray-700">Drop your CSV files here</p>
        <p className="text-xs text-gray-400 mt-1">or click to browse · max 50 MB</p>
      </div>

      <div className="mt-5 p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 text-primary-500 rounded-lg">
            <FileText size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">dataset_alpha.csv</p>
            <p className="text-[10px] text-gray-400">4.2 MB</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-accent-600">
          <CheckCircle2 size={16} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
        </div>
      </div>
    </div>
  );
}
