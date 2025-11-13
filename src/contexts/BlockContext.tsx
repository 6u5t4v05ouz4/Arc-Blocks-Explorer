import { createContext, useContext, useState, ReactNode } from 'react'

interface BlockContextType {
  currentBlockHeight: number | null
  isAutoMode: boolean
  setCurrentBlockHeight: (height: number | null) => void
  setIsAutoMode: (mode: boolean) => void
}

const BlockContext = createContext<BlockContextType | undefined>(undefined)

export function BlockProvider({ children }: { children: ReactNode }) {
  const [currentBlockHeight, setCurrentBlockHeight] = useState<number | null>(null)
  const [isAutoMode, setIsAutoMode] = useState(true)

  return (
    <BlockContext.Provider value={{ currentBlockHeight, isAutoMode, setCurrentBlockHeight, setIsAutoMode }}>
      {children}
    </BlockContext.Provider>
  )
}

export function useBlockContext() {
  const context = useContext(BlockContext)
  if (!context) {
    throw new Error('useBlockContext must be used within BlockProvider')
  }
  return context
}

