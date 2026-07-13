import { motion } from 'framer-motion'

const timeline = [
  {
    era: '2024 — PRESENT',
    role: 'Senior Programmatic / Account Manager',
    org: 'Global Tier-1 Media Agency Network',
    color: 'from-neon/60',
    points: [
      'Orchestrating a $275M annualized budget across DV360, The Trade Desk (Kokai), GAM (SSP), Meta and Pinterest.',
      'Engineering $5M–$7M weekly spend pacing architectures across Display, CTV and conversion channels.',
      'Automated pacing systems — accuracy lifted from 78% to 98% through end-to-end optimization pipelines.',
    ],
    tags: ['98% Pacing Accuracy', '$275M Scale', '🏆 Climb High Award — High Impact Performer'],
  },
  {
    era: '2023 — 2024',
    role: 'Programmatic Growth Lead',
    org: 'International Digital Solutions Enterprise',
    color: 'from-pulse/60',
    points: [
      'Drove enterprise-wide DV360 adoption as the core programmatic activation platform.',
      'Boosted ROAS by 48% through full-funnel bid, creative and supply-path optimization.',
      'Cut CPA 15% and lifted CTR 25% via advanced audience mapping and signal engineering.',
    ],
    tags: ['+48% ROAS', '−15% CPA', '+25% CTR'],
  },
  {
    era: '2013 — 2023',
    role: 'SEO Specialist → Analyst → Manager → Co-Founder',
    org: 'Search & Organic Growth Ventures',
    color: 'from-flare/60',
    points: [
      'A decade mastering search architectures, technical SEO and content-driven organic growth engines.',
      'Built and led growth systems across multiple companies before scaling into programmatic media.',
      'The foundational systems-thinking now powering the transition into software & agentic AI engineering.',
    ],
    tags: ['10 Years of Search Systems', 'Organic Growth Engines', 'Co-Founder DNA'],
  },
]

export default function Experience() {
  return (
    <section id="pipelines" className="relative min-h-screen px-6 py-32 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
      >
        <p className="font-mono text-xs tracking-[0.35em] uppercase text-pulse mb-4">
          02 · Data Pipelines
        </p>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
          The <span className="gradient-text">$275M</span> Engine
        </h2>
        <div className="hairline mt-8 mb-16 w-full" />
      </motion.div>

      <div className="relative border-l border-white/10 pl-8 sm:pl-12 space-y-16">
        {timeline.map((item, i) => (
          <motion.article
            key={item.era}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            className="relative"
          >
            {/* timeline node */}
            <span
              className={`absolute -left-[41px] sm:-left-[57px] top-1.5 h-3 w-3 rounded-full bg-gradient-to-br ${item.color} to-transparent ring-4 ring-white/5`}
            />
            <p className="font-mono text-xs tracking-[0.25em] text-white/40">{item.era}</p>
            <h3 className="mt-2 text-xl sm:text-2xl font-semibold">{item.role}</h3>
            <p className="mt-1 text-sm font-mono text-neon/70">{item.org}</p>

            <div className="glass rounded-2xl p-6 mt-5">
              <ul className="space-y-3 text-sm sm:text-base text-white/65 leading-relaxed">
                {item.points.map((pt) => (
                  <li key={pt} className="flex gap-3">
                    <span className="text-neon mt-1">▸</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="tag-chip rounded-full px-4 py-1.5 text-xs font-mono tracking-wide text-neon"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
