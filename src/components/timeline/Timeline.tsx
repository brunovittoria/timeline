import { useEffect, useMemo, useRef } from 'react'
import { useTimelineStore } from '@/store/timelineStore'
import { getDateRange, assignLanes } from '@/lib/assignLanes'
import { TimelineHeader } from './TimelineHeader'
import { TimelineGrid } from './TimelineGrid'
import { TimelineLanes } from './TimelineLanes'
import { TimelineControls } from './TimelineControls'
import { TooltipProvider } from '@/components/ui/tooltip'
import type { TimelineItem } from '@/types/timeline'

interface TimelineProps {
  items: TimelineItem[]
}

const BASE_DAY_WIDTH = 24

export const Timeline = ({ items }: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { setItems, zoom, items: storeItems } = useTimelineStore()

  useEffect(() => {
    setItems(items)
  }, [items, setItems])

  const currentItems = storeItems.length > 0 ? storeItems : items

  const { startDate, endDate, totalDays } = useMemo(
    () => getDateRange(currentItems),
    [currentItems]
  )

  const lanes = useMemo(() => assignLanes(currentItems), [currentItems])

  const dayWidth = BASE_DAY_WIDTH * zoom
  const timelineWidth = totalDays * dayWidth
  const laneHeight = 48

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-4">
        <TimelineControls />
        <div
          ref={containerRef}
          className="relative overflow-x-auto overflow-y-hidden border border-border rounded-lg bg-card"
        >
          <div
            className="relative"
            style={{ width: timelineWidth, minHeight: lanes.length * laneHeight + 60 }}
          >
            <TimelineHeader
              startDate={startDate}
              endDate={endDate}
              dayWidth={dayWidth}
              totalDays={totalDays}
            />
            <TimelineGrid
              startDate={startDate}
              totalDays={totalDays}
              dayWidth={dayWidth}
              lanesCount={lanes.length}
              laneHeight={laneHeight}
            />
            <TimelineLanes
              lanes={lanes}
              startDate={startDate}
              dayWidth={dayWidth}
              laneHeight={laneHeight}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
