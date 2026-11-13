import { useEffect } from 'react'
import * as m from 'motion/react-m'
import { Cursor } from './Screen'

/**
 * End screen after "Exit". Browsers don't let a page close a tab it didn't open
 * (an NFC tap opens the tab), so instead the "monitor" powers off and tells the
 * visitor they're done.
 */
export default function ShutDown({ onReboot }) {
  // Let the power-off animation play, then try to close the tab.
  // If the browser blocks it, the "you can close this tab" message stays up.
  useEffect(() => {
    const id = setTimeout(() => window.close(), 2200)
    return () => clearTimeout(id)
  }, [])

  return (
    <m.section
      className="fixed inset-0 z-10 grid place-items-center bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* CRT power-off: the picture squashes into a line, shrinks to a dot, then fades */}
      <m.div
        className="absolute inset-0 bg-(--accent)/80"
        initial={{ scaleY: 1, scaleX: 1, opacity: 0.9 }}
        animate={{ scaleY: [1, 0.004, 0.004], scaleX: [1, 1, 0], opacity: [0.9, 1, 0] }}
        transition={{ duration: 0.9, times: [0, 0.5, 1], ease: 'easeIn' }}
      />

      <m.div
        className="relative px-6 text-center text-[14px] leading-7"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <p className="glow">{'>'} connection closed.</p>
        <p className="dim">
          {'>'} you can close this tab now.
          <Cursor />
        </p>
        <button type="button" onClick={onReboot} className="dim mt-12 text-[11px] uppercase underline underline-offset-4">
          reboot
        </button>
      </m.div>
    </m.section>
  )
}
