// Shared animation settings, so every screen moves the same way.
// Only opacity + transform are animated: the GPU handles those, so 60fps on phones.

export const ease = [0.2, 0.8, 0.2, 1]

// Parent: reveal children one after another
export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
}

// Child: terminal-style "print" in: quick fade + tiny slide, slightly stepped
export const rise = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3, ease } },
}

// Whole screen: CRT "switch on" (squash in) and a short glitch out
export const screenIn = {
  initial: { opacity: 0, scaleY: 0.04, scaleX: 0.9 },
  animate: { opacity: 1, scaleY: 1, scaleX: 1, transition: { duration: 0.35, ease } },
  exit: {
    opacity: [1, 0.6, 1, 0],
    x: [0, -6, 5, 0],
    transition: { duration: 0.22, times: [0, 0.3, 0.6, 1] },
  },
}
