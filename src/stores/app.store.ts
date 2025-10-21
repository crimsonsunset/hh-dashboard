import { create } from 'zustand'

interface AppStore {
  // UI preferences  
  theme: 'light' | 'dark'
  sidebarCollapsed: boolean
  
  // Dashboard state
  isLoading: boolean
  
  // Actions
  setTheme: (theme: 'light' | 'dark') => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setLoading: (loading: boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
  // Initial state
  theme: 'light',
  sidebarCollapsed: false,
  isLoading: false,
  
  // Actions
  setTheme: (theme) => set({ theme }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setLoading: (loading) => set({ isLoading: loading }),
})) 