export interface Miner {
  ens_domain_name: string | null
  hash: string
  implementations: unknown[]
  is_contract: boolean
  is_scam: boolean
  is_verified: boolean
  metadata: unknown | null
  name: string | null
  private_tags: unknown[]
  proxy_type: string | null
  public_tags: unknown[]
  reputation: string
  watchlist_names: unknown[]
}

export interface Block {
  base_fee_per_gas: string
  burnt_fees: string
  burnt_fees_percentage: number
  difficulty: string
  gas_limit: string
  gas_target_percentage: number
  gas_used: string
  gas_used_percentage: number
  hash: string
  height: number
  internal_transactions_count: number | null
  is_pending_update: boolean
  miner: Miner
  nonce: string
  parent_hash: string
  priority_fee: string
  rewards: unknown[]
  size: number
  timestamp: string
  total_difficulty: string | null
  transaction_fees: string
  transactions_count: number
  type: string
  uncles_hashes: unknown[]
  withdrawals_count: number | null
}

export interface BlocksResponse {
  items: Block[]
  next_page_params?: {
    block_number: number
    items_count: number
  }
}

