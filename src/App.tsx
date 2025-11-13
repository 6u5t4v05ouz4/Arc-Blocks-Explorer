import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Header from './components/Header'
import BlockList from './components/BlockList'
import TerminalView from './components/TerminalView'
import ModeSelector from './components/ModeSelector'
import BlockDetailsPage from './pages/BlockDetailsPage'
import { BlockProvider, useBlockContext } from './contexts/BlockContext'
import ErrorBoundary from './components/ErrorBoundary'

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
          
        <ErrorBoundary>
          {viewMode === 'terminal' ? (
            <ErrorBoundary fallback={
              <div className="bg-arc-gray border border-red-500 rounded-lg p-8 text-center">
                <p className="text-red-400 mb-2">Terminal mode encountered an error</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-arc-primary hover:underline"
                >
                  Refresh page
                </button>
              </div>
            }>
              <TerminalView />
            </ErrorBoundary>
          ) : (
            <ErrorBoundary fallback={
              <div className="bg-arc-gray border border-red-500 rounded-lg p-8 text-center">
                <p className="text-red-400 mb-2">Cards mode encountered an error</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-arc-primary hover:underline"
                >
                  Refresh page
                </button>
              </div>
            }>
              <BlockList />
            </ErrorBoundary>
          )}
        </ErrorBoundary>
      </main>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <BlockProvider>
          <Routes>
            <Route path="/" element={<AppContent />} />
            <Route path="/block/:height" element={<BlockDetailsPage />} />
          </Routes>
        </BlockProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App

