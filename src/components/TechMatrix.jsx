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
  { name: 'The Trade Desk · Edge Academy', detail: 'Kokai Certification — Advanced Programmatic', mark: '◆' },
  { name: 'Google', detail: 'Display & Video 360 Certification', mark: '◇' },
  { name: 'Amazon', detail: 'Amazon DSP Certification', mark: '◆' },
  { name: 'Google', detail: 'AI for App Building', mark: '◇' },
  { name: 'Google', detail: 'AI Writing, Brainstorming & Planning', mark: '◆' },
  { name: 'Skillsoft', detail: 'AI & Machine Learning Fundamentals', mark: '◇' },
]

const awards = [
  'Climb High Award — High Impact Performer · Q1 2025',
  'Make it Real Award — Top Performer · Q1 2026',
]

export default function TechMatrix() {
  return (
    <section id="stack" className="relative px-6 sm:px-10 py-36 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="eyebrow mb-6">The matrix <span className="text-ink-3">·</span> stack & signals</p>
        <h2 className="display text-[clamp(38px,5.4vw,64px)] max-w-3xl">
          Every platform, one <em>operating discipline.</em>
        </h2>
        <div className="hairline mt-14 w-full" />
      </motion.div>

      {/* skills — ruled ledger columns */}
      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-12">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-cyan pb-4 border-b border-white/10">
              {cat.title}
            </h3>
            <ul className="mt-5 space-y-3">
              {cat.skills.map((skill) => (
                <li key={skill} className="text-[15px] text-ink-2 leading-snug hover:text-ink transition-colors">
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
        transition={{ duration: 0.8 }}
        className="mt-28"
      >
        <p className="eyebrow eyebrow-amber mb-6">Credentials <span className="text-ink-3">·</span> certified & awarded</p>
        <h3 className="display text-[clamp(30px,4vw,46px)] max-w-3xl">
          Verified on the platforms <em>that matter.</em>
        </h3>
      </motion.div>

      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {certs.map((c, i) => (
          <motion.div
            key={c.detail}
            initial={{ opacity: 0, y: 34, rotateX: 10 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.75, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="card card-hover p-7"
          >
            <div className="flex items-start justify-between">
              <span className="font-serif italic text-3xl text-cyan leading-none">{c.mark}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-good border border-good/30 rounded-full px-3 py-1">
                Certified
              </span>
            </div>
            <div className="mt-6 font-semibold text-ink">{c.name}</div>
            <div className="mt-1.5 text-sm text-ink-2 leading-snug">{c.detail}</div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mt-10 flex flex-wrap gap-3"
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
