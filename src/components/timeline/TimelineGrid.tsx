import { useMemo } from 'react'
import { eachMonthOfInterval, differenceInDays, isWeekend, addDays } from 'date-fns'
import { useTimelineStore } from '@/store/timelineStore'

interface TimelineGridProps {
  startDate: Date
  totalDays: number
  dayWidth: number
  lanesCount: number
  laneHeight: number
}

export const TimelineGrid = ({
  startDate,
  totalDays,
  dayWidth,
  lanesCount,
  laneHeight,
}: TimelineGridProps) => {
  const { zoom } = useTimelineStore()

  const monthLines = useMemo(() => {
    const endDate = addDays(startDate, totalDays)
    return eachMonthOfInterval({ start: startDate, end: endDate })
      .map((monthStart) => {
        const left = differenceInDays(monthStart, startDate) * dayWidth
        return { date: monthStart, left }
      })
      .filter((m) => m.left > 0)
  }, [startDate, totalDays, dayWidth])

  const weekendBands = useMemo(() => {
    if (zoom < 1.5) return []

    const bands: { left: number; width: number }[] = []
    for (let i = 0; i < totalDays; i++) {
      const currentDate = addDays(startDate, i)
      if (isWeekend(currentDate)) {
        const left = i * dayWidth
        const lastBand = bands[bands.length - 1]
        if (lastBand && lastBand.left + lastBand.width === left) {
          lastBand.width += dayWidth
        } else {
          bands.push({ left, width: dayWidth })
        }
      }
    }
    return bands
  }, [startDate, totalDays, dayWidth, zoom])

  const gridHeight = lanesCount * laneHeight

  return (
    <div
      className="absolute top-14 left-0 right-0 pointer-events-none"
      style={{ height: gridHeight }}
    >
      {weekendBands.map((band, index) => (
        <div
          key={`weekend-${index}`}
          className="absolute top-0 bottom-0 bg-muted/20"
          style={{ left: band.left, width: band.width }}
        />
      ))}

      {monthLines.map((month) => (
        <div
          key={month.date.toISOString()}
          className="absolute top-0 bottom-0 w-px bg-border/50"
          style={{ left: month.left }}
        />
      ))}

      {Array.from({ length: lanesCount }).map((_, index) => (
        <div
          key={`lane-${index}`}
          className="absolute left-0 right-0 h-px bg-border/30"
          style={{ top: (index + 1) * laneHeight }}
        />
      ))}
    </div>
  )
}
