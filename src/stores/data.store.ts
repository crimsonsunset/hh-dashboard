import { create } from 'zustand'
import type { LLMResponse } from '@app-types/llm-response.types'

/**
 * Dataset type - tracks which data source is currently active
 * 'short' and 'long' are mock datasets, 'custom' is user-uploaded
 */
type Dataset = 'short' | 'long' | 'custom' | null

/**
 * Data store interface for managing loaded LLM dataset state
 */
interface DataStore {
  /** Currently active dataset (null means no data loaded) */
  activeDataset: Dataset
  /** Loaded LLM response data (used for custom uploads) */
  data: LLMResponse[] | null
  /** Set the active dataset (triggers React Query to fetch for mock data) */
  setActiveDataset: (dataset: Dataset) => void
  /** Clear the active dataset (returns to "No Data" state) */
  clearDataset: () => void
  /** Set custom data (for file uploads) */
  setData: (data: LLMResponse[]) => void
}

/**
 * Zustand store for tracking which dataset is currently loaded.
 * Works in conjunction with React Query for data fetching:
 * - This store tracks UI state (which dataset is selected)
 * - React Query handles data fetching, caching, and loading states for mock data
 * - Custom uploaded data is stored directly in this store
 */
export const useDataStore = create<DataStore>((set) => ({
  activeDataset: null,
  data: null,
  setActiveDataset: (dataset) => set({ activeDataset: dataset }),
  clearDataset: () => set({ activeDataset: null, data: null }),
  setData: (data) => set({ data }),
}))

