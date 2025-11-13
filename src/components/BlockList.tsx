import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useMainPageBlocks, useBlockByHeight } from '../hooks/useBlocks'
import BlockCard from './BlockCard'
import ErrorDisplay from './ErrorDisplay'
import BlockCardSkeleton from './BlockCardSkeleton'
import type { Block } from '../types/block'

const MAX_OLD_CARDS = 8 // Limite de cards antigos para performance

export default function BlockList() {
  const { data: mainBlocks, isLoading: isLoadingMain } = useMainPageBlocks()
  const [currentBlockHeight, setCurrentBlockHeight] = useState<number | null>(null)
  const [oldBlocksCache, setOldBlocksCache] = useState<Map<number, Block>>(new Map())
  const [isAutoMode, setIsAutoMode] = useState(true)
  const previousBlockRef = useRef<Block | null>(null)

  // Define o bloco atual quando os dados principais carregam
  useEffect(() => {
    if (mainBlocks && mainBlocks.length > 0) {
      const latestHeight = mainBlocks[0].height
      if (currentBlockHeight === null) {
        setCurrentBlockHeight(latestHeight)
        setIsAutoMode(true)
      } else if (isAutoMode) {
        if (latestHeight > currentBlockHeight) {
          // Quando um novo bloco é detectado, salva o bloco anterior no cache
          if (previousBlockRef.current) {
            setOldBlocksCache(prev => {
              const newCache = new Map(prev)
              // Adiciona o bloco anterior ao cache
              newCache.set(previousBlockRef.current!.height, previousBlockRef.current!)
              
              // Remove blocos antigos demais para manter apenas MAX_OLD_CARDS
              if (newCache.size > MAX_OLD_CARDS) {
                const heights = Array.from(newCache.keys()).sort((a, b) => b - a)
                const toRemove = heights.slice(MAX_OLD_CARDS)
                toRemove.forEach(height => newCache.delete(height))
              }
              
              return newCache
            })
          }
          setCurrentBlockHeight(latestHeight)
        }
      }
    }
  }, [mainBlocks, currentBlockHeight, isAutoMode])

  // Busca o bloco atual
  const { data: currentBlock, isLoading: isLoadingCurrent, error: currentError, refetch: refetchCurrent } = useBlockByHeight(
    currentBlockHeight
  )

  // Mantém referência do bloco atual para usar quando um novo aparecer
  useEffect(() => {
    if (currentBlock) {
      previousBlockRef.current = currentBlock
    }
  }, [currentBlock])

  // Converte o cache para array ordenado (mais recente primeiro)
  const oldBlocksArray = useMemo(() => {
    return Array.from(oldBlocksCache.values())
      .sort((a, b) => b.height - a.height)
      .slice(0, MAX_OLD_CARDS)
  }, [oldBlocksCache])

  if (currentError) {
    return (
      <div className="space-y-6">
        <ErrorDisplay 
          message="Error loading current block. Check your connection and try again."
          onRetry={() => refetchCurrent()}
        />
      </div>
    )
  }

  if (isLoadingMain || (isLoadingCurrent && currentBlockHeight !== null)) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current block skeleton */}
          <div className="lg:col-span-1">
            <BlockCardSkeleton />
          </div>
          {/* Old blocks skeleton */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <BlockCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentBlock && currentBlockHeight !== null) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-gray-400">Block #{currentBlockHeight} not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Block - Left Side */}
        <div className="lg:col-span-1">
          {currentBlock && (
            <MemoizedBlockCard
              block={currentBlock}
              isCurrent={true}
              openInNewTab={true}
            />
          )}
        </div>

        {/* Old Blocks - Right Side */}
        <div className="lg:col-span-2">
          {oldBlocksArray.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {oldBlocksArray.map((block, index) => (
                <MemoizedOldBlockCard 
                  key={block.height} 
                  block={block}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="bg-arc-gray border border-arc-gray-light rounded-lg p-8 text-center">
              <p className="text-gray-400">No previous blocks to display</p>
              <p className="text-sm text-gray-500 mt-2">Previous blocks will appear here as new blocks are mined</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Componente memoizado para o card atual
const MemoizedBlockCard = React.memo(function MemoizedBlockCard({ 
  block, 
  isCurrent, 
  openInNewTab 
}: { 
  block: Block
  isCurrent: boolean
  openInNewTab: boolean 
}) {
  return (
    <div className="animate-fadeIn">
      <BlockCard
        block={block}
        isCurrent={isCurrent}
        openInNewTab={openInNewTab}
      />
    </div>
  )
}, (prevProps, nextProps) => {
  // Só re-renderiza se o bloco realmente mudou (altura ou hash diferente)
  return prevProps.block.height === nextProps.block.height &&
         prevProps.block.hash === nextProps.block.hash
})

// Componente memoizado para cards antigos - NÃO re-renderiza quando novos blocos aparecem
const MemoizedOldBlockCard = React.memo(function MemoizedOldBlockCard({ 
  block, 
  index 
}: { 
  block: Block
  index: number 
}) {
  return (
    <div
      className="animate-fadeIn"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <BlockCard
        block={block}
        isCurrent={false}
        openInNewTab={true}
      />
    </div>
  )
}, (prevProps, nextProps) => {
  // Comparação customizada: só re-renderiza se o bloco realmente mudou
  // Como os blocos antigos não mudam, isso sempre retorna true (não re-renderiza)
  return prevProps.block.height === nextProps.block.height &&
         prevProps.block.hash === nextProps.block.hash
})
