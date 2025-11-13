interface ErrorDisplayProps {
  message?: string
  onRetry?: () => void
}

export default function ErrorDisplay({ message = 'Ocorreu um erro ao carregar os dados', onRetry }: ErrorDisplayProps) {
  return (
    <div className="text-center py-12">
      <div className="text-red-400 text-xl mb-4">⚠️</div>
      <p className="text-gray-400 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-arc-primary hover:bg-arc-primary-hover text-white rounded-lg transition-colors"
        >
          Tentar Novamente
        </button>
      )}
    </div>
  )
}

