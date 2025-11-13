import { memo } from 'react'
import type { Block } from '../types/block'
import { truncateHash, formatTimestamp, formatNumber, formatGasPercentage, weiToEth, formatEth } from '../utils/formatters'

interface BlockCardProps {
  block: Block
  isCurrent?: boolean
  onClick?: () => void
}

function BlockCard({ block, isCurrent = false, onClick }: BlockCardProps) {
  const gasUsageColor = block.gas_used_percentage > 80 
    ? 'text-red-400' 
    : block.gas_used_percentage > 50 
    ? 'text-yellow-400' 
    : 'text-green-400'

  return (
    <div
      onClick={onClick}
      className={`
        bg-arc-gray border rounded-lg p-4 cursor-pointer transition-all duration-300
        hover:border-arc-primary hover:shadow-lg hover:shadow-arc-primary/20 hover:scale-105
        active:scale-100
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
            {truncateHash(block.hash)}
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
            {truncateHash(block.miner.hash)}
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
            {formatGasPercentage(block.gas_used_percentage)}
          </div>
        </div>
        
        <div>
          <div className="text-gray-400 text-xs mb-1">Fees</div>
          <div className="text-white font-semibold text-xs">
            {formatEth(weiToEth(block.transaction_fees))} ETH
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-arc-gray-light">
        <div className="flex justify-between items-center text-xs">
          <div className="text-gray-400">
            Size: <span className="text-white">{formatNumber(block.size)} bytes</span>
          </div>
          <div className="text-gray-400">
            Burnt Fees: <span className="text-orange-400">{block.burnt_fees_percentage.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(BlockCard)

