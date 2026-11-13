// Small building blocks shared by all demos (terminal style)
import Button from '../components/Button'

const KIND = {
  dim: 'text-(--accent)/55',
  good: 'text-ok',
  bad: 'text-err',
  warn: 'text-warn',
}

// Terminal log. New lines "print" in (CSS animation on mount).
export function Log({ lines, className = 'min-h-24' }) {
  return (
    <div className={`border-t border-dashed border-(--accent)/30 pt-2.5 text-[12px] leading-relaxed ${className}`}>
      {lines.map((l) => (
        <div key={l.id} className={`animate-log-in truncate ${KIND[l.kind]}`}>
          {l.text}
        </div>
      ))}
    </div>
  )
}

export function Metric({ label, value, tone }) {
  return (
    <div className="panel p-2.5">
      <div className="text-[10px] uppercase tracking-wider text-(--accent)/55">{label}</div>
      <div className={`mt-0.5 text-[18px] font-bold tabular-nums ${tone ? KIND[tone] : ''}`}>{value}</div>
    </div>
  )
}

export function Actions({ children }) {
  return <div className="grid grid-cols-2 gap-2.5">{children}</div>
}

// A demo action button. Shows ✓ once it's been used.
export function ActionButton({ done, disabled, children, ...props }) {
  return (
    <Button variant="ghost" size="sm" disabled={disabled || done} {...props}>
      {done && <span className="text-ok">✓</span>}
      {children}
    </Button>
  )
}
