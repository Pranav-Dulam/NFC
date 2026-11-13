// CRT monitor effects layered over the whole page:
// scanlines, a slow rolling light bar, dark edges and a subtle flicker.
// One fixed layer that never re-renders, so it costs almost nothing.
export default function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 animate-flicker overflow-hidden">
      <div className="crt-scanlines absolute inset-0" />
      <div className="crt-rollbar absolute inset-x-0 top-0 animate-roll" />
      <div className="crt-vignette absolute inset-0" />
    </div>
  )
}
