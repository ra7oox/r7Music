import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center p-12 text-center"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <div
            className="text-6xl mb-4"
            style={{ filter: 'grayscale(0.5)' }}
          >
            🎵
          </div>
          <h2
            className="text-xl font-semibold mb-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Something went wrong
          </h2>
          <p className="text-sm mb-6 max-w-md" style={{ color: 'var(--color-text-muted)' }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            className="btn-play px-6 py-2 rounded-full text-sm font-medium"
            style={{ width: 'auto', height: 'auto', borderRadius: '999px', padding: '8px 20px' }}
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try Again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
