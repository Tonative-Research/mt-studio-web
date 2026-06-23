import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, ChevronDown, ChevronUp, Clock, ArrowRight, Inbox } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { getSessions, type ISessionRecord } from '@/utils/sessionStorage';
import { ETranslationStatus } from '@/services/types/translate';

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
  const variant = statusVariant(record.status);

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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── main component ─────────────────────────────────────────────────────────

export default function HistoryContent() {
  const sessions = getSessions();

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
