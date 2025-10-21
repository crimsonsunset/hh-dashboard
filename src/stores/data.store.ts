import { create } from 'zustand'

/**
 * Dataset type - tracks which mock data file is currently active
 */
type Dataset = 'short' | 'long' | null

/**
 * Data store interface for managing loaded LLM dataset state
 */
interface DataStore {
  /** Currently active dataset (null means no data loaded) */
  activeDataset: Dataset
  /** Set the active dataset (triggers React Query to fetch) */
  setActiveDataset: (dataset: Dataset) => void
  /** Clear the active dataset (returns to "No Data" state) */
  clearDataset: () => void
}

/**
 * Zustand store for tracking which dataset is currently loaded.
 * Works in conjunction with React Query for data fetching:
 * - This store tracks UI state (which dataset is selected)
 * - React Query handles data fetching, caching, and loading states
 */
export const useDataStore = create<DataStore>((set) => ({
  activeDataset: null,
  setActiveDataset: (dataset) => set({ activeDataset: dataset }),
  clearDataset: () => set({ activeDataset: null }),
}))

