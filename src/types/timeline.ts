export interface TimelineItem {
  id: number
  start: string
  end: string
  name: string
}

export interface TimelineItemWithLane extends TimelineItem {
  lane: number
}

export interface TimelineState {
  items: TimelineItem[]
  zoom: number
  setZoom: (zoom: number) => void
  updateItem: (id: number, updates: Partial<TimelineItem>) => void
}

export interface TimelineDateRange {
  startDate: Date
  endDate: Date
  totalDays: number
}

export type Lane = TimelineItem[]
