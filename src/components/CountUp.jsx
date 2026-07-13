import { useEffect, useRef } from 'react'

// Animated numeric counter — plain IntersectionObserver + rAF for
// deterministic firing even when the element is only partially in view.
export default function CountUp({ value, prefix = '', suffix = '', decimals = 0 }) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    let raf
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const run = () => {
      if (reduce) {
        node.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`
        return
      }
      const dur = 1400
      const t0 = performance.now()
      const step = (t) => {
        const p = Math.min((t - t0) / dur, 1)
        const e = 1 - Math.pow(1 - p, 3)
        node.textContent = `${prefix}${(value * e).toFixed(decimals)}${suffix}`
        if (p < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          io.disconnect()
          run()
        }
      },
      { threshold: 0.05 }
    )
    io.observe(node)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, prefix, suffix, decimals])

  return <span ref={ref}>{`${prefix}0${suffix}`}</span>
}
