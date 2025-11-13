import React, { useState, useEffect, useRef } from 'react'
import { useMainPageBlocks, useBlockByHeight } from '../hooks/useBlocks'
import BlockCard from './BlockCard'
import ErrorDisplay from './ErrorDisplay'
import BlockCardSkeleton from './BlockCardSkeleton'
import type { Block } from '../types/block'

const MAX_OLD_CARDS = 8

// Componente que renderiza um card antigo - completamente isolado
function OldBlockWrapper({ block }: { block: Block }) {
  // Captura o bloco na primeira renderização e nunca mais muda
  const stableBlock = useRef(block).current

  return (
    <BlockCard
      block={stableBlock}
      isCurrent={false}
      openInNewTab={true}
    />
  )
}

// Memoiza com comparação que sempre retorna true para blocos antigos
const MemoizedOldBlockCard = React.memo(OldBlockWrapper, (prev, next) => {
  // Se é o mesmo height, nunca re-renderiza
  return prev.block.height === next.block.height
})

// Componente para card atual com memoização otimizada
function CurrentBlockCardWrapper({ block }: { block: Block }) {
  return (
    <BlockCard
      block={block}
      isCurrent={true}
      openInNewTab={true}
    />
  )
}

// Memoização para card atual - só re-renderiza se height ou hash mudar
const MemoizedBlockCard = React.memo(CurrentBlockCardWrapper, (prevProps, nextProps) => {
  return prevProps.block.height === nextProps.block.height &&
         prevProps.block.hash === nextProps.block.hash
})

export default function BlockList() {
  const { data: mainBlocks, isLoading: isLoadingMain } = useMainPageBlocks()
  const [currentBlockHeight, setCurrentBlockHeight] = useState<number | null>(null)
  const [isAutoMode, setIsAutoMode] = useState(true)

  // Ref para manter os blocos antigos - nunca muda de referência do array
  const oldBlocksRef = useRef<Map<number, Block>>(new Map())
  const lastProcessedHeight = useRef<number | null>(null)

  // Define o bloco atual
  useEffect(() => {
    if (mainBlocks && mainBlocks.length > 0) {
      const latestHeight = mainBlocks[0].height
      if (currentBlockHeight === null) {
        setCurrentBlockHeight(latestHeight)
        setIsAutoMode(true)
        lastProcessedHeight.current = latestHeight
      } else if (isAutoMode && latestHeight > currentBlockHeight) {
        setCurrentBlockHeight(latestHeight)
      }
    }
  }, [mainBlocks, currentBlockHeight, isAutoMode])

  // Adiciona blocos antigos incrementalmente
  useEffect(() => {
    if (mainBlocks && mainBlocks.length > 0 && isAutoMode) {
      const latestHeight = mainBlocks[0].height

      if (lastProcessedHeight.current === null || latestHeight > lastProcessedHeight.current) {
        const previousBlock = mainBlocks[0]

        // Verifica se já existe no cache
        if (!oldBlocksRef.current.has(previousBlock.height)) {
          // Cria novo Map com o novo bloco
          const newMap = new Map(oldBlocksRef.current)
          newMap.set(previousBlock.height, previousBlock)

          // Mantém apenas os MAX_OLD_CARDS mais recentes
          if (newMap.size > MAX_OLD_CARDS) {
            const sortedBlocks = Array.from(newMap.entries())
              .sort(([,a], [,b]) => b.height - a.height)
              .slice(0, MAX_OLD_CARDS)

            oldBlocksRef.current = new Map(sortedBlocks.map(([key, block]) => [key, block]))
          } else {
            oldBlocksRef.current = newMap
          }
        }

        lastProcessedHeight.current = latestHeight
      }
    }
  }, [mainBlocks, isAutoMode])

  // Busca o bloco atual
  const { data: currentBlock, isLoading: isLoadingCurrent, error: currentError, refetch: refetchCurrent } = useBlockByHeight(
    currentBlockHeight
  )

  // Converte o Map para array para renderização (mas mantém referências estáticas)
  const oldBlocks = Array.from(oldBlocksRef.current.values())
    .sort((a, b) => b.height - a.height)

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
          <div className="lg:col-span-1">
            <BlockCardSkeleton />
          </div>
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
        <div className="lg:col-span-1">
          {currentBlock && (
            <MemoizedBlockCard
              block={currentBlock}
            />
          )}
        </div>

        <div className="lg:col-span-2">
          {oldBlocks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {oldBlocks.map((block) => (
                <MemoizedOldBlockCard
                  key={block.height}
                  block={block}
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