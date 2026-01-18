import { TimelineLane } from './TimelineLane'
import type { Lane } from '@/types/timeline'

interface TimelineLanesProps {
  lanes: Lane[]
  startDate: Date
  dayWidth: number
  laneHeight: number
}

export const TimelineLanes = ({ lanes, startDate, dayWidth, laneHeight }: TimelineLanesProps) => {
  return (
    <div className="absolute top-14 left-0 right-0">
      {lanes.map((lane, index) => (
        <TimelineLane
          key={index}
          lane={lane}
          startDate={startDate}
          dayWidth={dayWidth}
          laneHeight={laneHeight}
        />
      ))}
    </div>
  )
}
