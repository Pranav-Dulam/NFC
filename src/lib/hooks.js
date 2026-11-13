// Small custom hooks shared by the demos.
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * useSequence: run a timed "script" of steps, e.g.
 *   run(async (wait) => { log('a'); await wait(400); log('b') })
 * If the screen closes mid-script, all pending timers are cleared,
 * so nothing keeps running in the background.
 */
export function useSequence() {
  const timers = useRef(new Set())
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const pending = timers.current
    return () => {
      pending.forEach(clearTimeout)
      pending.clear()
    }
  }, [])

  const wait = useCallback(
    (ms) =>
      new Promise((resolve) => {
        const id = setTimeout(() => {
          timers.current.delete(id)
          resolve()
        }, ms)
        timers.current.add(id)
      }),
    [],
  )

  const run = useCallback(
    async (script) => {
      setBusy(true)
      await script(wait)
      setBusy(false)
    },
    [wait],
  )

  return { run, busy }
}

/** useLog: a terminal-style log that keeps the last 6 lines. */
export function useLog(firstLine) {
  const nextId = useRef(1)
  const [lines, setLines] = useState([{ id: 0, text: firstLine, kind: 'dim' }])

  const add = useCallback((text, kind = 'dim') => {
    const id = nextId.current++
    setLines((prev) => [...prev.slice(-5), { id, text, kind }])
  }, [])

  return [lines, add]
}

/** useTween: smoothly count a number to a new value (e.g. 0 → 1,000). */
export function useTween(initial) {
  const [value, setValue] = useState(initial)
  const current = useRef(initial)
  const frame = useRef({ id: 0 })

  useEffect(() => {
    const f = frame.current
    return () => cancelAnimationFrame(f.id)
  }, [])

  const animateTo = useCallback(
    (target, ms = 900) =>
      new Promise((resolve) => {
        cancelAnimationFrame(frame.current.id)
        const from = current.current
        const start = performance.now()
        const tick = (now) => {
          const p = Math.min(1, (now - start) / ms)
          const eased = 1 - (1 - p) ** 3 // ease-out
          current.current = from + (target - from) * eased
          setValue(current.current)
          if (p < 1) frame.current.id = requestAnimationFrame(tick)
          else resolve()
        }
        frame.current.id = requestAnimationFrame(tick)
      }),
    [],
  )

  return [value, animateTo]
}

/**
 * useSteps: track which actions in a demo are finished.
 * Calls onDone() once every action has been done.
 */
export function useSteps(total, onDone) {
  const [used, setUsed] = useState([])

  const mark = (id) => {
    if (used.includes(id)) return
    const next = [...used, id]
    setUsed(next)
    if (next.length === total) onDone()
  }

  return { mark, isUsed: (id) => used.includes(id) }
}
