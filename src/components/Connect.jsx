import { motion } from 'framer-motion'

const links = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/YOUR-HANDLE', mono: 'in://' },
  { label: 'GitHub', href: 'https://github.com/vamsisonamic-eng', mono: 'gh://' },
  { label: 'Email', href: 'mailto:vamsisonamic@gmail.com', mono: '@://' },
]

export default function Connect() {
  return (
    <section id="connect" className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <p className="font-mono text-xs tracking-[0.35em] uppercase text-flare mb-4">
          04 · Connect
        </p>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
          Let's Build the <span className="gradient-text">Next System</span>
        </h2>
        <p className="mt-6 max-w-xl mx-auto text-white/55">
          Open to software engineering, agentic AI, and programmatic architecture conversations.
        </p>
      </motion.div>

      <div className="mt-14 flex flex-wrap justify-center gap-4">
        {links.map((l, i) => (
          <motion.a
            key={l.label}
            href={l.href}
            target={l.href.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="glass glass-hover rounded-full px-8 py-4 flex items-center gap-3"
          >
            <span className="font-mono text-xs text-neon/70">{l.mono}</span>
            <span className="text-sm font-medium">{l.label}</span>
          </motion.a>
        ))}
      </div>

      <footer className="mt-24 text-center font-mono text-[11px] tracking-[0.25em] uppercase text-white/25">
        © 2026 · Orchestrating Scale · Engineering Intelligence
      </footer>
    </section>
  )
}
