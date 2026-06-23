import { ITranslationJob } from '@/services/types/translate';

const STORAGE_KEY = 'mtstudio_sessions';

export interface ISessionRecord {
  sessionId: string;
  fileName: string;
  sourceLanguage: string;
  targetLanguage: string;
  status: string;
  createdAt: string; // ISO string
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
      status: job.status,
      createdAt: job.createdAt ?? new Date().toISOString(),
    };
    // Update existing record if same sessionId, otherwise prepend
    const idx = sessions.findIndex((s) => s.sessionId === job.id);
    if (idx !== -1) {
      sessions[idx] = record;
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
