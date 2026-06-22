import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/redux/store';
import { ToastContainer } from '@/components/common/ToastContainer';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ErrorBoundary>
          {children}
          <ToastContainer />
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  );
};
