import { motion } from 'framer-motion'

const categories = [
  {
    title: 'Engineering & Analytics',
    accent: 'text-mint',
    skills: ['Agentic AI Development', 'Python', 'Advanced Data Analytics', 'GTM', 'Floodlight'],
  },
  {
    title: 'Programmatic & Media Systems',
    accent: 'text-neon',
    skills: ['DV360', 'The Trade Desk · Kokai', 'GAM (SSP)', 'Meta', 'Pinterest'],
  },
]

const certs = [
  {
    name: 'The Trade Desk Edge Academy',
    detail: 'Kokai Certification',
    icon: '◆',
    glow: 'from-neon/20',
  },
  {
    name: 'Google AI',
    detail: 'AI for App Building',
    icon: '◇',
    glow: 'from-pulse/20',
  },
  {
    name: 'Google AI',
    detail: 'AI Writing, Brainstorming & Planning',
    icon: '◈',
    glow: 'from-flare/20',
  },
]

export default function TechMatrix() {
  return (
    <section id="matrix" className="relative min-h-screen px-6 py-32 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
      >
        <p className="font-mono text-xs tracking-[0.35em] uppercase text-mint mb-4">
          03 · The Tech Matrix
        </p>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
          Systems, Stacks & <span className="gradient-text">Signals</span>
        </h2>
        <div className="hairline mt-8 mb-16 w-full" />
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: i * 0.12 }}
            className="glass glass-hover rounded-2xl p-8"
          >
            <h3 className={`font-mono text-sm tracking-[0.25em] uppercase ${cat.accent}`}>
              {cat.title}
            </h3>
            <div className="mt-6 flex flex-wrap gap-3">
              {cat.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/75 hover:border-neon/40 hover:text-white transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.h3
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-20 mb-8 font-mono text-sm tracking-[0.3em] uppercase text-white/40 text-center"
      >
        — Certified Credentials —
      </motion.h3>

      <div className="grid sm:grid-cols-3 gap-5">
        {certs.map((c, i) => (
          <motion.div
            key={c.detail}
            initial={{ opacity: 0, y: 40, rotateX: 12 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            className={`glass glass-hover rounded-2xl p-7 text-center bg-gradient-to-b ${c.glow} to-transparent`}
          >
            <div className="text-4xl gradient-text">{c.icon}</div>
            <div className="mt-4 font-semibold text-white/90">{c.name}</div>
            <div className="mt-1.5 text-sm font-mono text-neon/70">{c.detail}</div>
            <div className="mt-5 inline-block rounded-full border border-mint/30 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-mint/80">
              Verified
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
