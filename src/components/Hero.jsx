import { motion } from 'framer-motion'
import CountUp from './CountUp'

const stats = [
  { value: 390, prefix: '$', suffix: 'M', label: 'Peak annual portfolio governed', hot: true },
  { value: 4.2, prefix: '', suffix: 'x', decimals: 1, label: 'ROAS — lifted from 1.8x', hot: false },
  { value: 98, prefix: '>', suffix: '%', label: 'Delivery-in-full, held at scale', hot: false },
  { value: 100, prefix: '', suffix: '', label: 'Concurrent campaigns, 5 platforms', hot: false },
  { value: 8, prefix: '', suffix: '+ yrs', label: 'Programmatic & search systems', hot: false },
]

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 * i, duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex flex-col justify-center px-6 sm:px-10 max-w-6xl mx-auto pt-32 pb-24">
      <motion.p variants={fadeUp} initial="hidden" animate="show" custom={0} className="eyebrow mb-8">
        Programmatic systems <span className="text-ink-3">·</span> Agentic AI engineering <span className="text-ink-3">·</span> Hyderabad, IN
      </motion.p>

      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={1}
        className="display text-[clamp(52px,9vw,120px)]"
      >
        Orchestrating scale<span className="text-cyan">.</span>
        <br />
        Engineering <em>intelligence.</em>
      </motion.h1>

      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={2}
        className="mt-9 max-w-2xl text-ink-2 text-lg leading-relaxed"
      >
        I run the operating engine behind a nine-figure retail media portfolio at a{' '}
        <strong className="text-ink font-semibold">global Tier-1 media network</strong> — and I build
        the AI systems that make that scale possible. Eight years from search architecture to
        programmatic command, now compiling into software and agentic AI engineering.
      </motion.p>

      {/* stat ledger — ruled columns, not floating cards */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={3}
        className="mt-20 grid grid-cols-2 md:grid-cols-5 border-t border-white/10"
      >
        {stats.map((s) => (
          <div key={s.label} className="pt-6 pr-6 md:border-r md:border-white/10 md:mr-6 last:border-r-0 last:mr-0 pb-2">
            <div className={`tabular font-semibold text-[clamp(26px,2.6vw,38px)] tracking-tight ${s.hot ? 'text-cyan glow-cyan' : 'text-ink'}`}>
              <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals ?? 0} />
            </div>
            <div className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-3 leading-relaxed">
              {s.label}
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-ink-3"
      >
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <motion.div
          animate={{ scaleY: [0, 1, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut', times: [0, 0.45, 0.55, 1] }}
          className="h-11 w-px bg-gradient-to-b from-cyan to-transparent origin-top"
        />
      </motion.div>
    </section>
  )
}
