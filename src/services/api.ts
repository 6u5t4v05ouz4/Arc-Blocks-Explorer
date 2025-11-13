import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'
import type { Block, BlocksResponse } from '../types/block'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'accept': 'application/json',
  },
})

/**
 * Busca os blocos mais recentes da página principal
 */
export async function getMainPageBlocks(): Promise<Block[]> {
  const response = await api.get<Block[]>('/main-page/blocks')
  return response.data
}

/**
 * Busca um bloco específico por altura
 */
export async function getBlockByHeight(height: number): Promise<Block> {
  const response = await api.get<Block>(`/blocks/${height}`)
  return response.data
}

/**
 * Busca blocos paginados
 */
export async function getBlocks(page?: number, itemsCount?: number): Promise<BlocksResponse> {
  const params: Record<string, string> = {}
  if (page) params.page = page.toString()
  if (itemsCount) params.items_count = itemsCount.toString()
  
  const response = await api.get<BlocksResponse>('/blocks', { params })
  return response.data
}

export default api

