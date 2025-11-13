import { useState, useEffect, useMemo, useRef } from 'react'
import { useMainPageBlocks, useBlockByHeight } from '../hooks/useBlocks'
import { BLOCKS_TO_SHOW } from '../utils/constants'
import type { Block } from '../types/block'
import BlockRow from './BlockRow'
import { useBlockContext } from '../contexts/BlockContext'

export default function TerminalView() {
  const { data: mainBlocks, isLoading: isLoadingMain } = useMainPageBlocks()
  const { currentBlockHeight, setCurrentBlockHeight, isAutoMode, setIsAutoMode } = useBlockContext()
  const [blocksList, setBlocksList] = useState<Block[]>([]) // Lista persistente de blocos
  const lastProcessedHeight = useRef<number | null>(null) // Rastreia o último bloco processado

  // Define o bloco atual quando os dados principais carregam
  useEffect(() => {
    if (mainBlocks && mainBlocks.length > 0) {
      if (currentBlockHeight === null) {
        setCurrentBlockHeight(mainBlocks[0].height)
        setIsAutoMode(true)
      } else if (isAutoMode) {
        const latestHeight = mainBlocks[0].height
        if (latestHeight > currentBlockHeight) {
          setCurrentBlockHeight(latestHeight)
        }
      }
    }
  }, [mainBlocks, currentBlockHeight, isAutoMode])

  // Detecta novos blocos e adiciona apenas eles, mantendo os antigos intactos
  useEffect(() => {
    if (mainBlocks && mainBlocks.length > 0 && isAutoMode) {
      const latestBlock = mainBlocks[0]
      const latestHeight = latestBlock.height

      // Se é um bloco novo (maior que o último processado)
      if (lastProcessedHeight.current === null || latestHeight > lastProcessedHeight.current) {
        // Adiciona o novo bloco no topo da lista
        setBlocksList(prevBlocks => {
          // Verifica se o bloco já existe (evita duplicatas)
          const exists = prevBlocks.some(b => b.height === latestHeight)
          if (exists) {
            return prevBlocks
          }
          
          // Adiciona o novo bloco no topo e mantém apenas os 15 mais recentes
          const newBlocks = [latestBlock, ...prevBlocks]
            .sort((a, b) => b.height - a.height)
            .slice(0, 15)
          
          return newBlocks
        })
        
        lastProcessedHeight.current = latestHeight
      }
    }
  }, [mainBlocks, isAutoMode])

  // Em modo manual, busca blocos ao redor do selecionado
  const blockHeights: number[] = []
  if (currentBlockHeight !== null && !isAutoMode) {
    for (let i = BLOCKS_TO_SHOW.BEFORE; i > 0; i--) {
      const height = currentBlockHeight - i
      if (height > 0) {
        blockHeights.push(height)
      }
    }
    blockHeights.push(currentBlockHeight)
    for (let i = 1; i <= BLOCKS_TO_SHOW.AFTER; i++) {
      blockHeights.push(currentBlockHeight + i)
    }
  }

  // Em modo automático, usa a lista persistente de blocos
  // Em modo manual, busca os blocos necessários
  const sortedBlocks = useMemo(() => {
    if (isAutoMode) {
      // Modo automático: usa a lista persistente (apenas novos blocos são adicionados)
      return blocksList.sort((a, b) => b.height - a.height)
    } else {
      // Modo manual: retorna lista vazia (será preenchida pelo hook abaixo)
      return []
    }
  }, [blocksList, isAutoMode])

  // Para modo manual, busca os blocos necessários
  const manualBlocksQuery = useBlockByHeight(!isAutoMode && currentBlockHeight ? currentBlockHeight : null)

  const handleSearch = (height: number) => {
    setCurrentBlockHeight(height)
    setIsAutoMode(false)
  }

  // Mostra loading apenas na primeira carga
  if (isLoadingMain && blocksList.length === 0) {
    return (
      <div className="bg-arc-gray border border-arc-gray-light rounded-lg p-4 font-mono text-sm">
        <div className="text-green-400">Carregando blocos...</div>
      </div>
    )
  }

  // Se não há blocos para mostrar
  if (sortedBlocks.length === 0 && !isAutoMode && !manualBlocksQuery.data) {
    return (
      <div className="bg-arc-gray border border-arc-gray-light rounded-lg p-4 font-mono text-sm">
        <div className="text-red-400">Nenhum bloco encontrado</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">

      {/* Lista de blocos em formato terminal */}
      <div className="bg-arc-gray border border-arc-gray-light rounded-lg overflow-hidden">
        <div className="font-mono text-xs">
          {/* Header */}
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

          {/* Blocos em cascata - mais recente no topo */}
          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            {sortedBlocks.map((block) => {
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
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

