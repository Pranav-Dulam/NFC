# Tap card: how it works

A recruiter taps an NFC tag and their phone opens this page. They pick the role they're hiring for, play a 15-second challenge that shows a skill, see a "fit report" (mini portfolio), and can leave their LinkedIn. When they submit, my phone buzzes and they're added to a Notion table.

## Run it

```bash
npm install
npm run dev            # http://localhost:5173 (preview mode, nothing is sent)
npm run dev -- --host  # open the "Network" URL on your phone (same Wi-Fi)
npm run build          # production build in /dist
npm run lint
```

## The flow (a state machine)

```
boot ──► pick ──► demo ──► fit ──► connect ──► done
           ▲        │        │
           └────────┴────────┘   "try another role"
```

`App.jsx` holds 4 pieces of state: `step`, `roleId`, `tried` and `name`. Changing `step` swaps which screen renders. `<AnimatePresence mode="wait">` animates the old screen out before the new one comes in.

## Where things live

| Path | What it is |
|---|---|
| `src/config.js` | **All content**: name, links, projects, the 6 roles. Edit this, not the components. |
| `src/App.jsx` | State machine + page theme (role colors set as CSS variables) |
| `src/components/` | One file per screen + shared `Button`, `Screen`, `Icon` |
| `src/demos/` | The 6 role challenges, each its own lazy-loaded chunk |
| `src/lib/hooks.js` | `useSequence` (timed scripts with auto-cleanup), `useLog`, `useTween`, `useSteps` |
| `src/lib/api.js` | Talks to the backend: `sendTap()` and `submitContact()` |
| `src/lib/device.js` | Phone, time, greeting, `?e=` event tag, preview-mode flag |
| `api/connect.js` | Backend (Vercel serverless function): validates, saves to Notion, pushes to phone |

## Performance decisions (good interview material)

- **Code-splitting:** each demo is a dynamic `import()`, so it downloads only when picked. It starts downloading on `pointerdown`, before the tap even finishes.
- **Lazy animation engine:** `<LazyMotion>` + `m.` components ship a tiny core. The animation features load after first paint.
- **GPU-only animation:** only `opacity` and `transform` are animated. Bars use `scaleX` instead of `width`, risk chips move with `x/y` percentages, and the packet uses container-query units. No layout thrashing, so 60fps on mid-range phones.
- **Accessibility:** `reducedMotion="user"` respects the phone's Reduce Motion setting.
- **No heavy assets:** system fonts, inline SVG icons, no images. Tailwind ships only the classes used.
- **Cleanup:** `useSequence` clears its timers when a screen unmounts, so nothing keeps running in the background.
- **Uncontrolled form:** `FormData` reads every field on submit, so there's no re-render per keystroke.

## Backend

`POST /api/connect` with JSON:

- `type: "tap"`: optional push "someone is exploring Data / Analyst" (only if `NOTIFY_TAPS=true`). Sent with `navigator.sendBeacon`, so it never slows the page down.
- `type: "connect"`: validates the input (length limits, LinkedIn/email format, honeypot field for bots), then runs **in parallel** with `Promise.allSettled`:
  1. creates a row in the Notion "Recruiters Met" database
  2. sends a push to my phone via ntfy

  It succeeds if at least one of them worked. If the network fails, the form offers an email fallback, so a contact is never lost.

Secrets live in **environment variables** on Vercel and are never in frontend code.

## Setup checklist

1. **Content:** edit `src/config.js` and `public/contact.vcf`, and add `public/resume.pdf`.
2. **Notion:** create a database named "Recruiters Met" with these properties (exact names):
   `Name` (Title), `Company` (Text), `LinkedIn` (URL), `Email` (Email), `Hiring For` (Select), `Explored` (Multi-select), `Note` (Text), `Event` (Text), `Met On` (Date), `Status` (Select).
   Create an integration at notion.so/profile/integrations, copy its secret, then open the database → ••• → Connections → add your integration. Copy the database ID from its URL.
3. **Phone alerts:** install the **ntfy** app and subscribe to a long random topic name (anyone who knows the name can read it).
4. **Deploy:** push to GitHub, then import it on vercel.com (it auto-detects Vite and `/api`). Add env vars:
   `NOTION_TOKEN`, `NOTION_DATABASE_ID`, `NTFY_TOPIC`, optionally `NOTIFY_TAPS=true`.
5. **Test:** submit the form on the live URL and check that your phone buzzes and a Notion row appears.
6. **NFC:** write `https://YOUR-SITE.vercel.app/?e=uncc-fall-2026` to the tag with the NFC Tools app. Use a different `?e=` for each fair.
