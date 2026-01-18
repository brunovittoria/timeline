# Timeline Component

A simple timeline visualization built with React. Perfect for showing events and tasks across time in a clean, interactive way.

## What's This?

This is a timeline component that shows your events as colored bars arranged in horizontal lanes. Think of it like a Gantt chart, but simpler and more focused on just showing when things happen.

## Quick Start

Make sure you have Node.js 18+ and pnpm installed, then:

```bash
pnpm install
pnpm dev
```

That's it! Open `http://localhost:5173` and you should see the timeline with some sample data.

## What Can It Do?

**The Basics:**
- Shows events as colored bars in horizontal lanes
- Automatically arranges items so they don't overlap (when possible)
- Scroll horizontally to see the full timeline

**Cool Features:**
- **Zoom in/out**: Use the slider to zoom from 50% to 400% - super useful when you have lots of items
- **Edit names**: Double-click any item to change its name
- **Resize dates**: Drag the left or right edge of an item to change when it starts or ends
- **See details**: Hover over items to see all the info in a nice tooltip

**Visual Stuff:**
- Color-coded items (rotates through a nice palette)
- Month and week markers in the header
- Weekend highlighting when zoomed in
- Grid lines to help you see where things are

## How It's Built

I used:
- **React + TypeScript** - because type safety is nice
- **Vite** - super fast dev server
- **Tailwind CSS** - for styling (no CSS files needed!)
- **Shadcn/ui** - for the UI components (buttons, sliders, etc.)
- **date-fns** - for all the date math
- **Zustand** - for state management (way simpler than Redux)

The code follows a composition pattern, which basically means each piece does one thing and does it well. The main components are:

- `Timeline` - the big container
- `TimelineHeader` - shows the months/weeks
- `TimelineItem` - each event bar (with drag/edit features)
- `TimelineLanes` - organizes items into rows

## What I Like About This

1. **Clean code structure** - Everything is organized and easy to find
2. **TypeScript everywhere** - Catches bugs before they happen
3. **Zustand is great** - No boilerplate, just works
4. **date-fns rocks** - Modern, small, and does everything I need
5. **Accessible** - Keyboard navigation and proper ARIA labels
6. **Looks good** - Smooth animations and nice hover effects

## What I'd Do Differently

If I had more time or was building this for production:

1. **Virtual scrolling** - For really big datasets (1000+ items), only render what's visible
2. **Undo/redo** - Let users undo when they accidentally drag something wrong
3. **Touch support** - Make dragging work on mobile devices
4. **Better drag feedback** - Show where items will land before you drop them
5. **More animations** - Maybe use Framer Motion for smoother transitions
6. **Performance tweaks** - Memoize more stuff, optimize re-renders

## Design Decisions

When building this, I looked at a few places for inspiration:

- **Airtable's timeline view** - I really liked how you guys handled the lane layout and the overall UX
- **Gantt charts** - Studied how they pack items efficiently into lanes without overlapping
- **Google Calendar** - Borrowed the month/week header formatting style

**Lane Assignment:**
The algorithm is pretty straightforward:
1. Sort all items by start date
2. For each item, try to put it in an existing lane
3. If it would overlap with something, put it in a new lane
4. Done!

I also added a minimum visual width check to prevent items from overlapping visually at low zoom levels (like 50%), even if they technically don't overlap in time.

**Zoom:**
Instead of using CSS transforms (which makes text blurry), I recalculate how wide each day should be. This keeps everything crisp at any zoom level.

**Colors:**
Items get colors from a rotating palette based on their ID. Simple but effective - gives visual variety without being overwhelming.

## Testing

Honestly, I didn't write tests for this (it was a quick project), but if I did:

- Unit tests for the lane assignment algorithm
- Tests for editing and dragging
- E2E tests for the full user flow
- Visual regression tests to catch UI bugs

## Sample Data

There are 16 sample items included, showing a project timeline from January to May 2021. You can edit them, drag them around, and see how everything works.

## License

MIT - Bruno Vittoria
