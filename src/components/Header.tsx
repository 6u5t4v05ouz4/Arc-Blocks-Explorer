import { useMainPageBlocks } from '../hooks/useBlocks'
import { useRealtimeUpdates } from '../hooks/useRealtimeUpdates'
import { useEffect, useState } from 'react'

export default function Header() {
  const { data: blocks } = useMainPageBlocks()
  const { isFetching, newBlockDetected } = useRealtimeUpdates()
  const [showNewBlockAnimation, setShowNewBlockAnimation] = useState(false)
  
  const latestBlock = blocks?.[0]
  const totalTransactions = blocks?.reduce((sum, block) => sum + block.transactions_count, 0) || 0

  useEffect(() => {
    if (newBlockDetected) {
      setShowNewBlockAnimation(true)
      const timer = setTimeout(() => setShowNewBlockAnimation(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [newBlockDetected])

  return (
    <header className="bg-arc-gray border-b border-arc-gray-light">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Arc Blocks Explorer</h1>
            <p className="text-gray-400 text-sm">Monitoramento em tempo real da rede Arc</p>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm">
            {latestBlock && (
              <div className="bg-arc-gray-light px-4 py-2 rounded-lg">
                <div className="text-gray-400">Último Bloco</div>
                <div className="text-white font-semibold">#{latestBlock.height}</div>
              </div>
            )}
            
            <div className="bg-arc-gray-light px-4 py-2 rounded-lg">
              <div className="text-gray-400">Total de Transações</div>
              <div className="text-white font-semibold">{totalTransactions.toLocaleString('pt-BR')}</div>
            </div>
            
            <div className="bg-arc-gray-light px-4 py-2 rounded-lg flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isFetching ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
              <span className="text-gray-400">
                {isFetching ? 'Atualizando...' : 'Conectado'}
              </span>
            </div>
            
            {showNewBlockAnimation && (
              <div className={`bg-green-500/20 px-4 py-2 rounded-lg transition-all duration-300 ${showNewBlockAnimation ? 'animate-pulse scale-105' : ''}`}>
                <span className="text-green-400 font-semibold">✨ Novo bloco detectado!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

