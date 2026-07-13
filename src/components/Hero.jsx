import { motion } from 'framer-motion'
import CountUp from './CountUp'

const stats = [
  { value: 275, prefix: '$', suffix: 'M+', label: 'Annualized Budget Orchestrated', accent: 'text-glow-cyan' },
  { value: 7, prefix: '$', suffix: 'M', label: 'Peak Weekly Pacing Architecture', accent: 'text-glow-violet' },
  { value: 10, prefix: '', suffix: '+ Yrs', label: 'Digital Systems Evolution', accent: 'text-glow-cyan' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 * i, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Hero() {
  return (
    <section id="core" className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-20">
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={0}
        className="font-mono text-xs sm:text-sm tracking-[0.35em] uppercase text-neon/80 mb-6"
      >
        Programmatic Systems · Agentic AI Engineering
      </motion.p>

      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={1}
        className="text-center text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight max-w-5xl"
      >
        Orchestrating <span className="gradient-text">Scale.</span>
        <br />
        Engineering <span className="gradient-text">Intelligence.</span>
      </motion.h1>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={2}
        className="mt-8 max-w-2xl text-center text-white/60 text-base sm:text-lg leading-relaxed"
      >
        Architecting nine-figure media systems at a global Tier-1 agency network —
        now compiling a decade of data-driven growth into software and agentic AI engineering.
      </motion.p>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-4xl">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={i + 3}
            className="glass glass-hover rounded-2xl px-6 py-8 text-center"
          >
            <div className={`text-4xl lg:text-5xl font-bold font-mono ${s.accent}`}>
              <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </div>
            <div className="mt-3 text-xs font-mono uppercase tracking-[0.18em] text-white/45">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 flex flex-col items-center gap-2 text-white/30"
      >
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="h-8 w-px bg-gradient-to-b from-neon/70 to-transparent"
        />
      </motion.div>
    </section>
  )
}
