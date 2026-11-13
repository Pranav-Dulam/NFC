// Facts about this visit, computed once when the page loads.
// (Kept outside components so rendering stays "pure".)

const ua = navigator.userAgent

export const DEVICE = {
  os: /iPhone/.test(ua) ? 'iPhone'
    : /iPad/.test(ua) ? 'iPad'
    : /Android/.test(ua) ? 'Android'
    : /Macintosh/.test(ua) ? 'Mac'
    : /Windows/.test(ua) ? 'Windows'
    : 'Device',
  browser: /EdgA?|EdgiOS/.test(ua) ? 'Edge'
    : /CriOS|Chrome/.test(ua) ? 'Chrome'
    : /FxiOS|Firefox/.test(ua) ? 'Firefox'
    : /Safari/.test(ua) ? 'Safari'
    : 'Browser',
}

const now = new Date()
const hour = now.getHours()

export const STARTED_AT = now.getTime()
export const TIME = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
export const GREETING = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

// ?e=uncc-fall-2026 on the NFC link tells you which fair they tapped at
const params = new URLSearchParams(window.location.search)
export const EVENT = (params.get('e') ?? '').slice(0, 60)

// Preview mode: nothing is sent. On during `npm run dev`, or with ?demo in the URL.
export const DEMO = import.meta.env.DEV || params.has('demo')
