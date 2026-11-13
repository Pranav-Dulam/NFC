import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { sfx } from '../lib/sound'

/**
 * Typewriter text. Prints `text` one character at a time with a key blip.
 * Give it a `key` if the text changes so it restarts cleanly.
 * Respects Reduce Motion: shows the full text instantly.
 */
export default function Type({ text, speed = 28, delay = 0, onDone, className = '' }) {
  const reduce = useReducedMotion()
  const [count, setCount] = useState(0)
  const shown = reduce ? text.length : count

  useEffect(() => {
    if (reduce) {
      onDone?.()
      return
    }
    let i = 0
    let interval
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i++
        setCount(i)
        if (i % 2 === 0) sfx.key()
        if (i >= text.length) {
          clearInterval(interval)
          onDone?.()
        }
      }, speed)
    }, delay)
    return () => {
      clearTimeout(start)
      clearInterval(interval)
    }
    // onDone is intentionally not a dependency: we only restart when the text changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed, delay, reduce])

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, shown)}</span>
      {shown < text.length && <span className="ml-0.5 inline-block h-[1em] w-[0.5em] bg-(--accent) align-[-0.15em]" />}
    </span>
  )
}
