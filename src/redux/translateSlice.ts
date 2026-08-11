import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITranslationJob, ETranslationStatus } from '@/services/types/translate';
import { saveSession, updateSessionProgress } from '@/utils/sessionStorage';

const TERMINAL_STATUSES: ETranslationStatus[] = [
  ETranslationStatus.Completed,
  ETranslationStatus.Failed,
];

interface TranslateState {
  currentJob: ITranslationJob | null; // job shown on the active upload/config page
  activeJobs: Record<string, ITranslationJob>; // every job still being polled, keyed by id
  error: string | null;
}

const initialState: TranslateState = {
  currentJob: null,
  activeJobs: {},
  error: null,
};

const translateSlice = createSlice({
  name: 'translate',
  initialState,
  reducers: {
    // Starts a job and puts it under tracking. Doesn't remove any other
    // job that's still in flight — multiple jobs can be active at once.
  setCurrentJob: (state, action: PayloadAction<ITranslationJob>) => {
    if (!state.activeJobs) state.activeJobs = {};
    state.currentJob = action.payload;
    state.activeJobs[action.payload.id] = action.payload;
    saveSession(action.payload);
  },
  updateJobStatus: (
    state,
    action: PayloadAction<{ id: string; status: ETranslationStatus }>,
  ) => {
    if (!state.activeJobs) state.activeJobs = {};
    const { id, status } = action.payload;
    const job = state.activeJobs[id];
    if (job) job.status = status;
    if (state.currentJob?.id === id) state.currentJob.status = status;

    updateSessionProgress(id, { status });

    if (TERMINAL_STATUSES.includes(status)) {
      delete state.activeJobs[id];
    }
  },
  updateJobProgress: (
    state,
    action: PayloadAction<{
      id: string;
      percent: number;
      translatedRows: number;
      totalRows: number;
      message?: string;
      hasErrors?: boolean;
    }>,
  ) => {
    if (!state.activeJobs) state.activeJobs = {};
    const { id, percent, translatedRows, totalRows, message, hasErrors } = action.payload;
    const job = state.activeJobs[id];
    if (job) {
      job.percent = percent;
      job.translatedRows = translatedRows;
      job.totalRows = totalRows;
      job.message = message;
      job.hasErrors = hasErrors;
      job.fetchFailed = false;
    }
    if (state.currentJob?.id === id) {
      state.currentJob.percent = percent;
      state.currentJob.translatedRows = translatedRows;
      state.currentJob.totalRows = totalRows;
      state.currentJob.message = message;
      state.currentJob.hasErrors = hasErrors;
      state.currentJob.fetchFailed = false;
    }
    updateSessionProgress(id, { percent, completedRows: translatedRows, totalRows });
  },
  setJobFetchFailed: (state, action: PayloadAction<{ id: string; failed: boolean }>) => {
    if (!state.activeJobs) state.activeJobs = {};
    const { id, failed } = action.payload;
    const job = state.activeJobs[id];
    if (job) job.fetchFailed = failed;
    if (state.currentJob?.id === id) state.currentJob.fetchFailed = failed;
  },
    setTranslateError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetTranslateState: () => initialState,
  },
});

export const {
  setCurrentJob,
  updateJobStatus,
  updateJobProgress,
  setJobFetchFailed,
  setTranslateError,
  resetTranslateState,
} = translateSlice.actions;

export default translateSlice.reducer;