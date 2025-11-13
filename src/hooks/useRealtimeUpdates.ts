import { useEffect, useState } from 'react'
import { useMainPageBlocks } from './useBlocks'

/**
 * Hook para detectar novos blocos em tempo real
 */
export function useRealtimeUpdates() {
  const { data: blocks, isFetching } = useMainPageBlocks()
  const [lastBlockHeight, setLastBlockHeight] = useState<number | null>(null)
  const [newBlockDetected, setNewBlockDetected] = useState(false)

  useEffect(() => {
    if (blocks && blocks.length > 0) {
      const currentHeight = blocks[0].height
      
      if (lastBlockHeight !== null && currentHeight > lastBlockHeight) {
        setNewBlockDetected(true)
        // Reset após 3 segundos
        setTimeout(() => setNewBlockDetected(false), 3000)
      }
      
      setLastBlockHeight(currentHeight)
    }
  }, [blocks, lastBlockHeight])

  return {
    isFetching,
    newBlockDetected,
  }
}

