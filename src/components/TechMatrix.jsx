import { motion } from 'framer-motion'

const categories = [
  {
    title: 'AI & Engineering',
    skills: [
      'Agentic AI development',
      'Microsoft Copilot agents',
      'AI workflow automation',
      'Python',
      'Automated performance alerting',
      'Intelligent optimization frameworks',
    ],
  },
  {
    title: 'Programmatic & DSP',
    skills: [
      'DV360',
      'The Trade Desk · Kokai',
      'Amazon DSP',
      'GAM 360 (SSP)',
      'Meta · Pinterest',
      'Connected TV · RTB',
    ],
  },
  {
    title: 'Performance & Data',
    skills: [
      'ROAS optimization',
      'Bid-strategy calibration',
      'Audience cohort analysis',
      'A/B experimentation',
      'Behavioral data reporting',
      'GTM · Floodlight',
    ],
  },
  {
    title: 'Growth Foundations',
    skills: [
      'Go-to-market strategy',
      'Retail media networks',
      'PG deal negotiation',
      'Technical SEO',
      'Landing-page CRO',
      'Cross-channel paid media',
    ],
  },
]

const certs = [
  { name: 'The Trade Desk · Edge Academy', detail: 'Kokai Certification — Advanced Programmatic' },
  { name: 'Google', detail: 'Display & Video 360 Certification' },
  { name: 'Amazon', detail: 'Amazon DSP Certification' },
  { name: 'Google', detail: 'AI for App Building' },
  { name: 'Google', detail: 'AI Writing, Brainstorming & Planning' },
  { name: 'Skillsoft', detail: 'AI & Machine Learning Fundamentals' },
]

const awards = [
  'Climb High Award — High Impact Performer · Q1 2025',
  'Make it Real Award — Top Performer · Q1 2026',
]

export default function TechMatrix() {
  return (
    <section id="stack" className="relative px-6 sm:px-10 py-32 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="content-scrim max-w-3xl"
      >
        <p className="eyebrow mb-5">The matrix · stack & signals</p>
        <h2 className="display text-[clamp(26px,3.2vw,38px)] max-w-3xl text-ink">
          Every platform, one <em>operating discipline.</em>
        </h2>
      </motion.div>

      {/* skills — ruled ledger columns */}
      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="content-scrim"
          >
            <h3 className="font-mono text-[11px] tracking-[0.12em] uppercase text-ink-2 pb-3 border-b border-line">
              {cat.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {cat.skills.map((skill) => (
                <li key={skill} className="text-sm text-ink-2 leading-snug hover:text-ink transition-colors">
                  {skill}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* credentials */}
      <motion.div
        id="credentials"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mt-24 content-scrim max-w-3xl"
      >
        <p className="eyebrow eyebrow-amber mb-5">Credentials · certified & awarded</p>
        <h3 className="display text-[clamp(22px,2.6vw,30px)] max-w-3xl text-ink">
          Verified on the platforms <em>that matter.</em>
        </h3>
      </motion.div>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {certs.map((c, i) => (
          <motion.div
            key={c.detail}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="card card-hover p-6"
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-[11px] tracking-[0.1em] text-ink-3">{String(i + 1).padStart(2, '0')}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-good border border-good/30 rounded px-2.5 py-1">
                Certified
              </span>
            </div>
            <div className="mt-5 font-display font-semibold text-ink">{c.name}</div>
            <div className="mt-1.5 text-[13px] text-ink-2 leading-snug">{c.detail}</div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-8 flex flex-wrap gap-2.5"
      >
        {awards.map((a) => (
          <span key={a} className="chip chip-amber">
            <span className="dot" />
            {a}
          </span>
        ))}
      </motion.div>
    </section>
  )
}
