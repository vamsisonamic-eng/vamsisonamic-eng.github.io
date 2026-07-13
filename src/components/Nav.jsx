import { motion } from 'framer-motion'

const links = [
  ['Core', '#core'],
  ['Pipelines', '#pipelines'],
  ['Matrix', '#matrix'],
  ['Connect', '#connect'],
]

export default function Nav() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 flex justify-center pt-5 px-4"
    >
      <nav className="glass rounded-full px-6 py-3 flex items-center gap-8">
        <a href="#core" className="font-mono text-sm font-semibold tracking-widest gradient-text">
          VS://2026
        </a>
        <div className="hidden sm:flex items-center gap-6">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-xs font-mono uppercase tracking-[0.2em] text-white/50 hover:text-neon transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>
    </motion.header>
  )
}
