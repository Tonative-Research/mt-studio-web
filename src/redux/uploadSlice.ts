import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUploadedFile, ICsvColumn } from '@/services/types/upload';

interface LanguageOption {
  value: string;
  label: string;
}

interface UploadState {
  uploadedFile: IUploadedFile | null;
  columns: ICsvColumn[];
  selectedTextColumn: string;
  sourceLanguage: string;
  targetLanguage: string;
  availableLanguages: LanguageOption[];
  previewRows: Record<string, string>[];
}

const initialState: UploadState = {
  uploadedFile: null,
  columns: [],
  selectedTextColumn: '',
  sourceLanguage: '',
  targetLanguage: '',
  availableLanguages: [],
  previewRows: [],
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    setUploadedFile: (state, action: PayloadAction<IUploadedFile>) => {
      state.uploadedFile = action.payload;
    },
    setColumns: (state, action: PayloadAction<ICsvColumn[]>) => {
      state.columns = action.payload;
    },
    setSelectedTextColumn: (state, action: PayloadAction<string>) => {
      state.selectedTextColumn = action.payload;
    },
    setSourceLanguage: (state, action: PayloadAction<string>) => {
      state.sourceLanguage = action.payload;
    },
    setTargetLanguage: (state, action: PayloadAction<string>) => {
      state.targetLanguage = action.payload;
    },
    setAvailableLanguages: (state, action: PayloadAction<LanguageOption[]>) => {
      state.availableLanguages = action.payload;
    },
    setPreviewRows: (state, action: PayloadAction<Record<string, string>[]>) => {
      state.previewRows = action.payload;
    },
    resetUploadState: () => initialState,
  },
});

export const {
  setUploadedFile,
  setColumns,
  setSelectedTextColumn,
  setSourceLanguage,
  setTargetLanguage,
  setAvailableLanguages,
  setPreviewRows,
  resetUploadState,
} = uploadSlice.actions;

export default uploadSlice.reducer;
