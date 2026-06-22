import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  email?: string;
  userId?: string;
  role?: string;
  permissions?: string[];
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: any;
}

export interface AuthState {
  authToken: string;
  userEmail: string;
  userId: string;
  role: string;
  permissions: string[];
  claims: Partial<JwtPayload>;
}

const initialState: AuthState = {
  authToken: '',
  userEmail: '',
  userId: '',
  role: '',
  permissions: [],
  claims: {},
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthToken: (state, action) => {
      const token = action.payload;
      state.authToken = token;
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        state.userEmail = decoded.email ?? '';
        state.userId = decoded.sub ?? decoded.userId ?? '';
        state.role = decoded.role ?? '';
        state.permissions = Array.isArray(decoded.permissions)
          ? decoded.permissions
          : [];
        state.claims = decoded;
      } catch (err) {
        console.error('Failed to decode JWT:', err);
      }
    },
    clearAuth: (state) => {
      state.authToken = '';
      state.userEmail = '';
      state.userId = '';
      state.role = '';
      state.permissions = [];
      state.claims = {};
    },
  },
});

export const { setAuthToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;
