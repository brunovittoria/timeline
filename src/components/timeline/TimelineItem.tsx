import { useState, useRef, useEffect, useCallback } from 'react'
import { parseISO, differenceInDays, addDays, format } from 'date-fns'
import { useTimelineStore } from '@/store/timelineStore'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { TimelineItem } from '@/types/timeline'

interface TimelineItemComponentProps {
  item: TimelineItem
  startDate: Date
  dayWidth: number
  laneHeight: number
}

const ITEM_COLORS = [
  'bg-blue-500/90 hover:bg-blue-500',
  'bg-emerald-500/90 hover:bg-emerald-500',
  'bg-amber-500/90 hover:bg-amber-500',
  'bg-rose-500/90 hover:bg-rose-500',
  'bg-violet-500/90 hover:bg-violet-500',
  'bg-cyan-500/90 hover:bg-cyan-500',
  'bg-orange-500/90 hover:bg-orange-500',
  'bg-pink-500/90 hover:bg-pink-500',
]

const MIN_ITEM_WIDTH = 72

export const TimelineItemComponent = ({
  item,
  startDate,
  dayWidth,
  laneHeight,
}: TimelineItemComponentProps) => {
  const { updateItem } = useTimelineStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(item.name)
  const [isDragging, setIsDragging] = useState<'start' | 'end' | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const itemRef = useRef<HTMLDivElement>(null)
  const dragStartX = useRef(0)
  const originalDate = useRef('')

  const itemStart = parseISO(item.start)
  const itemEnd = parseISO(item.end)
  const durationDays = differenceInDays(itemEnd, itemStart) + 1
  
  const left = differenceInDays(itemStart, startDate) * dayWidth
  const calculatedWidth = durationDays * dayWidth
  const width = Math.max(calculatedWidth, MIN_ITEM_WIDTH)

  const colorClass = ITEM_COLORS[item.id % ITEM_COLORS.length]

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleClick = () => {
    setIsFocused(true)
  }

  const handleDoubleClick = () => {
    setIsEditing(true)
    setEditName(item.name)
    setIsFocused(true)
  }

  const handleBlur = (e: React.FocusEvent) => {
    if (!isEditing && !itemRef.current?.contains(e.relatedTarget as Node)) {
      setIsFocused(false)
    }
  }

  const handleSaveName = () => {
    if (editName.trim() && editName !== item.name) {
      updateItem(item.id, { name: editName.trim() })
    }
    setIsEditing(false)
    setIsFocused(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      handleSaveName()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      setEditName(item.name)
      setIsEditing(false)
      setIsFocused(false)
    }
  }

  const handleDragStart = useCallback(
    (edge: 'start' | 'end', e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(edge)
      dragStartX.current = e.clientX
      originalDate.current = edge === 'start' ? item.start : item.end
    },
    [item.start, item.end]
  )

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartX.current
      const deltaDays = Math.round(deltaX / dayWidth)

      if (deltaDays === 0) return

      const originalDateObj = parseISO(originalDate.current)
      const newDate = addDays(originalDateObj, deltaDays)
      const newDateStr = format(newDate, 'yyyy-MM-dd')

      if (isDragging === 'start') {
        if (newDate <= parseISO(item.end)) {
          updateItem(item.id, { start: newDateStr })
        }
      } else {
        if (newDate >= parseISO(item.start)) {
          updateItem(item.id, { end: newDateStr })
        }
      }
    }

    const handleMouseUp = () => {
      setIsDragging(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dayWidth, item.id, item.start, item.end, updateItem])

  const tooltipContent = (
    <div className="space-y-1">
      <div className="font-medium text-foreground">{item.name}</div>
      <div className="text-xs text-muted-foreground">
        {format(itemStart, 'MMM d, yyyy')} - {format(itemEnd, 'MMM d, yyyy')}
      </div>
      <div className="text-xs text-muted-foreground/70">
        {durationDays} day{durationDays !== 1 ? 's' : ''}
      </div>
    </div>
  )

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          ref={itemRef}
          className={cn(
            'absolute rounded-md shadow-sm cursor-pointer transition-all duration-150',
            'flex items-center px-2 text-white text-sm font-medium',
            'select-none',
            colorClass,
            isDragging && 'opacity-80 ring-2 ring-white/50',
            isFocused && !isEditing && 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-background shadow-lg scale-[1.02] z-10',
            isEditing && 'ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg scale-[1.02] z-10'
          )}
          style={{
            left,
            width,
            top: 4,
            height: laneHeight - 8,
          }}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onBlur={handleBlur}
          tabIndex={0}
          role="button"
          aria-label={`Timeline item: ${item.name}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleDoubleClick()
            }
          }}
          onFocus={() => setIsFocused(true)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/20 rounded-l-md"
            onMouseDown={(e) => handleDragStart('start', e)}
            role="slider"
            aria-label="Adjust start date"
            tabIndex={0}
          />

          {isEditing ? (
            <Input
              ref={inputRef}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={(e) => {
                if (!inputRef.current?.contains(e.relatedTarget as Node)) {
                  handleSaveName()
                }
              }}
              onKeyDown={handleKeyDown}
              className="h-6 text-sm bg-white/20 border-white/30 text-white placeholder:text-white/50"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="truncate flex-1 px-1">{item.name}</span>
          )}

          <div
            className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-white/20 rounded-r-md"
            onMouseDown={(e) => handleDragStart('end', e)}
            role="slider"
            aria-label="Adjust end date"
            tabIndex={0}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  )
}
