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
        className="fixed top-0 left-0 h-[3px] z-[100] bg-gradient-to-r from-cyan via-violet to-magenta shadow-[0_0_12px_rgba(0,240,255,0.6)]"
        style={{ width: `${progress * 100}%` }}
      />
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-nav fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 sm:px-10 py-4"
      >
        <a href="#top" className="font-display text-[13px] tracking-[0.15em] uppercase text-ink-2">
          <b className="text-ink font-medium">Bharat Vamsi</b> · Reddy
        </a>
        <nav className="hidden md:flex items-center gap-7">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="font-mono text-xs uppercase tracking-[0.14em] text-ink-3 hover:text-cyan transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>
      </motion.header>
    </>
  )
}
