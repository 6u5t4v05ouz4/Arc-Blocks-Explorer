import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Atualiza o state para que o próximo render mostre o fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log do erro para diagnóstico
    console.error('ErrorBoundary capturou um erro:', error, errorInfo)

    // Atualiza o state com informações detalhadas do erro
    this.setState({
      error,
      errorInfo
    })

    // Aqui você poderia enviar o erro para um serviço de logging
    // logErrorToService(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      // Fallback customizado ou usar o fallback fornecido
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Fallback padrão
      return (
        <div className="min-h-screen bg-arc-gray flex items-center justify-center p-4">
          <div className="bg-arc-gray-light border border-red-500 rounded-lg p-6 max-w-md w-full text-center">
            <div className="text-red-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Ops! Algo deu errado</h2>
            <p className="text-gray-400 mb-4">
              O aplicativo encontrou um erro inesperado. Por favor, tente novamente.
            </p>

            {/* Mostrar detalhes do erro em ambiente de desenvolvimento */}
            {import.meta.env.DEV && this.state.error && (
              <details className="text-left text-gray-300 text-sm mb-4">
                <summary className="cursor-pointer hover:text-white mb-2">
                  Detalhes do erro (desenvolvimento)
                </summary>
                <div className="bg-arc-gray p-3 rounded mt-2">
                  <p className="text-red-400 font-mono text-xs mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <p className="text-yellow-400 font-mono text-xs">
                      {this.state.errorInfo.componentStack}
                    </p>
                  )}
                </div>
              </details>
            )}

            <button
              onClick={this.handleRetry}
              className="bg-arc-primary hover:bg-arc-primary/80 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary