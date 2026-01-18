import { useMemo } from 'react'
import { eachMonthOfInterval, eachWeekOfInterval, format, differenceInDays, endOfMonth, min, max } from 'date-fns'
import { useTimelineStore } from '@/store/timelineStore'

interface TimelineHeaderProps {
  startDate: Date
  endDate: Date
  dayWidth: number
  totalDays: number
}

export const TimelineHeader = ({ startDate, endDate, dayWidth }: TimelineHeaderProps) => {
  const { zoom } = useTimelineStore()

  const months = useMemo(() => {
    const allMonths = eachMonthOfInterval({ start: startDate, end: endDate })
    
    return allMonths.map((monthStart) => {
      const monthEnd = endOfMonth(monthStart)
      const visibleStart = max([monthStart, startDate])
      const visibleEnd = min([monthEnd, endDate])
      
      const left = differenceInDays(visibleStart, startDate) * dayWidth
      const daysInMonth = differenceInDays(visibleEnd, visibleStart) + 1
      const calculatedWidth = daysInMonth * dayWidth
      
      const minWidth = 80
      const width = Math.max(calculatedWidth, minWidth)

      return {
        date: monthStart,
        left,
        width,
        label: format(monthStart, 'MMMM yyyy'),
      }
    })
  }, [startDate, endDate, dayWidth])

  const weeks = useMemo(() => {
    if (zoom < 1) return []

    return eachWeekOfInterval({ start: startDate, end: endDate }).map((weekStart) => {
      const left = differenceInDays(weekStart, startDate) * dayWidth

      return {
        date: weekStart,
        left,
        label: format(weekStart, 'MMM d'),
      }
    })
  }, [startDate, endDate, dayWidth, zoom])

  return (
    <div className="sticky top-0 z-20 bg-card border-b border-border">
      <div className="relative h-8 border-b border-border/50">
        {months.map((month) => (
          <div
            key={month.date.toISOString()}
            className="absolute top-0 h-full flex items-center px-2 text-sm font-medium text-foreground border-l border-border/50 first:border-l-0 bg-muted/30"
            style={{ left: month.left, width: month.width }}
          >
            <span className="truncate">{month.label}</span>
          </div>
        ))}
      </div>

      {zoom >= 1 && (
        <div className="relative h-6">
          {weeks.map((week) => (
            <div
              key={week.date.toISOString()}
              className="absolute top-0 h-full flex items-center text-xs text-muted-foreground border-l border-border/30"
              style={{ left: week.left }}
            >
              <span className="px-1">{week.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
