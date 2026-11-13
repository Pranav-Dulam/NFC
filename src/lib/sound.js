// Tiny 8-bit sound effects made with the Web Audio API: no audio files to download.
// Off by default; the visitor turns it on with the SND toggle.

let enabled = false
let ctx = null

export function setSound(on) {
  enabled = on
  // Browsers only allow audio after a user gesture. The toggle click is one.
  if (on && !ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (on) blip(1320, 0.06)
}

/** Short square-wave beep. freq in Hz, dur in seconds. */
export function blip(freq = 880, dur = 0.025, volume = 0.04) {
  if (!enabled || !ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'square'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur)
  osc.connect(gain).connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + dur)
}

export const sfx = {
  key: () => blip(700 + Math.random() * 200, 0.02, 0.025), // typewriter tick
  select: () => blip(990, 0.05),
  confirm: () => { blip(660, 0.06); setTimeout(() => blip(990, 0.08), 70) },
  good: () => blip(1320, 0.07),
  bad: () => blip(140, 0.12, 0.05),
}
