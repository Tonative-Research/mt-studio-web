import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, ChevronDown, ChevronUp, Clock, ArrowRight, Inbox, Download } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { getSessions, updateSessionProgress, type ISessionRecord } from '@/utils/sessionStorage';
import { ETranslationStatus } from '@/services/types/translate';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { translateApi } from '@/services/api/translate';
import { downloadTranslationCsv } from '@/utils/downloadTranslationCsv';

// ── helpers ────────────────────────────────────────────────────────────────

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

function statusVariant(status: string): BadgeVariant {
  switch (status) {
    case ETranslationStatus.Completed:  return 'success';
    case ETranslationStatus.Processing: return 'info';
    case ETranslationStatus.Pending:    return 'warning';
    case ETranslationStatus.Failed:     return 'error';
    default:                            return 'neutral';
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case ETranslationStatus.Completed:  return 'Completed';
    case ETranslationStatus.Processing: return 'Processing';
    case ETranslationStatus.Pending:    return 'Pending';
    case ETranslationStatus.Failed:     return 'Failed';
    default:                            return 'Idle';
  }
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

// ── session row ────────────────────────────────────────────────────────────

function SessionRow({ record, index }: { record: ISessionRecord; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const authToken = useAppSelector((state) => state.auth?.authToken);
  const variant = statusVariant(record.status);
  const percent = Math.max(0, Math.min(100, record.percent ?? 0));
  const hasRowCounts = (record.totalRows ?? 0) > 0;
  const isCompleted = record.status === ETranslationStatus.Completed;

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation(); // don't toggle the expand/collapse when clicking download
    setDownloadError(null);
    setIsDownloading(true);
    try {
      await downloadTranslationCsv(record.sessionId, authToken);
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : 'Download failed.');
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-primary-200 hover:shadow-sm transition-all duration-150"
    >
      {/* Summary row */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full text-left px-5 py-4 flex items-center gap-4"
      >
        {/* File icon */}
        <div className="shrink-0 w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500">
          <FileText size={18} />
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{record.fileName}</p>
          <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-gray-400">
            <span className="uppercase font-bold tracking-wide">{record.sourceLanguage}</span>
            <ArrowRight size={10} />
            <span className="uppercase font-bold tracking-wide">{record.targetLanguage}</span>
          </div>
        </div>

        {/* Status badge */}
        <Badge variant={variant} dot size="sm" className="shrink-0">
          {statusLabel(record.status)}
        </Badge>

        {/* Time */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-gray-400 shrink-0">
          <Clock size={12} />
          <span>{formatDate(record.createdAt)}</span>
        </div>
        {isCompleted && (
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            title="Download CSV"
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-primary-500 hover:bg-primary-50 transition-colors disabled:opacity-50"
          >
            {isDownloading ? (
              <span className="w-3.5 h-3.5 border-2 border-primary-300 border-t-primary-500 rounded-full animate-spin" />
            ) : (
              <Download size={16} />
            )}
          </button>
        )}

        {/* Expand toggle */}
        <div className="shrink-0 text-gray-400">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                  Session ID
                </p>
                <p className="text-xs font-mono text-gray-700 break-all">{record.sessionId}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                  Source
                </p>
                <p className="text-sm font-semibold text-gray-800 uppercase">{record.sourceLanguage}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                  Target
                </p>
                <p className="text-sm font-semibold text-gray-800 uppercase">{record.targetLanguage}</p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                  Status
                </p>
                <Badge variant={variant} dot size="sm">
                  {statusLabel(record.status)}
                </Badge>
              </div>
              <div className="col-span-2 sm:col-span-4">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                  Started
                </p>
                <p className="text-xs text-gray-600">{formatDate(record.createdAt)}</p>
              </div>

               {hasRowCounts && (
                <div className="col-span-2 sm:col-span-4">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">
                    Progress
                  </p>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-[width] duration-500 ease-out ${
                        record.status === ETranslationStatus.Failed ? 'bg-red-400' : 'bg-primary-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5 text-[11px] font-semibold text-gray-400">
                    <span>
                      {record.completedRows} / {record.totalRows} rows
                    </span>
                    <span>{percent.toFixed(0)}%</span>
                  </div>
                </div>
              )}
          
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── main component ─────────────────────────────────────────────────────────
const TERMINAL_STATUSES: string[] = [ETranslationStatus.Completed, ETranslationStatus.Failed];

export default function HistoryContent() {
  // const sessions = getSessions();

  const dispatch = useAppDispatch();
  const [sessions, setSessions] = useState<ISessionRecord[]>(getSessions());

  // One-time reconcile: any session still non-terminal in storage may have
  // actually finished on the backend while it wasn't the focused/polled job
  // (ActiveJobsTracker only live-polls state.translate.currentJob). Rather
  // than poll every session continuously, fetch each stale one exactly once
  // when the history page is viewed.
  useEffect(() => {
    const stale = sessions.filter((s) => !TERMINAL_STATUSES.includes(s.status));
    if (stale.length === 0) return;

    let cancelled = false;
    (async () => {
      await Promise.all(
        stale.map(async (session) => {
          try {
            const result = await dispatch(
              translateApi.endpoints.getTranslationStatus.initiate(session.sessionId),
            ).unwrap();
            updateSessionProgress(session.sessionId, {
              status: result.status,
              percent: result.percent,
              completedRows: result.completedRows,
              totalRows: result.totalRows,
            });
          } catch {
            // Job may have expired on the backend (e.g. temp file cleanup) —
            // leave the session as-is in history rather than erroring the page.
          }
        }),
      );
      if (!cancelled) setSessions(getSessions());
    })();

    return () => {
      cancelled = true;
    };
    // Run once per mount only — intentionally excluding `sessions` so this
    // doesn't loop when setSessions triggers a re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex-1 min-h-[calc(100vh-4rem)] p-6 lg:p-12 max-w-7xl mx-auto w-full space-y-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h1 className="text-3xl lg:text-4xl font-black tracking-tighter text-primary-500">
          Session History
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          All translation jobs from this browser.{' '}
          <span className="text-gray-400">
            Stored locally.
          </span>
        </p>
      </motion.div>

      {/* Count */}
      {sessions.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">
            {sessions.length} session{sessions.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* List */}
      {sessions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300">
            <Inbox size={28} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">No sessions yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Sessions will appear here once you run a translation.
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {sessions.map((record, i) => (
            <SessionRow key={record.sessionId} record={record} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}
