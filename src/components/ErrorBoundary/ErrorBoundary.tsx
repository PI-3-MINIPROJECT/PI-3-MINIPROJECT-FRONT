import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import './ErrorBoundary.scss';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary component to catch and handle React errors gracefully
 * Provides user-friendly error messages and recovery options
 * Implements Nielsen's Heuristic 9: Help users recognize, diagnose, and recover from errors
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    window.location.href = '/explore';
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <div className="error-boundary__container">
            <div className="error-boundary__icon">⚠️</div>
            <h1 className="error-boundary__title">¡Algo salió mal!</h1>
            <p className="error-boundary__message">
              Lo sentimos, encontramos un problema inesperado. No te preocupes, tus datos están seguros.
            </p>

            <div className="error-boundary__suggestions">
              <h2 className="error-boundary__suggestions-title">¿Qué puedes hacer?</h2>
              <ul className="error-boundary__suggestions-list">
                <li>
                  <strong>Intenta de nuevo:</strong> A veces un error temporal se resuelve solo
                </li>
                <li>
                  <strong>Vuelve al inicio:</strong> Regresa a la página principal y comienza de nuevo
                </li>
                <li>
                  <strong>Refresca la página:</strong> Recarga el navegador (F5 o Ctrl+R)
                </li>
                <li>
                  <strong>Verifica tu conexión:</strong> Asegúrate de estar conectado a internet
                </li>
              </ul>
            </div>

            <div className="error-boundary__actions">
              <button
                type="button"
                className="error-boundary__button error-boundary__button--primary"
                onClick={this.handleRetry}
              >
                ↻ Intentar de nuevo
              </button>
              <button
                type="button"
                className="error-boundary__button error-boundary__button--secondary"
                onClick={this.handleReload}
              >
                🏠 Volver al inicio
              </button>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="error-boundary__details">
                <summary className="error-boundary__details-summary">
                  Detalles técnicos (solo en desarrollo)
                </summary>
                <pre className="error-boundary__details-content">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Wrapper component to provide navigation context to ErrorBoundary
 */
export function ErrorBoundaryWrapper({ children }: { children: ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}

export default ErrorBoundary;
