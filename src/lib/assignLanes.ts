import { parseISO, differenceInDays, addDays, format } from 'date-fns'
import type { TimelineItem, Lane } from '@/types/timeline'

const MIN_GAP_DAYS = 1
const MIN_ITEM_DAYS = 3

export const assignLanes = (items: TimelineItem[]): Lane[] => {
  if (items.length === 0) return []

  const sortedItems = [...items].sort((a, b) => {
    const dateA = parseISO(a.start)
    const dateB = parseISO(b.start)
    return dateA.getTime() - dateB.getTime()
  })

  const lanes: Lane[] = []

  const getEffectiveEndDate = (item: TimelineItem): Date => {
    const startDate = parseISO(item.start)
    const endDate = parseISO(item.end)
    const durationDays = differenceInDays(endDate, startDate) + 1

    if (durationDays < MIN_ITEM_DAYS) {
      return addDays(startDate, MIN_ITEM_DAYS - 1)
    }
    return endDate
  }

  const assignItemToLane = (item: TimelineItem): void => {
    const itemStart = parseISO(item.start)

    for (const lane of lanes) {
      const lastItemInLane = lane[lane.length - 1]
      const lastItemEnd = getEffectiveEndDate(lastItemInLane)
      const requiredGap = addDays(lastItemEnd, MIN_GAP_DAYS)

      if (itemStart >= requiredGap) {
        lane.push(item)
        return
      }
    }

    lanes.push([item])
  }

  for (const item of sortedItems) {
    assignItemToLane(item)
  }

  return lanes
}

export const getDateRange = (
  items: TimelineItem[],
  paddingDays: number = 7
): { startDate: Date; endDate: Date; totalDays: number } => {
  if (items.length === 0) {
    const today = new Date()
    return {
      startDate: today,
      endDate: addDays(today, 30),
      totalDays: 30,
    }
  }

  const dates = items.flatMap((item) => [parseISO(item.start), parseISO(item.end)])
  const minDate = new Date(Math.min(...dates.map((d) => d.getTime())))
  const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())))

  const startDate = addDays(minDate, -paddingDays)
  const endDate = addDays(maxDate, paddingDays)
  const totalDays = differenceInDays(endDate, startDate) + 1

  return { startDate, endDate, totalDays }
}

export const getItemPosition = (
  item: TimelineItem,
  timelineStart: Date,
  dayWidth: number
): { left: number; width: number } => {
  const startDate = parseISO(item.start)
  const endDate = parseISO(item.end)

  const left = differenceInDays(startDate, timelineStart) * dayWidth
  const durationDays = differenceInDays(endDate, startDate) + 1
  const width = Math.max(durationDays * dayWidth, MIN_ITEM_DAYS * dayWidth)

  return { left, width }
}

export const formatDate = (dateStr: string): string => {
  return format(parseISO(dateStr), 'MMM d, yyyy')
}
