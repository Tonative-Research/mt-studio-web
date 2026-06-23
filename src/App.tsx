import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import LandingPage from '@/pages/LandingPage';
import DashboardPage from '@/pages/DashboardPage';
import HistoryPage from '@/pages/HistoryPage';

const isDev = import.meta.env.DEV;

// Lazy-load the showcase so it is never bundled in production
const ComponentShowcasePage = isDev
  ? (await import('@/pages/ComponentShowcasePage')).default
  : null;

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/history" element={<HistoryPage />} />
          {isDev && ComponentShowcasePage && (
            <Route path="/dev/components" element={<ComponentShowcasePage />} />
          )}
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
