import { Suspense, lazy, useEffect } from 'react'
import { bindScrollState } from './store/scrollState'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Experience from './components/Experience'
import TechMatrix from './components/TechMatrix'
import Connect from './components/Connect'

// Lazy-load the 3D layer so the text UI paints instantly on GitHub Pages;
// the three.js chunk streams in behind it.
const DataCanvas = lazy(() => import('./canvas/DataCanvas'))

export default function App() {
  useEffect(() => bindScrollState(), [])

  return (
    <>
      <Suspense fallback={<div className="fixed inset-0 bg-void" />}>
        <DataCanvas />
      </Suspense>

      {/* Overlay UI — scrolls above the fixed canvas */}
      <div className="relative z-10">
        <Nav />
        <main>
          <Hero />
          <Experience />
          <TechMatrix />
          <Connect />
        </main>
      </div>
    </>
  )
}
