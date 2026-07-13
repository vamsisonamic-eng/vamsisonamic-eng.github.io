import { motion } from 'framer-motion'

/* The AI/automation layer — engineered systems, told as case studies. */
const systems = [
  {
    idx: 'SYS 01',
    name: 'AI screenshot & reporting pipeline',
    outcome: '70+ decks/week · ~70% cycle-time cut',
    body: 'Proof-of-delivery reporting was a manual grind measured in analyst-days. I engineered an AI-powered screenshot generation system that assembles 70+ vendor decks a week inside a 5-day SLA — the failure mode designed out, not worked around.',
  },
  {
    idx: 'SYS 02',
    name: 'Copilot agents & performance alerting',
    outcome: 'Analyst hours recovered · alerts before misses',
    body: 'Custom Microsoft Copilot agents watch pacing, delivery and optimization workflows and raise automated performance alerts — so under-delivery is caught by a system at 2am, not by a human at the QBR.',
  },
  {
    idx: 'SYS 03',
    name: 'Platform failure diagnosis',
    outcome: 'Zero client delivery impact',
    body: 'Diagnosed a DV360 end-date bug and creative-rejection tracking anomalies through proactive auditing — root causes found, documented and escalated to the platform before a single client-visible miss.',
  },
  {
    idx: 'SYS 04',
    name: 'Continuous optimization program',
    outcome: '>98% delivery-in-full, held while scaling',
    body: 'A documented audit-and-monitoring protocol — not one person’s memory — that kept delivery above 98% while the portfolio and team both expanded. Reliability is the product.',
  },
]

export default function Systems() {
  return (
    <section id="systems" className="relative px-6 sm:px-10 py-36 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="content-scrim max-w-3xl"
      >
        <p className="eyebrow mb-6">Engineered systems <span className="text-ink-3">·</span> the AI layer</p>
        <h2 className="display font-medium text-[clamp(36px,5vw,58px)] max-w-3xl">
          Not a person on the portfolio — <em>a system on the portfolio.</em>
        </h2>
        <p className="mt-7 max-w-2xl text-ink-2 text-lg leading-relaxed">
          The scale numbers only hold because the manual work keeps getting engineered away. These
          are the four systems doing that work today.
        </p>
        <div className="hairline mt-14 w-full" />
      </motion.div>

      <div className="mt-14 grid md:grid-cols-2 gap-5">
        {systems.map((s, i) => (
          <motion.div
            key={s.idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-70px' }}
            transition={{ duration: 0.7, delay: (i % 2) * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="card card-hover p-8 sm:p-9"
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-mono text-xs tracking-[0.18em] text-cyan">{s.idx}</span>
              <span className="font-mono text-[11px] tracking-[0.08em] text-good text-right">✓ {s.outcome}</span>
            </div>
            <h3 className="mt-5 font-display font-medium text-xl sm:text-[22px] tracking-tight leading-snug">{s.name}</h3>
            <p className="mt-4 text-[15px] text-ink-2 leading-relaxed">{s.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
