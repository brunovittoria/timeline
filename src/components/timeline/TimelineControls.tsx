import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { useTimelineStore } from '@/store/timelineStore'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

export const TimelineControls = () => {
  const { zoom, setZoom } = useTimelineStore()

  const handleZoomIn = () => {
    setZoom(zoom + 0.25)
  }

  const handleZoomOut = () => {
    setZoom(zoom - 0.25)
  }

  const handleReset = () => {
    setZoom(1)
  }

  return (
    <div className="flex items-center gap-4 p-2 bg-card border border-border rounded-lg">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          disabled={zoom <= 0.5}
          aria-label="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>

        <div className="w-32">
          <Slider
            value={[zoom]}
            onValueChange={([value]) => setZoom(value)}
            min={0.5}
            max={4}
            step={0.25}
            aria-label="Zoom level"
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          disabled={zoom >= 4}
          aria-label="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        {Math.round(zoom * 100)}%
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleReset}
        className="gap-1"
        aria-label="Reset zoom"
      >
        <RotateCcw className="h-3 w-3" />
        Reset
      </Button>
    </div>
  )
}
