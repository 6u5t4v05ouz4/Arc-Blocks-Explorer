interface ModeSelectorProps {
  currentMode: 'cards' | 'terminal'
  onModeChange: (mode: 'cards' | 'terminal') => void
}

export default function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
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
    </div>
  )
}

