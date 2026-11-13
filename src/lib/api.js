// Everything that talks to the backend (api/connect.js) lives here.
import { DEMO, DEVICE, EVENT } from './device'

const ENDPOINT = '/api/connect'
let tapSent = false

// "Someone started exploring" ping. sendBeacon is fire-and-forget:
// it never slows the page down, and it still sends if they close the tab.
export function sendTap(lens) {
  if (DEMO || tapSent) return
  tapSent = true
  const body = JSON.stringify({ type: 'tap', lens, device: DEVICE.os, event: EVENT })
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }))
    } else {
      fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true })
    }
  } catch {
    // a missed heads-up ping is fine
  }
}

// The real form submission. Throws if the server didn't save it.
export async function submitContact(data) {
  if (DEMO) {
    await new Promise((r) => setTimeout(r, 900))
    return
  }
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'connect', device: DEVICE.os, event: EVENT, ...data }),
  })
  if (!res.ok) throw new Error(`Server responded ${res.status}`)
}
