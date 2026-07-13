import { useEffect, useState } from 'react'
import { motion, useScroll } from 'framer-motion'

const links = [
  ['Journey', '#journey'],
  ['Systems', '#systems'],
  ['Stack', '#stack'],
  ['Credentials', '#credentials'],
  ['Connect', '#connect'],
]

export default function Nav() {
  const { scrollYProgress } = useScroll()
  const [progress, setProgress] = useState(0)

  useEffect(
    () => scrollYProgress.on('change', (v) => setProgress(v)),
    [scrollYProgress]
  )

  return (
    <>
      {/* reading progress */}
      <div
        className="fixed top-0 left-0 h-[2px] z-[100] bg-lime"
        style={{ width: `${progress * 100}%` }}
      />
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass-nav fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 sm:px-10 py-4"
      >
        <a href="#top" className="font-display text-[14px] font-semibold tracking-tight text-ink">
          Bharath Vamsi
        </a>
        <nav className="hidden md:flex items-center gap-7">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-2 hover:text-lime transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>
      </motion.header>
    </>
  )
}
