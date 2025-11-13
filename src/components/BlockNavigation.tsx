import { useState } from 'react'

interface BlockNavigationProps {
  currentHeight: number | null
  onNavigate: (direction: 'prev' | 'next' | 'latest') => void
  onSearch: (height: number) => void
  isAutoMode?: boolean
}

export default function BlockNavigation({ currentHeight, onNavigate, onSearch, isAutoMode = false }: BlockNavigationProps) {
  const [searchHeight, setSearchHeight] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const height = parseInt(searchHeight)
    if (!isNaN(height) && height > 0) {
      onSearch(height)
      setSearchHeight('')
    }
  }

  return (
    <div className="bg-arc-gray border border-arc-gray-light rounded-lg p-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('latest')}
            className="px-4 py-2 bg-arc-primary hover:bg-arc-primary-hover text-white rounded-lg transition-colors font-semibold"
          >
            Latest
          </button>
          <button
            onClick={() => onNavigate('prev')}
            disabled={currentHeight === null}
            className="px-4 py-2 bg-arc-gray-light hover:bg-arc-gray border border-arc-gray-light text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <button
            onClick={() => onNavigate('next')}
            disabled={currentHeight === null}
            className="px-4 py-2 bg-arc-gray-light hover:bg-arc-gray border border-arc-gray-light text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="number"
            value={searchHeight}
            onChange={(e) => setSearchHeight(e.target.value)}
            placeholder="Search by height..."
            className="px-4 py-2 bg-arc-gray-light border border-arc-gray-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-arc-primary"
            min="1"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-arc-primary hover:bg-arc-primary-hover text-white rounded-lg transition-colors"
          >
            Search
          </button>
        </form>

        {currentHeight !== null && (
          <div className="flex items-center gap-2 text-sm">
            <div className="text-gray-400">
              Current Block: <span className="text-white font-semibold">#{currentHeight}</span>
            </div>
            {isAutoMode && (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded text-green-400 text-xs">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>Auto</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

