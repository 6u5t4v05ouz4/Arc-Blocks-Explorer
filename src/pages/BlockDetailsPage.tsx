import { useParams } from 'react-router-dom'
import { useBlockDetails } from '../hooks/useBlockDetails'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorDisplay from '../components/ErrorDisplay'
import { formatTimestamp, formatNumber, formatGasPercentage, weiToEth, formatEth } from '../utils/formatters'

export default function BlockDetailsPage() {
  const { height } = useParams<{ height: string }>()
  const blockHeight = height ? parseInt(height, 10) : null
  const { data: block, isLoading, error, refetch } = useBlockDetails(blockHeight || 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-arc-dark text-white flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !block) {
    return (
      <div className="min-h-screen bg-arc-dark text-white flex items-center justify-center">
        <ErrorDisplay 
          message="Error loading block details. The block may not exist." 
          onRetry={() => refetch()} 
        />
      </div>
    )
  }

  const gasUsageColor = block.gas_used_percentage > 80 
    ? 'text-red-400' 
    : block.gas_used_percentage > 50 
    ? 'text-yellow-400' 
    : 'text-green-400'

  return (
    <div className="min-h-screen bg-arc-dark text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <a 
            href="/" 
            className="text-arc-primary hover:text-arc-primary/80 transition-colors"
          >
            ← Back to Explorer
          </a>
        </div>

        <div className="bg-arc-gray border border-arc-gray-light rounded-lg p-8">
          <h1 className="text-4xl font-bold text-white mb-8">
            Block #{block.height}
          </h1>

          {/* Basic Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Basic Information</h2>
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
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Miner</h2>
            <div className="bg-arc-gray-light p-4 rounded-lg">
              <div className="text-gray-400 text-sm mb-1">Address</div>
              <div className="text-white font-mono text-sm break-all">{block.miner.hash}</div>
            </div>
          </section>

          {/* Gas Statistics */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Gas Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-arc-gray-light p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Gas Used</div>
                <div className="text-white font-semibold">{formatNumber(block.gas_used)}</div>
                <div className={`text-xs mt-1 ${gasUsageColor}`}>
                  {formatGasPercentage(block.gas_used_percentage)}
                </div>
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
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Fees</h2>
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
            <a
              href={`/block/${block.height - 1}`}
              className="px-4 py-2 bg-arc-gray-light hover:bg-arc-gray text-white rounded-lg transition-colors"
            >
              ← Previous Block
            </a>
            <a
              href={`/block/${block.height + 1}`}
              className="px-4 py-2 bg-arc-gray-light hover:bg-arc-gray text-white rounded-lg transition-colors"
            >
              Next Block →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

