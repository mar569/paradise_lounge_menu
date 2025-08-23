// ErrorBoundary.tsx
import React, { Component, type ErrorInfo } from 'react';

interface Props {
    children: React.ReactNode;
    fallbackUI?: React.ReactNode;
    errorMessage?: string;
    onRetry?: () => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Error caught in ErrorBoundary:", error, errorInfo);

    }

    resetError = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    handleRetry = () => {
        this.resetError();
        if (this.props.onRetry) {
            this.props.onRetry();
        }
    };

    render() {
        if (this.state.hasError) {
            return (
                <div role="alert" className="error-boundary">
                    <h2 className='text-3xl'>{this.props.errorMessage || "Что-то пошло не так."}</h2>
                    <p>Пожалуйста, попробуйте обновить страницу или вернуться назад.</p>
                    <span onClick={this.handleRetry} className="btn btn-primary" aria-label="Попробовать снова">
                        Попробовать снова
                    </span>
                    {this.props.fallbackUI}
                    {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                        <details>
                            <summary>Подробнее об ошибке</summary>
                            <pre>{this.state.errorInfo.componentStack}</pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
