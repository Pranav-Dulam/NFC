import * as m from 'motion/react-m'
import { rise, screenIn, stagger } from '../lib/motion'

/**
 * Wrapper used by every screen.
 * - CRT "switch on" when it appears, a short glitch when it leaves
 *   (AnimatePresence in App.jsx triggers `exit`)
 * - Prints its <Reveal> children in one after another
 */
export default function Screen({ children, className = '', delay }) {
  const variants =
    delay === undefined ? stagger : { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: delay } } }

  return (
    <m.section
      {...screenIn}
      className={`relative z-10 mx-auto flex min-h-dvh w-full max-w-md origin-center flex-col px-5
        pt-[calc(max(14px,env(safe-area-inset-top))+40px)] pb-[calc(28px+env(safe-area-inset-bottom))] ${className}`}
    >
      <m.div className="flex flex-1 flex-col" variants={variants} initial="hidden" animate="show">
        {children}
      </m.div>
    </m.section>
  )
}

// Any block inside a Screen that should "print" in as part of the sequence
export function Reveal({ className = '', children }) {
  return (
    <m.div variants={rise} className={className}>
      {children}
    </m.div>
  )
}

// Small all-caps label, e.g. "MISSION 01 // CYBERSECURITY"
export function Eyebrow({ children }) {
  return <p className="dim font-pixel text-[9px] uppercase leading-relaxed tracking-wider">{children}</p>
}

// Big pixel heading with phosphor glow
export function Title({ children, className = '' }) {
  return (
    <h2 className={`glow font-pixel text-[clamp(15px,4.6vw,19px)] uppercase leading-[1.6] ${className}`}>{children}</h2>
  )
}

// Terminal window with a title on its border
export function Box({ title, className = '', children }) {
  return (
    <div className={`term-box ${className}`}>
      {title && <span className="term-title">{title}</span>}
      {children}
    </div>
  )
}

// Blinking block cursor
export function Cursor() {
  return <span className="ml-1 inline-block h-[1em] w-[0.55em] animate-blink bg-(--accent) align-[-0.15em]" />
}
