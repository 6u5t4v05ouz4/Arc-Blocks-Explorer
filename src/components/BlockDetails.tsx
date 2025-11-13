import { useBlockDetails } from '../hooks/useBlockDetails'
import LoadingSpinner from './LoadingSpinner'
import { truncateHash, formatTimestamp, formatNumber, formatGasPercentage, weiToEth, formatEth } from '../utils/formatters'

interface BlockDetailsProps {
  height: number
  onClose: () => void
  onNavigate: (height: number) => void
}

export default function BlockDetails({ height, onClose, onNavigate }: BlockDetailsProps) {
  const { data: block, isLoading } = useBlockDetails(height)

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-arc-gray border border-arc-gray-light rounded-lg p-8 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (!block) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-arc-gray border border-arc-gray-light rounded-lg p-8 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
          <p className="text-red-400">Error loading block details</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-arc-gray border border-arc-gray-light rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-arc-gray border-b border-arc-gray-light p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            Block #{block.height}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-arc-gray-light p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Hash</div>
                <div className="text-white font-mono text-sm break-all">{block.hash}</div>
              </div>
              <div className="bg-arc-gray-light p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Parent Hash</div>
                <div className="text-white font-mono text-sm break-all">{block.parent_hash}</div>
              </div>
              <div className="bg-arc-gray-light p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Timestamp</div>
                <div className="text-white">{formatTimestamp(block.timestamp)}</div>
              </div>
              <div className="bg-arc-gray-light p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Size</div>
                <div className="text-white">{formatNumber(block.size)} bytes</div>
              </div>
              <div className="bg-arc-gray-light p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Nonce</div>
                <div className="text-white font-mono text-sm">{block.nonce}</div>
              </div>
              <div className="bg-arc-gray-light p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Difficulty</div>
                <div className="text-white">{block.difficulty}</div>
              </div>
            </div>
          </section>

          {/* Miner */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4">Miner</h3>
            <div className="bg-arc-gray-light p-4 rounded-lg">
              <div className="text-gray-400 text-sm mb-1">Address</div>
              <div className="text-white font-mono text-sm break-all">{block.miner.hash}</div>
            </div>
          </section>

          {/* Gas Statistics */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4">Gas Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-arc-gray-light p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Gas Used</div>
                <div className="text-white font-semibold">{formatNumber(block.gas_used)}</div>
                <div className="text-gray-500 text-xs mt-1">{formatGasPercentage(block.gas_used_percentage)}</div>
              </div>
              <div className="bg-arc-gray-light p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Gas Limit</div>
                <div className="text-white font-semibold">{formatNumber(block.gas_limit)}</div>
              </div>
              <div className="bg-arc-gray-light p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Gas Target Percentage</div>
                <div className="text-white font-semibold">{formatGasPercentage(block.gas_target_percentage)}</div>
              </div>
              <div className="bg-arc-gray-light p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Base Fee per Gas</div>
                <div className="text-white font-semibold">{formatEth(weiToEth(block.base_fee_per_gas))} ETH</div>
              </div>
            </div>
          </section>

          {/* Fees */}
          <section>
            <h3 className="text-lg font-semibold text-white mb-4">Fees</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-arc-gray-light p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Transaction Fees</div>
                <div className="text-white font-semibold">{formatEth(weiToEth(block.transaction_fees))} ETH</div>
              </div>
              <div className="bg-arc-gray-light p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Priority Fee</div>
                <div className="text-white font-semibold">{formatEth(weiToEth(block.priority_fee))} ETH</div>
              </div>
              <div className="bg-arc-gray-light p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Burnt Fees</div>
                <div className="text-orange-400 font-semibold">{formatEth(weiToEth(block.burnt_fees))} ETH</div>
                <div className="text-gray-500 text-xs mt-1">{block.burnt_fees_percentage.toFixed(2)}%</div>
              </div>
              <div className="bg-arc-gray-light p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Transactions</div>
                <div className="text-white font-semibold">{formatNumber(block.transactions_count)}</div>
              </div>
            </div>
          </section>

          {/* Navigation */}
          <div className="flex gap-2 pt-4 border-t border-arc-gray-light">
            <button
              onClick={() => onNavigate(block.height - 1)}
              className="px-4 py-2 bg-arc-gray-light hover:bg-arc-gray text-white rounded-lg transition-colors"
            >
              ← Previous Block
            </button>
            <button
              onClick={() => onNavigate(block.height + 1)}
              className="px-4 py-2 bg-arc-gray-light hover:bg-arc-gray text-white rounded-lg transition-colors"
            >
              Next Block →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

