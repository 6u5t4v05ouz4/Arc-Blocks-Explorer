import { memo } from 'react'
import type { Block } from '../types/block'
import { truncateHash, formatTimestamp, formatNumber, formatGasPercentage, weiToEth, formatEth } from '../utils/formatters'

interface BlockRowProps {
  block: Block
  isCurrent: boolean
  isNewest: boolean
  onClick: () => void
}

const BlockRow = memo(function BlockRow({ block, isCurrent, isNewest, onClick }: BlockRowProps) {
  const gasColor = block.gas_used_percentage > 80 
    ? 'text-red-400' 
    : block.gas_used_percentage > 50 
    ? 'text-yellow-400' 
    : 'text-green-400'

  return (
    <div
      className={`
        px-4 py-2 grid grid-cols-12 gap-2 border-b border-arc-gray-light/50
        hover:bg-arc-gray-light/50 transition-colors cursor-pointer
        ${isCurrent ? 'bg-arc-primary/10 border-l-2 border-l-arc-primary' : ''}
        ${isNewest ? 'bg-green-500/5 animate-fadeIn' : ''}
      `}
      onClick={onClick}
    >
      <div className={`col-span-1 ${isCurrent ? 'text-arc-primary font-bold' : isNewest ? 'text-green-400 font-bold' : 'text-white'}`}>
        #{block.height}
        {isNewest && <span className="ml-1 text-green-400 text-xs">●</span>}
      </div>
      <div className="col-span-2 text-gray-300 truncate" title={block.hash}>
        {truncateHash(block.hash, 8, 4)}
      </div>
      <div className="col-span-2 text-gray-400 truncate" title={block.miner.hash}>
        {truncateHash(block.miner.hash, 6, 4)}
      </div>
      <div className="col-span-1 text-white">
        {formatNumber(block.transactions_count)}
      </div>
      <div className={`col-span-1 ${gasColor}`}>
        {formatGasPercentage(block.gas_used_percentage)}
      </div>
      <div className="col-span-1 text-gray-300">
        {formatNumber(block.size)}
      </div>
      <div className="col-span-1 text-white">
        {formatEth(weiToEth(block.transaction_fees), 4)}
      </div>
      <div className="col-span-1 text-orange-400">
        {block.burnt_fees_percentage.toFixed(1)}%
      </div>
      <div className="col-span-2 text-gray-400">
        {formatTimestamp(block.timestamp)}
      </div>
    </div>
  )
})

export default BlockRow

