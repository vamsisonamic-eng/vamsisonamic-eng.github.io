import { Suspense, lazy, useEffect } from 'react'
import { bindScrollState } from './store/scrollState'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Journey from './components/Journey'
import Systems from './components/Systems'
import TechMatrix from './components/TechMatrix'
import Connect from './components/Connect'

// Lazy-load the 3D layer so the editorial UI paints instantly;
// the three.js chunk streams in behind it.
const DataCanvas = lazy(() => import('./canvas/DataCanvas'))

export default function App() {
  useEffect(() => bindScrollState(), [])

  return (
    <>
      <Suspense fallback={<div className="fixed inset-0 bg-page" />}>
        <DataCanvas />
      </Suspense>

      <div className="relative z-10">
        <Nav />
        <main>
          <Hero />
          <Journey />
          <Systems />
          <TechMatrix />
          <Connect />
        </main>
      </div>
    </>
  )
}
