import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  /** Auto-dismiss after ms. 0 = stay until manually dismissed. Default: 4000 */
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
}

const initialState: ToastState = {
  toasts: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      state.toasts.push({
        ...action.payload,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearToasts } = toastSlice.actions;
export default toastSlice.reducer;

// ── Convenience helpers ────────────────────────────────────────────────────

type ToastInput = { message: string; duration?: number };

export const toast = {
  success: (input: ToastInput) =>
    addToast({ variant: 'success', ...input }),
  error: (input: ToastInput) =>
    addToast({ variant: 'error', duration: 0, ...input }),
  info: (input: ToastInput) =>
    addToast({ variant: 'info', ...input }),
  warning: (input: ToastInput) =>
    addToast({ variant: 'warning', ...input }),
};
