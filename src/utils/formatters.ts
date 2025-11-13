/**
 * Converte Wei para ETH
 */
export function weiToEth(wei: string): string {
  const weiBigInt = BigInt(wei)
  const ethBigInt = weiBigInt / BigInt(10 ** 18)
  const remainder = weiBigInt % BigInt(10 ** 18)
  
  if (remainder === BigInt(0)) {
    return ethBigInt.toString()
  }
  
  const remainderStr = remainder.toString().padStart(18, '0')
  const trimmed = remainderStr.replace(/0+$/, '')
  
  if (trimmed === '') {
    return ethBigInt.toString()
  }
  
  return `${ethBigInt}.${trimmed}`
}

/**
 * Formata um valor em ETH com casas decimais
 */
export function formatEth(value: string, decimals: number = 6): string {
  const num = parseFloat(value)
  if (isNaN(num)) return '0'
  
  return num.toFixed(decimals)
}

/**
 * Formata um hash truncando no meio
 */
export function truncateHash(hash: string, start: number = 6, end: number = 4): string {
  if (hash.length <= start + end) return hash
  return `${hash.slice(0, start)}...${hash.slice(-end)}`
}

/**
 * Formata um endereço truncando no meio
 */
export function truncateAddress(address: string): string {
  return truncateHash(address, 6, 4)
}

/**
 * Formata timestamp para formato legível
 */
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  
  if (diffSecs < 60) {
    return `${diffSecs}s ago`
  } else if (diffMins < 60) {
    return `${diffMins}min ago`
  } else if (diffHours < 24) {
    return `${diffHours}h ago`
  } else {
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
}

/**
 * Formata número com separadores de milhar
 */
export function formatNumber(num: number | string): string {
  return Number(num).toLocaleString('en-US')
}

/**
 * Formata gas usado como porcentagem
 */
export function formatGasPercentage(percentage: number): string {
  return `${Math.abs(percentage).toFixed(2)}%`
}

