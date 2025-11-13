import { useQuery } from '@tanstack/react-query'
import { getMainPageBlocks, getBlockByHeight } from '../services/api'
import type { Block } from '../types/block'

/**
 * Hook para buscar os blocos mais recentes
 */
export function useMainPageBlocks() {
  return useQuery<Block[]>({
    queryKey: ['main-page-blocks'],
    queryFn: getMainPageBlocks,
    refetchInterval: 800, // Intervalo rápido compatível com rede Arc
    staleTime: 500, // Cache curto para manter dados atualizados
    retry: 2,
    retryDelay: 1000,
  })
}

/**
 * Hook para buscar um bloco específico por altura
 */
export function useBlockByHeight(height: number | null) {
  return useQuery<Block>({
    queryKey: ['block', height],
    queryFn: () => getBlockByHeight(height!),
    enabled: height !== null,
  })
}

/**
 * Hook para buscar múltiplos blocos por altura
 * Otimizado para buscar em paralelo com limite de requisições simultâneas
 * Limita a 15 blocos para melhor desempenho
 */
export function useBlocksByHeights(heights: number[]) {
  // Limita a apenas 15 blocos mais recentes para otimizar desempenho
  const limitedHeights = heights.slice(0, 15)
  
  return useQuery<Block[]>({
    queryKey: ['blocks', limitedHeights.sort((a, b) => b - a).join(',')],
    queryFn: async () => {
      // Limita requisições simultâneas para evitar sobrecarga
      const batchSize = 10
      const results: Block[] = []
      
      for (let i = 0; i < limitedHeights.length; i += batchSize) {
        const batch = limitedHeights.slice(i, i + batchSize)
        const promises = batch.map(height => getBlockByHeight(height))
        const batchResults = await Promise.all(promises)
        results.push(...batchResults)
      }
      
      return results
    },
    enabled: limitedHeights.length > 0,
    retry: 2,
    retryDelay: 1000,
    staleTime: 500, // Cache reduzido para manter dados atualizados
    gcTime: 30000, // Remove da memória após 30 segundos (anteriormente cacheTime)
  })
}

