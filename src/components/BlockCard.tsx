import { memo } from 'react'
import type { Block } from '../types/block'
import { truncateHash, formatTimestamp, formatNumber, formatGasPercentage, weiToEth, formatEth } from '../utils/formatters'

interface BlockCardProps {
  block: Block
  isCurrent?: boolean
  onClick?: () => void
  openInNewTab?: boolean
}

function BlockCard({ block, isCurrent = false, onClick, openInNewTab = false }: BlockCardProps) {
  // Validação de segurança - se o bloco não tem dados essenciais, não renderiza
  if (!block || !block.height || !block.hash) {
    return null
  }

  const gasUsageColor = (block.gas_used_percentage ?? 0) > 80 
    ? 'text-red-400' 
    : (block.gas_used_percentage ?? 0) > 50 
    ? 'text-yellow-400' 
    : 'text-green-400'

  const handleClick = () => {
    if (openInNewTab) {
      window.open(`/block/${block.height}`, '_blank')
    } else if (onClick) {
      onClick()
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`
        bg-arc-gray border rounded-lg p-4 cursor-pointer
        hover:border-arc-primary hover:shadow-lg hover:shadow-arc-primary/20
        ${isCurrent ? 'border-arc-primary shadow-lg shadow-arc-primary/30 ring-2 ring-arc-primary/50' : 'border-arc-gray-light'}
      `}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-arc-primary font-bold text-lg">#{block.height}</span>
            {isCurrent && (
              <span className="bg-arc-primary text-white text-xs px-2 py-0.5 rounded">Current</span>
            )}
          </div>
          <div className="text-gray-400 text-xs font-mono">
            {block.hash ? truncateHash(block.hash) : 'N/A'}
          </div>
        </div>
        <div className="text-gray-500 text-xs text-right">
          {formatTimestamp(block.timestamp)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-gray-400 text-xs mb-1">Miner</div>
          <div className="text-white font-mono text-xs truncate">
            {block.miner?.hash ? truncateHash(block.miner.hash) : 'N/A'}
          </div>
        </div>
        
        <div>
          <div className="text-gray-400 text-xs mb-1">Transactions</div>
          <div className="text-white font-semibold">
            {formatNumber(block.transactions_count)}
          </div>
        </div>
        
        <div>
          <div className="text-gray-400 text-xs mb-1">Gas Used</div>
          <div className={`font-semibold ${gasUsageColor}`}>
            {formatGasPercentage(block.gas_used_percentage ?? 0)}
          </div>
        </div>
        
        <div>
          <div className="text-gray-400 text-xs mb-1">Fees</div>
          <div className="text-white font-semibold text-xs">
            {block.transaction_fees ? formatEth(weiToEth(block.transaction_fees)) : '0'} ETH
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-arc-gray-light">
        <div className="flex justify-between items-center text-xs">
          <div className="text-gray-400">
            Size: <span className="text-white">{block.size ? formatNumber(block.size) : '0'} bytes</span>
          </div>
          <div className="text-gray-400">
            Burnt Fees: <span className="text-orange-400">{(block.burnt_fees_percentage ?? 0).toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(BlockCard)

