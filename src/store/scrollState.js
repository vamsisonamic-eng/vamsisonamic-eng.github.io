// Shared mutable scroll/pointer state, read every frame inside the R3F loop.
// A plain mutable object (not React state) keeps the 3D canvas at 60fps:
// no re-renders, no allocations — the UI layer writes, the canvas reads.
export const scrollState = {
  // 0 → 1 across the entire page
  progress: 0,
  // normalized pointer, -1 → 1
  mouseX: 0,
  mouseY: 0,
}

export function bindScrollState() {
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    scrollState.progress = max > 0 ? window.scrollY / max : 0
  }
  const onPointer = (e) => {
    scrollState.mouseX = (e.clientX / window.innerWidth) * 2 - 1
    scrollState.mouseY = -((e.clientY / window.innerHeight) * 2 - 1)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('pointermove', onPointer, { passive: true })
  onScroll()
  return () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('pointermove', onPointer)
  }
}
