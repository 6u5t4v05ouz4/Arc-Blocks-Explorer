import { useState, useEffect } from 'react'
import { useMainPageBlocks, useBlocksByHeights } from '../hooks/useBlocks'
import BlockCard from './BlockCard'
import BlockNavigation from './BlockNavigation'
import BlockDetails from './BlockDetails'
import LoadingSpinner from './LoadingSpinner'
import ErrorDisplay from './ErrorDisplay'
import BlockCardSkeleton from './BlockCardSkeleton'
import { BLOCKS_TO_SHOW } from '../utils/constants'

export default function BlockList() {
  const { data: mainBlocks, isLoading: isLoadingMain } = useMainPageBlocks()
  const [currentBlockHeight, setCurrentBlockHeight] = useState<number | null>(null)
  const [selectedBlockHeight, setSelectedBlockHeight] = useState<number | null>(null)
  const [isAutoMode, setIsAutoMode] = useState(true) // Modo automático (segue o mais recente)

  // Define o bloco atual quando os dados principais carregam
  useEffect(() => {
    if (mainBlocks && mainBlocks.length > 0) {
      if (currentBlockHeight === null) {
        // Primeira carga
        setCurrentBlockHeight(mainBlocks[0].height)
        setIsAutoMode(true)
      } else if (isAutoMode) {
        // Se está em modo automático, atualiza para o bloco mais recente
        const latestHeight = mainBlocks[0].height
        if (latestHeight > currentBlockHeight) {
          setCurrentBlockHeight(latestHeight)
        }
      }
    }
  }, [mainBlocks, currentBlockHeight, isAutoMode])

  // Calcula os blocos anteriores e posteriores
  const blockHeights: number[] = []
  if (currentBlockHeight !== null) {
    // 3 blocos anteriores
    for (let i = BLOCKS_TO_SHOW.BEFORE; i > 0; i--) {
      const height = currentBlockHeight - i
      if (height > 0) {
        blockHeights.push(height)
      }
    }
    // Bloco atual
    blockHeights.push(currentBlockHeight)
    // 3 blocos posteriores
    for (let i = 1; i <= BLOCKS_TO_SHOW.AFTER; i++) {
      blockHeights.push(currentBlockHeight + i)
    }
  }

  const { data: blocks, isLoading: isLoadingBlocks, error: blocksError, refetch: refetchBlocks } = useBlocksByHeights(
    blockHeights
  )

  // Ordena os blocos por altura (mais recente primeiro)
  const sortedBlocks = blocks
    ? [...blocks].sort((a, b) => b.height - a.height)
    : []

  const handleBlockClick = (height: number) => {
    setSelectedBlockHeight(height)
  }

  const handleNavigate = (direction: 'prev' | 'next' | 'latest') => {
    if (direction === 'latest' && mainBlocks && mainBlocks.length > 0) {
      setCurrentBlockHeight(mainBlocks[0].height)
      setIsAutoMode(true) // Volta ao modo automático
    } else if (direction === 'prev' && currentBlockHeight !== null) {
      setCurrentBlockHeight(currentBlockHeight - 1)
      setIsAutoMode(false) // Desativa modo automático ao navegar manualmente
    } else if (direction === 'next' && currentBlockHeight !== null) {
      setCurrentBlockHeight(currentBlockHeight + 1)
      setIsAutoMode(false) // Desativa modo automático ao navegar manualmente
    }
  }

  const handleSearch = (height: number) => {
    setCurrentBlockHeight(height)
    setIsAutoMode(false) // Desativa modo automático ao buscar manualmente
  }

  if (blocksError) {
    return (
      <div className="space-y-6">
        <BlockNavigation
          currentHeight={currentBlockHeight}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
          isAutoMode={isAutoMode}
        />
        <ErrorDisplay 
          message="Error loading blocks. Check your connection and try again."
          onRetry={() => refetchBlocks()}
        />
      </div>
    )
  }

  if (isLoadingMain || isLoadingBlocks) {
    return (
      <div className="space-y-6">
        <BlockNavigation
          currentHeight={currentBlockHeight}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
          isAutoMode={isAutoMode}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <BlockCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (!blocks || blocks.length === 0) {
    return (
      <div className="space-y-6">
        <BlockNavigation
          currentHeight={currentBlockHeight}
          onNavigate={handleNavigate}
          onSearch={handleSearch}
          isAutoMode={isAutoMode}
        />
        <div className="text-center py-12">
          <p className="text-gray-400">No blocks found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <BlockNavigation
        currentHeight={currentBlockHeight}
        onNavigate={handleNavigate}
        onSearch={(height) => setCurrentBlockHeight(height)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        {sortedBlocks.map((block, index) => (
          <div
            key={block.height}
            className="animate-fadeIn"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <BlockCard
              block={block}
              isCurrent={block.height === currentBlockHeight}
              onClick={() => handleBlockClick(block.height)}
            />
          </div>
        ))}
      </div>

      {selectedBlockHeight && (
        <BlockDetails
          height={selectedBlockHeight}
          onClose={() => setSelectedBlockHeight(null)}
          onNavigate={(height) => {
            setSelectedBlockHeight(height)
            setCurrentBlockHeight(height)
          }}
        />
      )}
    </div>
  )
}

