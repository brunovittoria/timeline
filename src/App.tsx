import { Timeline } from '@/components/timeline'
import { timelineItems } from '@/data/timelineItems'

const App = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Project Timeline</h1>
      <Timeline items={timelineItems} />
    </div>
  )
}

export default App
