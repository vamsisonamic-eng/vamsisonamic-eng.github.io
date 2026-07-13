import { motion } from 'framer-motion'

const links = [
  { label: 'LinkedIn', sub: 'linkedin.com/in/bharath-vamsi-reddy', href: 'https://www.linkedin.com/in/bharath-vamsi-reddy' },
  { label: 'GitHub', sub: 'github.com/vamsisonamic-eng', href: 'https://github.com/vamsisonamic-eng' },
  { label: 'Email', sub: 'vamsisonamic@gmail.com', href: 'mailto:vamsisonamic@gmail.com' },
]

export default function Connect() {
  return (
    <section id="connect" className="relative px-6 sm:px-10 pt-32 pb-16 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center content-scrim content-scrim-center max-w-2xl mx-auto"
      >
        <p className="eyebrow mb-5 justify-center">Connect</p>
        <h2 className="display text-[clamp(26px,3.6vw,40px)] max-w-xl mx-auto text-ink">
          What would it take to build <em>the next system together?</em>
        </h2>
        <p className="mt-5 max-w-lg mx-auto text-ink-2 text-base">
          Open to software engineering, agentic AI, and programmatic architecture conversations.
        </p>
      </motion.div>

      <div className="mt-12 grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {links.map((l, i) => (
          <motion.a
            key={l.label}
            href={l.href}
            target={l.href.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="card card-hover p-5 text-center"
          >
            <div className="font-display font-semibold text-sm text-ink">{l.label}</div>
            <div className="mt-1.5 font-mono text-[10.5px] accent-text break-all">{l.sub}</div>
          </motion.a>
        ))}
      </div>

      <footer className="mt-20 border-t border-line pt-6 flex flex-wrap justify-between gap-3 font-mono text-[10.5px] tracking-[0.08em] uppercase text-ink-3">
        <span>Bharath Vamsi · Hyderabad, India</span>
        <span>© 2026 · Orchestrating scale · Engineering intelligence</span>
      </footer>
    </section>
  )
}
