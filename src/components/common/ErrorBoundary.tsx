import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  /** Custom fallback UI - receives the error and a reset function */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches unhandled render errors in the subtree and shows a recovery UI.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 *
 *   // Or with a custom fallback:
 *   <ErrorBoundary fallback={(err, reset) => <MyFallback error={err} onReset={reset} />}>
 *     <SomeFeature />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Replace with your error monitoring service (e.g. Sentry) when available
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (!hasError || !error) return children;

    if (fallback) return fallback(error, this.reset);

    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white border border-red-100 rounded-2xl p-8 text-center shadow-sm">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertTriangle size={22} className="text-red-500" />
          </div>

          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-gray-500 mb-1">
            An unexpected error occurred in this part of the application.
          </p>
          <p className="text-xs text-gray-400 font-mono bg-gray-50 rounded-lg px-3 py-2 mb-6 break-all text-left">
            {error.message}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="btn-primary w-full mb-3 justify-center"
          >
            <RefreshCw size={15} />
            Reload page
          </button>

          <button
            onClick={this.reset}
            className="btn-secondary w-full justify-center"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
}
