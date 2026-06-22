import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import {
  persistReducer,
  persistStore,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from '@/redux/baseApiSlice';
import appReducer from '@/redux/appSlice';
import authReducer from '@/redux/authSlice';
import accountReducer from '@/redux/accountSlice';
import translateReducer from '@/redux/translateSlice';
import uploadReducer from '@/redux/uploadSlice';
import modelConfigReducer from '@/redux/modelConfigSlice';
import toastReducer from '@/redux/toastSlice';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [baseApi.reducerPath],
};

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  account: accountReducer,
  translate: translateReducer,
  upload: uploadReducer,
  modelConfig: modelConfigReducer,
  toast: toastReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

const resettableRootReducer = (
  state: ReturnType<typeof rootReducer> | undefined,
  action: any,
) => rootReducer(state, action);

const persistedReducer = persistReducer(persistConfig, resettableRootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);

export const setupStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

export type AppStore = ReturnType<typeof setupStore>;
