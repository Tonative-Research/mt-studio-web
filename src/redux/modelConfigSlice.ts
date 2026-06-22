import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IGeminiModel } from '@/services/types/model';

interface ModelConfigState {
  availableModels: IGeminiModel[];
  selectedModel: IGeminiModel | null;
}

const initialState: ModelConfigState = {
  availableModels: [],
  selectedModel: null,
};

const modelConfigSlice = createSlice({
  name: 'modelConfig',
  initialState,
  reducers: {
    setAvailableModels: (state, action: PayloadAction<IGeminiModel[]>) => {
      state.availableModels = action.payload;
    },
    setSelectedModel: (state, action: PayloadAction<IGeminiModel>) => {
      state.selectedModel = action.payload;
    },
    resetModelConfig: () => initialState,
  },
});

export const { setAvailableModels, setSelectedModel, resetModelConfig } =
  modelConfigSlice.actions;

export default modelConfigSlice.reducer;
