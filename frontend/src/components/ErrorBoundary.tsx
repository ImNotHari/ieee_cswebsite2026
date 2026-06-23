import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default fallback if none is provided
      return (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          border: '1px solid rgba(255, 60, 60, 0.3)', 
          borderRadius: '12px',
          background: 'rgba(255, 60, 60, 0.05)',
          margin: '2rem'
        }}>
          <h2 style={{ color: '#ff4d4d', marginBottom: '1rem' }}>Something went wrong</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {this.state.error?.message || 'An unexpected error occurred while loading this component.'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              border: '1px solid #ff4d4d',
              color: '#ff4d4d',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
