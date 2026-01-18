import { create } from 'zustand'
import type { TimelineItem } from '@/types/timeline'

interface TimelineStore {
  items: TimelineItem[]
  zoom: number
  setItems: (items: TimelineItem[]) => void
  setZoom: (zoom: number) => void
  updateItem: (id: number, updates: Partial<TimelineItem>) => void
}

export const useTimelineStore = create<TimelineStore>((set) => ({
  items: [],
  zoom: 1,
  setItems: (items) => set({ items }),
  setZoom: (zoom) => set({ zoom: Math.max(0.5, Math.min(4, zoom)) }),
  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),
}))
