import { ITranslationJob } from '@/services/types/translate';

const STORAGE_KEY = 'mtstudio_sessions';

export interface ISessionRecord {
  sessionId: string;
  fileName: string;
  sourceLanguage: string;
  targetLanguage: string;
  textColumn?: string;
  modelId?: string;
  fileId?: string;
  status: string;
  createdAt: string; // ISO string
  percent?: number;
  completedRows?: number;
  totalRows?: number;
}

export function getSessions(): ISessionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ISessionRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveSession(job: ITranslationJob): void {
  try {
    const sessions = getSessions();
    const record: ISessionRecord = {
      sessionId: job.id,
      fileName: job.fileName,
      sourceLanguage: job.sourceLanguage,
      targetLanguage: job.targetLanguage,
      textColumn: job.textColumn,
      modelId: job.modelId,
      fileId: job.fileId,
      status: job.status,
      createdAt: job.createdAt ?? new Date().toISOString(),
    };
    const idx = sessions.findIndex((s) => s.sessionId === job.id);
    if (idx !== -1) {
      // Preserve any progress fields already recorded for this session
      sessions[idx] = { ...sessions[idx], ...record };
    } else {
      sessions.unshift(record);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // localStorage unavailable — fail silently
  }
}

export function updateSessionStatus(sessionId: string, status: string): void {
  try {
    const sessions = getSessions();
    const idx = sessions.findIndex((s) => s.sessionId === sessionId);
    if (idx !== -1) {
      sessions[idx].status = status;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  } catch {
    // fail silently
  }
}

// Called on every status poll so history has a frozen snapshot of the
// last-known progress, since old jobs' live status may no longer be
// queryable from the backend once the session has finished.
export function updateSessionProgress(
  sessionId: string,
  patch: {
    status?: string;
    percent?: number;
    completedRows?: number;
    totalRows?: number;
  },
): void {
  try {
    const sessions = getSessions();
    const idx = sessions.findIndex((s) => s.sessionId === sessionId);
    if (idx !== -1) {
      sessions[idx] = { ...sessions[idx], ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  } catch {
    // fail silently
  }
}