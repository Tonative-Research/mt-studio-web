import { Languages, Cpu, Hash, RefreshCw, AlertTriangle, AlertCircle } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { ETranslationStatus } from '@/services/types/translate';
import { Badge } from '@/components/common/Badge';

const TERMINAL_STATUSES: ETranslationStatus[] = [
  ETranslationStatus.Completed,
  ETranslationStatus.Failed,
];

const STATUS_BADGE_VARIANT: Record<ETranslationStatus, 'info' | 'success' | 'warning' | 'error' | 'neutral'> = {
  [ETranslationStatus.Idle]: 'neutral',
  [ETranslationStatus.Pending]: 'warning',
  [ETranslationStatus.Processing]: 'info',
  [ETranslationStatus.Completed]: 'success',
  [ETranslationStatus.Failed]: 'error',
};

const STATUS_LABEL: Record<ETranslationStatus, string> = {
  [ETranslationStatus.Idle]: 'Idle',
  [ETranslationStatus.Pending]: 'Pending',
  [ETranslationStatus.Processing]: 'Processing',
  [ETranslationStatus.Completed]: 'Completed',
  [ETranslationStatus.Failed]: 'Failed',
};

const FALLBACK_MESSAGE: Record<ETranslationStatus, string> = {
  [ETranslationStatus.Idle]: 'Waiting to start...',
  [ETranslationStatus.Pending]: 'Waiting to start...',
  [ETranslationStatus.Processing]: 'Translation in progress',
  [ETranslationStatus.Completed]: 'Translation complete',
  [ETranslationStatus.Failed]: 'Translation failed',
};

export default function ProcessingStatus() {
  const currentJob = useAppSelector((state) => state.translate.currentJob);

 if (!currentJob) {
    return null;
  }

  if (currentJob.fetchFailed) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 flex items-center gap-3">
        <AlertTriangle size={20} className="shrink-0" />
        <p className="text-sm font-medium">
          Couldn't fetch status for job {currentJob.id}. It may still be starting up — this will retry automatically.
        </p>
      </div>
    );
  }

  const status = currentJob.status;
  const isActive = !TERMINAL_STATUSES.includes(status);
  const percent = Math.max(0, Math.min(100, currentJob.percent ?? 0));
  const hasRowCounts = currentJob.totalRows > 0;

  const modelName = currentJob.modelId || '—';
  const sourceLanguage = currentJob.sourceLanguage || '—';
  const targetLanguage = currentJob.targetLanguage || '—';


  return (
  <div className="bg-primary-800 text-white rounded-xl shadow-lg shadow-primary-500/20 p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 text-white/5 pointer-events-none">
          <RefreshCw size={200} strokeWidth={1} className={isActive ? 'animate-spin [animation-duration:6s]' : ''} />
        </div>

        <div className="relative z-10 flex items-start justify-between mb-4 gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 block">
              <span className="text-white/50">Current Task:</span>{' '}
              <span className="text-accent-400">Translation Job</span>
            </span>
            <h3 className="text-xl lg:text-2xl font-bold flex items-center gap-3">
              {currentJob.message || FALLBACK_MESSAGE[status]}
            </h3>
          </div>
          <Badge variant={STATUS_BADGE_VARIANT[status]} size="md" dot>
            {STATUS_LABEL[status]}
          </Badge>
        </div>

        {status === ETranslationStatus.Completed && currentJob.hasErrors && (
          <div className="relative z-10 flex items-center gap-2 text-amber-300 text-xs font-semibold mb-4 bg-amber-500/10 rounded-lg px-3 py-2">
            <AlertCircle size={14} className="shrink-0" />
            Completed, but some rows had errors.
          </div>
        )}

        {/* Progress bar */}
        <div className="relative z-10 mb-2 mt-2">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-[width] duration-500 ease-out ${
                status === ETranslationStatus.Failed ? 'bg-red-400' : 'bg-accent-500'
              }`}
              style={{ width: `${isActive || status === ETranslationStatus.Completed ? percent : 0}%` }}
            />
          </div>
          {hasRowCounts && (
            <div className="flex justify-between mt-1.5 text-[11px] font-semibold text-white/60">
              <span>{currentJob.translatedRows} / {currentJob.totalRows} rows</span>
              <span>{percent.toFixed(0)}%</span>
            </div>
          )}
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/10 pt-5 mt-4">
          <div className="flex items-center gap-2.5">
            <Languages size={16} className="text-white/50" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-white/50 uppercase tracking-wider">Languages</span>
              <span className="text-sm font-bold tracking-tight uppercase">{sourceLanguage} → {targetLanguage}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Cpu size={16} className="text-white/50" />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-white/50 uppercase tracking-wider">Model</span>
              <span className="text-sm font-bold tracking-tight">{modelName}</span>
            </div>
          </div>
          <div className="ml-auto bg-white/10 px-4 py-2 rounded-lg flex items-center gap-2">
            <Hash size={12} className="text-white/50" />
            <span className="text-xs font-bold tracking-tight text-white/70 uppercase">{currentJob.id}</span>
          </div>
        </div>
    </div>
  );
}