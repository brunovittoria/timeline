import { TimelineItemComponent } from './TimelineItem'
import type { Lane } from '@/types/timeline'

interface TimelineLaneProps {
  lane: Lane
  startDate: Date
  dayWidth: number
  laneHeight: number
}

export const TimelineLane = ({
  lane,
  startDate,
  dayWidth,
  laneHeight,
}: TimelineLaneProps) => {
  return (
    <div
      className="relative"
      style={{ height: laneHeight }}
    >
      {lane.map((item) => (
        <TimelineItemComponent
          key={item.id}
          item={item}
          startDate={startDate}
          dayWidth={dayWidth}
          laneHeight={laneHeight}
        />
      ))}
    </div>
  )
}
