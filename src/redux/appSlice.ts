import { createSlice } from '@reduxjs/toolkit';

interface AppState {
  showSidebar: boolean;
  searchValue: string;
}

const initialState: AppState = {
  showSidebar: false,
  searchValue: '',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setShowSidebar: (state, action) => {
      state.showSidebar = action.payload;
    },
    setAppSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
  },
});

export const { setShowSidebar, setAppSearchValue } = appSlice.actions;
export default appSlice.reducer;
