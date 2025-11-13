import { useQuery } from '@tanstack/react-query'
import { getBlockByHeight } from '../services/api'
import type { Block } from '../types/block'

/**
 * Hook para buscar detalhes completos de um bloco
 */
export function useBlockDetails(height: number | null) {
  return useQuery<Block>({
    queryKey: ['block-details', height],
    queryFn: () => getBlockByHeight(height!),
    enabled: height !== null,
    retry: 2,
    retryDelay: 1000,
  })
}

