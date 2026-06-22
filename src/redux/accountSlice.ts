import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '@/services/types/account';

interface AccountState {
  currentUser: IUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  currentUser: null,
  isLoading: false,
  error: null,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<IUser>) => {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    setAccountLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAccountError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setCurrentUser,
  clearCurrentUser,
  setAccountLoading,
  setAccountError,
} = accountSlice.actions;

export default accountSlice.reducer;
