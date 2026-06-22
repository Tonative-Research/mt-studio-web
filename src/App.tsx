import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import LandingPage from '@/pages/LandingPage';
import DashboardPage from '@/pages/DashboardPage';

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
          {isDev && ComponentShowcasePage && (
            <Route path="/dev/components" element={<ComponentShowcasePage />} />
          )}
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
