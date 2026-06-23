import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITranslationJob, ETranslationStatus } from '@/services/types/translate';
import { saveSession, updateSessionStatus } from '@/utils/sessionStorage';

interface TranslateState {
  currentJob: ITranslationJob | null;
  jobStatus: ETranslationStatus;
  progress: number;
  translatedRows: number;
  totalRows: number;
  error: string | null;
}

const initialState: TranslateState = {
  currentJob: null,
  jobStatus: ETranslationStatus.Idle,
  progress: 0,
  translatedRows: 0,
  totalRows: 0,
  error: null,
};

const translateSlice = createSlice({
  name: 'translate',
  initialState,
  reducers: {
    setCurrentJob: (state, action: PayloadAction<ITranslationJob>) => {
      state.currentJob = action.payload;
      saveSession(action.payload);
    },
    setJobStatus: (state, action: PayloadAction<ETranslationStatus>) => {
      state.jobStatus = action.payload;
      if (state.currentJob) {
        updateSessionStatus(state.currentJob.id, action.payload);
      }
    },
    setProgress: (
      state,
      action: PayloadAction<{ progress: number; translatedRows: number; totalRows: number }>,
    ) => {
      state.progress = action.payload.progress;
      state.translatedRows = action.payload.translatedRows;
      state.totalRows = action.payload.totalRows;
    },
    setTranslateError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetTranslateState: () => initialState,
  },
});

export const {
  setCurrentJob,
  setJobStatus,
  setProgress,
  setTranslateError,
  resetTranslateState,
} = translateSlice.actions;

export default translateSlice.reducer;
