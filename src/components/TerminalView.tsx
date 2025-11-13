import { useState, useEffect, useMemo } from 'react'
import { useMainPageBlocks, useBlockByHeight } from '../hooks/useBlocks'
import type { Block } from '../types/block'
import BlockRow from './BlockRow'
import { useBlockContext } from '../contexts/BlockContext'

export default function TerminalView() {
  const { data: mainBlocks, isLoading: isLoadingMain, error: mainBlocksError } = useMainPageBlocks()
  const { currentBlockHeight, setCurrentBlockHeight, isAutoMode, setIsAutoMode } = useBlockContext()
  const [blocksList, setBlocksList] = useState<Block[]>([])
  const [error, setError] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  // Hook para buscar blocos individuais
  const manualBlocksQuery = useBlockByHeight(!isAutoMode && currentBlockHeight ? currentBlockHeight : null)

  // ÚNICO useEffect simplificado
  useEffect(() => {
    try {
      if (mainBlocksError) {
        console.error('Erro nos blocos principais:', mainBlocksError)
        setError('Failed to load blocks')
        return
      }

      if (!mainBlocks || !Array.isArray(mainBlocks) || mainBlocks.length === 0) {
        if (!isLoadingMain) {
          setError('No blocks available')
        }
        return
      }

      const latestBlock = mainBlocks[0]

      // Validação básica
      if (!latestBlock || typeof latestBlock.height !== 'number' || latestBlock.height <= 0) {
        console.error('Dados do bloco inválidos:', latestBlock)
        setError('Invalid block data')
        return
      }

      // Primeira inicialização
      if (!initialized) {
        setCurrentBlockHeight(latestBlock.height)
        setIsAutoMode(true)
        setInitialized(true)
        return
      }

      // Modo automático - adiciona novos blocos à lista
      if (isAutoMode && latestBlock.height > currentBlockHeight!) {
        setBlocksList(prev => {
          const exists = prev.some(b => b.height === latestBlock.height)
          if (!exists) {
            // Adiciona no início e mantém apenas os 15 mais recentes
            return [latestBlock, ...prev].slice(0, 15)
          }
          return prev
        })
        setCurrentBlockHeight(latestBlock.height)
      }
    } catch (err) {
      console.error('Erro no useEffect:', err)
      setError('Processing error')
    }
  }, [mainBlocks, currentBlockHeight, isAutoMode, initialized, mainBlocksError])

  // Cleanup de erros
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [error])

  // Blocos ordenados
  const sortedBlocks = useMemo(() => {
    try {
      if (isAutoMode) {
        return blocksList.sort((a, b) => b.height - a.height)
      }
      return []
    } catch (err) {
      console.error('Erro ao ordenar blocos:', err)
      return []
    }
  }, [blocksList, isAutoMode])

  // Tratamento de erros
  if (mainBlocksError) {
    return (
      <div className="bg-arc-gray border border-arc-gray-light rounded-lg p-4 font-mono text-sm">
        <div className="text-red-400 mb-2">Error loading blocks</div>
        <button
          onClick={() => window.location.reload()}
          className="text-arc-primary hover:underline text-sm"
        >
          Refresh page
        </button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-arc-gray border border-arc-gray-light rounded-lg p-4 font-mono text-sm">
        <div className="text-red-400 mb-2">{error}</div>
        <div className="text-gray-400 text-xs">The system will try to recover automatically...</div>
      </div>
    )
  }

  // Loading states
  if (isLoadingMain || (!initialized && !currentBlockHeight)) {
    return (
      <div className="bg-arc-gray border border-arc-gray-light rounded-lg p-4 font-mono text-sm">
        <div className="text-green-400">Loading blocks...</div>
      </div>
    )
  }

  // Modo manual - mostra bloco específico ou erro
  if (!isAutoMode) {
    if (manualBlocksQuery.error) {
      return (
        <div className="bg-arc-gray border border-arc-gray-light rounded-lg p-4 font-mono text-sm">
          <div className="text-red-400">Error loading block #{currentBlockHeight}</div>
        </div>
      )
    }

    if (!manualBlocksQuery.data) {
      return (
        <div className="bg-arc-gray border border-arc-gray-light rounded-lg p-4 font-mono text-sm">
          <div className="text-yellow-400">Loading block #{currentBlockHeight}...</div>
        </div>
      )
    }

    // Modo manual - mostra apenas o bloco específico
    return (
      <div className="space-y-4">
        <div className="bg-arc-gray border border-arc-gray-light rounded-lg overflow-hidden">
          <div className="font-mono text-xs">
            <div className="bg-arc-gray-light border-b border-arc-gray-light px-4 py-2 grid grid-cols-12 gap-2 text-gray-400 font-semibold">
              <div className="col-span-1">Height</div>
              <div className="col-span-2">Hash</div>
              <div className="col-span-2">Miner</div>
              <div className="col-span-1">Txs</div>
              <div className="col-span-1">Gas</div>
              <div className="col-span-1">Size</div>
              <div className="col-span-1">Fees</div>
              <div className="col-span-1">Burnt</div>
              <div className="col-span-2">Time</div>
            </div>
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
              <BlockRow
                key={manualBlocksQuery.data.height}
                block={manualBlocksQuery.data}
                isCurrent={true}
                isNewest={false}
                onClick={() => {}}
                openInNewTab={true}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Modo automático - mostra lista de blocos
  return (
    <div className="space-y-4">
      <div className="bg-arc-gray border border-arc-gray-light rounded-lg overflow-hidden">
        <div className="font-mono text-xs">
          <div className="bg-arc-gray-light border-b border-arc-gray-light px-4 py-2 grid grid-cols-12 gap-2 text-gray-400 font-semibold">
            <div className="col-span-1">Height</div>
            <div className="col-span-2">Hash</div>
            <div className="col-span-2">Miner</div>
            <div className="col-span-1">Txs</div>
            <div className="col-span-1">Gas</div>
            <div className="col-span-1">Size</div>
            <div className="col-span-1">Fees</div>
            <div className="col-span-1">Burnt</div>
            <div className="col-span-2">Time</div>
          </div>

          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            {sortedBlocks.length > 0 ? (
              sortedBlocks.map((block) => {
                const isCurrent = block.height === currentBlockHeight
                const isNewest = block.height === (mainBlocks?.[0]?.height || 0)

                return (
                  <BlockRow
                    key={block.height}
                    block={block}
                    isCurrent={isCurrent}
                    isNewest={isNewest}
                    onClick={() => {
                      setCurrentBlockHeight(block.height)
                      setIsAutoMode(false)
                    }}
                    openInNewTab={true}
                  />
                )
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No blocks to display</p>
                <p className="text-sm text-gray-500 mt-2">Waiting for new blocks...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}