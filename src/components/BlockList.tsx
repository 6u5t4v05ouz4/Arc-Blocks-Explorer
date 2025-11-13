import { useState, useEffect } from 'react'
import { useMainPageBlocks, useBlockByHeight } from '../hooks/useBlocks'
import BlockCard from './BlockCard'
import ErrorDisplay from './ErrorDisplay'
import BlockCardSkeleton from './BlockCardSkeleton'
import type { Block } from '../types/block'
import { getBlockByHeight } from '../services/api'

const MAX_OLD_CARDS = 8

// GLOBAL STATE FOR STATIC CARDS - FORA DO CICLO DE RE-RENDER
let globalStaticCards: { block: Block; id: string }[] = []
let globalCardIdCounter = 0
let globalLastProcessedHeight: number | null = null

// Event emitter para notificar quando há novos cards estáticos
const staticCardEmitter = {
  listeners: new Set<() => void>(),
  subscribe(callback: () => void): () => void {
    this.listeners.add(callback)
    return () => {
      this.listeners.delete(callback)
    }
  },
  emit() {
    this.listeners.forEach(callback => callback())
  }
}

// Componente que só renderiza cards estáticos - FORA DO CICLO DO REACT QUERY
function StaticCardsManager() {
  const [staticCards, setStaticCards] = useState<{ block: Block; id: string }[]>(globalStaticCards)

  // Escuta por mudanças nos cards estáticos
  useEffect(() => {
    const unsubscribe = staticCardEmitter.subscribe(() => {
      setStaticCards([...globalStaticCards])
    })
    return unsubscribe
  }, [])

  if (staticCards.length === 0) {
    return (
      <div className="bg-arc-gray border border-arc-gray-light rounded-lg p-8 text-center">
        <p className="text-gray-400">No previous blocks to display</p>
        <p className="text-sm text-gray-500 mt-2">Previous blocks will appear here as new blocks are mined</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {staticCards.map(({ block, id }) => (
        <CompletelyStaticCard key={id} initialBlock={block} />
      ))}
    </div>
  )
}

// Componente 100% estático - NUNCA muda após a primeira renderização
function CompletelyStaticCard({ initialBlock }: { initialBlock: Block }) {
  // Estado inicial que JAMAIS muda
  const [staticBlock] = useState(initialBlock)

  return (
    <BlockCard
      block={staticBlock}
      isCurrent={false}
      openInNewTab={true}
    />
  )
}

// Componente APENAS para o card atual - único que participa do ciclo
function CurrentBlockCard() {
  const { data: mainBlocks } = useMainPageBlocks()
  const [currentBlockHeight, setCurrentBlockHeight] = useState<number | null>(null)
  const [isAutoMode, setIsAutoMode] = useState(true)

  // Apenas este componente usa os hooks do React Query
  const { data: currentBlock, isLoading, error, refetch } = useBlockByHeight(currentBlockHeight)

  // Define o bloco atual
  useEffect(() => {
    if (mainBlocks && mainBlocks.length > 0) {
      const latestHeight = mainBlocks[0].height
      if (currentBlockHeight === null) {
        setCurrentBlockHeight(latestHeight)
        setIsAutoMode(true)
        globalLastProcessedHeight = latestHeight
      } else if (isAutoMode && latestHeight > currentBlockHeight) {
        setCurrentBlockHeight(latestHeight)
      }
    }
  }, [mainBlocks, currentBlockHeight, isAutoMode])

  // Quando o bloco atual muda, atualiza o estado GLOBAL de cards estáticos
  useEffect(() => {
    if (currentBlock && globalLastProcessedHeight !== null) {
      const currentHeight = currentBlock.height

      if (currentHeight > globalLastProcessedHeight) {
        const previousHeight = currentHeight - 1

        getBlockByHeight(previousHeight)
          .then(previousBlock => {
            // Atualiza o estado GLOBAL - fora do ciclo React
            const newCard = {
              block: previousBlock,
              id: `static-${globalCardIdCounter++}`
            }
            globalStaticCards = [newCard, ...globalStaticCards].slice(0, MAX_OLD_CARDS)
            globalLastProcessedHeight = currentHeight

            // Notifica todos os componentes estáticos
            staticCardEmitter.emit()
          })
          .catch(err => {
            console.log('Failed to fetch previous block:', err)
            globalLastProcessedHeight = currentHeight
          })
      }
    }
  }, [currentBlock])

  if (error) {
    return (
      <div className="space-y-6">
        <ErrorDisplay
          message="Error loading current block. Check your connection and try again."
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  if (isLoading || !currentBlock) {
    return <BlockCardSkeleton />
  }

  return (
    <div>
      <BlockCard
        block={currentBlock}
        isCurrent={true}
        openInNewTab={true}
      />
    </div>
  )
}

export default function BlockList() {
  // Componente principal não faz nada - apenas estrutura
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CurrentBlockCard />
        </div>

        <div className="lg:col-span-2">
          <StaticCardsManager />
        </div>
      </div>
    </div>
  )
}