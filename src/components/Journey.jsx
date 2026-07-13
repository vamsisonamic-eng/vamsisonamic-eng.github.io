import { motion } from 'framer-motion'

/* Career record — every employer anonymized to an industry-scale descriptor. */
const timeline = [
  {
    era: 'APR 2026 — PRESENT',
    role: 'Senior Account Manager · Programmatic',
    org: 'Global Tier-1 Media Agency Network',
    points: [
      'Governing a $286M–$390M annual DSP/SSP retail media portfolio across DV360, The Trade Desk (Kokai), Amazon DSP, GAM 360 and Meta/Pinterest — 70–100 concurrent campaigns.',
      'Scaled program ROAS from 1.8x to 4.2x (+133%) through systematic audience segmentation, bid-strategy calibration on programmatic guaranteed deals, and dynamic creative rotation.',
      'Cut cost-per-acquisition 18% by engineering bid-optimization logic and audience cohort analysis against weekly conversion data.',
    ],
    tags: [
      { t: '1.8x → 4.2x ROAS', amber: false },
      { t: '−18% CPA', amber: false },
      { t: '🏆 Climb High — High Impact Performer', amber: true },
      { t: '🏆 Make it Real — Top Performer', amber: true },
    ],
  },
  {
    era: 'DEC 2023 — MAR 2026',
    role: 'Account Manager · Programmatic',
    org: 'Global Tier-1 Media Agency Network',
    points: [
      'Engineered an AI-powered screenshot generation system that delivers 70+ vendor decks a week inside a strict 5-day SLA — roughly 70% of the manual reporting cycle removed.',
      'Built custom Microsoft Copilot agents and automated performance alerting, recovering analyst hours across the activation team.',
      'Sustained a >98% delivery-in-full rate while the portfolio scaled — diagnosing platform-level failures (a DV360 end-date bug, creative-rejection anomalies) before any client impact.',
    ],
    tags: [
      { t: '>98% delivery-in-full', amber: false },
      { t: '70+ decks/week automated', amber: false },
      { t: 'Copilot agents in production', amber: false },
    ],
  },
  {
    era: 'APR 2023 — OCT 2023',
    role: 'Programmatic Advertising Specialist',
    org: 'International Tech Consulting Enterprise',
    points: [
      'Drove enterprise DV360 migration with real-time bid optimization and systematic keyword and contextual testing — campaign ROAS up 48%.',
      'Reduced CPA 15% through A/B tests across audience segments, creatives and landing pages; lifted CTR 25% with dynamic creative optimization and frequency capping across CTV, video and display.',
    ],
    tags: [
      { t: '+48% ROAS', amber: false },
      { t: '−15% CPA', amber: false },
      { t: '+25% CTR', amber: false },
    ],
  },
  {
    era: 'DEC 2021 — APR 2023',
    role: 'Programmatic & SEO Specialist',
    org: 'Global IT Solutions Provider',
    points: [
      'Improved quarterly ROAS ~20% across 12 advertiser accounts ($15M+ annual spend) via DV360/CM360 real-time bidding strategy and audience targeting.',
      'Built real-time performance dashboards unifying campaign metrics, guaranteed-deal performance and audience-segment analytics; contributed 25% organic traffic growth across 10+ accounts.',
    ],
    tags: [
      { t: '12 accounts · $15M+', amber: false },
      { t: '+25% organic traffic', amber: false },
    ],
  },
  {
    era: '2015 — 2021',
    role: 'SEO Manager → Co-Founder & Digital Strategist',
    org: 'Digital Technology Agency · Independent Venture',
    points: [
      'Led enterprise SEO strategy to 30% organic visibility growth across 10 client portfolios while managing paid media on Google Ads, Meta and DV360.',
      'Co-founded and ran an independent digital venture end-to-end — website development, content systems, SEO and marketing execution. The systems-thinking foundation everything above is built on.',
    ],
    tags: [
      { t: '+30% organic visibility', amber: false },
      { t: 'Co-Founder DNA', amber: false },
    ],
  },
]

export default function Journey() {
  return (
    <section id="journey" className="relative px-6 sm:px-10 py-36 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="eyebrow mb-6">The journey <span className="text-ink-3">·</span> 2015 → now</p>
        <h2 className="display text-[clamp(38px,5.4vw,64px)] max-w-3xl">
          Eight years, one direction: <em>more scale, more system.</em>
        </h2>
        <p className="mt-7 max-w-2xl text-ink-2 text-lg leading-relaxed">
          From hand-tuned SEO to a nine-figure programmatic engine — each role traded manual effort
          for engineered leverage. Employers are anonymized; the numbers are not.
        </p>
        <div className="hairline mt-14 mb-4 w-full" />
      </motion.div>

      <div className="relative border-l border-white/10 ml-1 pl-8 sm:pl-14">
        {timeline.map((item, i) => (
          <motion.article
            key={item.era}
            initial={{ opacity: 0, x: -26 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: Math.min(i * 0.08, 0.24), ease: [0.16, 1, 0.3, 1] }}
            className="relative py-12 border-b border-white/5 last:border-b-0"
          >
            <span
              className={`absolute -left-[38px] sm:-left-[62px] top-[58px] h-[11px] w-[11px] rounded-full ring-2 ring-page ${
                i === 0 ? 'bg-cyan shadow-[0_0_14px_rgba(42,200,218,0.6)]' : 'bg-ink-3/60'
              }`}
            />
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
              <span className="font-mono text-xs tracking-[0.22em] text-ink-3">{item.era}</span>
              <span className="font-serif italic text-cyan text-lg">{item.org}</span>
            </div>
            <h3 className="mt-3 text-2xl sm:text-[28px] font-semibold tracking-tight">{item.role}</h3>
            <ul className="mt-5 space-y-3 max-w-3xl text-[15.5px] sm:text-base text-ink-2 leading-relaxed">
              {item.points.map((pt) => (
                <li key={pt} className="flex gap-3">
                  <span className="text-cyan-deep mt-1 select-none">—</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {item.tags.map(({ t, amber }) => (
                <span
                  key={t}
                  className={`${amber ? 'tag-amber' : 'tag-chip'} rounded-full px-4 py-1.5 text-xs font-mono tracking-wide`}
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
