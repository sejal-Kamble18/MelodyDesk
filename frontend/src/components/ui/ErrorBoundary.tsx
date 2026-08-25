import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './Button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
          <div className="max-w-md rounded-[32px] border border-white/10 bg-slate-900/80 p-8 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Unexpected error</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Something went wrong</h1>
            <p className="mt-3 text-sm text-slate-400">Refresh to try again, or return to MelodyDesk.</p>
            <Button className="mt-6" onClick={() => window.location.reload()}>
              Reload page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
