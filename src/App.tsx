import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Header from './components/Header'
import BlockList from './components/BlockList'
import TerminalView from './components/TerminalView'
import ModeSelector from './components/ModeSelector'
import { BlockProvider, useBlockContext } from './contexts/BlockContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function AppContent() {
  const [viewMode, setViewMode] = useState<'cards' | 'terminal'>('terminal')
  const { currentBlockHeight, isAutoMode } = useBlockContext()

  return (
    <div className="min-h-screen bg-arc-dark text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <ModeSelector 
            currentMode={viewMode} 
            onModeChange={setViewMode}
            currentBlockHeight={currentBlockHeight}
            isAutoMode={isAutoMode}
          />
        </div>
          
          {viewMode === 'terminal' ? (
            <TerminalView />
          ) : (
            // Modo Cards comentado/desabilitado para não sobrecarregar
            // <BlockList />
            <div className="bg-arc-gray border border-arc-gray-light rounded-lg p-8 text-center">
              <p className="text-gray-400 mb-4">Cards mode is disabled for better performance.</p>
              <p className="text-sm text-gray-500">Use Terminal mode for fast and efficient visualization.</p>
            </div>
          )}
        </main>
      </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BlockProvider>
        <AppContent />
      </BlockProvider>
    </QueryClientProvider>
  )
}

export default App

