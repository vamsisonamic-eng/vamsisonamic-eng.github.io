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
  hidden: { opacity: 0, y: 22 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.09 * i, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function Hero() {
  return (
    <section id="top" className="relative min-h-screen flex flex-col justify-center px-6 sm:px-10 max-w-6xl mx-auto pt-32 pb-24">
      <div className="content-scrim max-w-3xl">
        <motion.p variants={fadeUp} initial="hidden" animate="show" custom={0} className="eyebrow mb-7">
          Programmatic systems · Agentic AI engineering · Hyderabad, IN
        </motion.p>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="display text-[clamp(32px,4.6vw,54px)] text-ink"
        >
          Orchestrating scale. Engineering <em>intelligence.</em>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="mt-7 max-w-2xl text-ink-2 text-base leading-relaxed"
        >
          I run the operating engine behind a nine-figure retail media portfolio at a{' '}
          <strong className="text-ink font-medium">global Tier-1 media network</strong> — and build the
          AI systems that make that scale possible. Eight years from search architecture to
          programmatic command, now compiling into software and agentic AI engineering.
        </motion.p>
      </div>

      {/* stat ledger — ruled columns, restrained numerals */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={3}
        className="mt-16 grid grid-cols-2 md:grid-cols-5 border-t border-line"
      >
        {stats.map((s) => (
          <div key={s.label} className="pt-6 pr-6 md:border-r md:border-line md:mr-6 last:border-r-0 last:mr-0 pb-2">
            <div
              className={`tabular font-display font-semibold text-[clamp(22px,2.1vw,30px)] tracking-tight ${
                s.hot ? 'accent-text' : 'text-ink'
              }`}
            >
              <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals ?? 0} />
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 leading-relaxed">
              {s.label}
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-ink-3"
      >
        <span className="font-mono text-[10px] tracking-[0.24em] uppercase">Scroll</span>
        <motion.div
          animate={{ scaleY: [0, 1, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut', times: [0, 0.45, 0.55, 1] }}
          className="h-9 w-px bg-gradient-to-b from-lime to-transparent origin-top"
        />
      </motion.div>
    </section>
  )
}
