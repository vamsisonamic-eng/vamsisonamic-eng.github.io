import { motion } from 'framer-motion'

const links = [
  { label: 'LinkedIn', sub: 'linkedin.com/in/bharath-vamsi-reddy', href: 'https://www.linkedin.com/in/bharath-vamsi-reddy' },
  { label: 'GitHub', sub: 'github.com/vamsisonamic-eng', href: 'https://github.com/vamsisonamic-eng' },
  { label: 'Email', sub: 'vamsisonamic@gmail.com', href: 'mailto:vamsisonamic@gmail.com' },
]

export default function Connect() {
  return (
    <section id="connect" className="relative px-6 sm:px-10 pt-40 pb-16 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <p className="eyebrow mb-6 justify-center">Connect</p>
        <h2 className="display text-[clamp(40px,6.4vw,80px)] max-w-4xl mx-auto">
          What would it take to build <em>the next system together?</em>
        </h2>
        <p className="mt-7 max-w-xl mx-auto text-ink-2 text-lg">
          Open to software engineering, agentic AI, and programmatic architecture conversations.
        </p>
      </motion.div>

      <div className="mt-16 grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
        {links.map((l, i) => (
          <motion.a
            key={l.label}
            href={l.href}
            target={l.href.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
            className="card card-hover p-6 text-center"
          >
            <div className="font-semibold">{l.label}</div>
            <div className="mt-1.5 font-mono text-[11.5px] text-cyan/80 break-all">{l.sub}</div>
          </motion.a>
        ))}
      </div>

      <footer className="mt-28 border-t border-white/10 pt-7 flex flex-wrap justify-between gap-3 font-mono text-[11px] tracking-[0.12em] uppercase text-ink-3">
        <span>Bharat Vamsi Reddy · Hyderabad, India</span>
        <span>© 2026 · Orchestrating scale · Engineering intelligence</span>
      </footer>
    </section>
  )
}
