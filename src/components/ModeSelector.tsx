interface ModeSelectorProps {
  currentMode: 'cards' | 'terminal'
  onModeChange: (mode: 'cards' | 'terminal') => void
  currentBlockHeight?: number | null
  isAutoMode?: boolean
}

export default function ModeSelector({ currentMode, onModeChange, currentBlockHeight, isAutoMode }: ModeSelectorProps) {
  return (
    <div className="flex gap-2 items-center bg-arc-gray border border-arc-gray-light rounded-lg p-2">
      <button
        onClick={() => onModeChange('terminal')}
        className={`px-4 py-2 rounded transition-colors font-semibold text-sm ${
          currentMode === 'terminal'
            ? 'bg-arc-primary text-white'
            : 'bg-arc-gray-light text-gray-400 hover:text-white'
        }`}
      >
        ⚡ Terminal
      </button>
      <button
        onClick={() => onModeChange('cards')}
        className={`px-4 py-2 rounded transition-colors font-semibold text-sm ${
          currentMode === 'cards'
            ? 'bg-arc-primary text-white'
            : 'bg-arc-gray-light text-gray-400 hover:text-white'
        }`}
      >
        🎴 Cards
      </button>
      
      {currentBlockHeight !== null && currentBlockHeight !== undefined && (
        <div className="flex-1 flex justify-end">
          <div className="text-gray-400 font-mono text-sm">
            Block: <span className="text-arc-primary font-bold">#{currentBlockHeight}</span>
            {isAutoMode && (
              <span className="ml-2 text-green-400">[AUTO]</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

