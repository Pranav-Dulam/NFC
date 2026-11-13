import { useState } from 'react'
import Button from './Button'
import Screen, { Box, Cursor, Eyebrow, Reveal, Title } from './Screen'
import { PROFILE } from '../config'
import { submitContact } from '../lib/api'
import { EVENT, STARTED_AT } from '../lib/device'
import { sfx } from '../lib/sound'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Only the name is required. LinkedIn is just the name they go by there
// (the backend turns it into a LinkedIn search link for me).
function validate(d) {
  if (!d.name) return 'name is required'
  if (d.email && !EMAIL_RE.test(d.email)) return 'email looks off'
  return null
}

export default function ConnectForm({ lens, tried, onSent, onSkip }) {
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null) // string, or { mailto } when the network fails

  async function handleSubmit(e) {
    e.preventDefault()
    // Uncontrolled form: read all values at once with FormData (no state per input)
    const f = new FormData(e.currentTarget)
    const data = {
      name: String(f.get('name')).trim(),
      company: String(f.get('company')).trim(),
      linkedin: String(f.get('linkedin')).trim(),
      email: String(f.get('email')).trim(),
      note: String(f.get('note')).trim(),
      website: String(f.get('website')), // honeypot: humans never see this field
    }

    const problem = validate(data)
    if (problem) {
      sfx.bad()
      return setError(problem)
    }

    setError(null)
    setSending(true)
    try {
      await submitContact({
        ...data,
        lens,
        explored: tried,
        seconds: Math.round((Date.now() - STARTED_AT) / 1000),
      })
      sfx.confirm()
      onSent(data.name)
    } catch {
      // Bad signal at the fair? Offer email so the contact is never lost.
      sfx.bad()
      const subject = encodeURIComponent(`Met at ${EVENT || 'the career fair'}`)
      const body = encodeURIComponent(
        `Hi ${PROFILE.name}, this is ${data.name}${data.company ? ` from ${data.company}` : ''}. ${data.linkedin}`,
      )
      setError({ mailto: `mailto:${PROFILE.links.email}?subject=${subject}&body=${body}` })
      setSending(false)
    }
  }

  return (
    <Screen>
      <Reveal>
        <Eyebrow>Last step</Eyebrow>
      </Reveal>
      <Reveal className="mt-3">
        <Title>
          Establish connection<Cursor />
        </Title>
      </Reveal>
      <Reveal className="mt-2">
        <p className="dim text-[14px] leading-relaxed">{'>'} leave your info and I'll reach out within a day. it goes only to me.</p>
      </Reveal>

      <Reveal className="mt-7">
        <Box title="NEW CONTACT">
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Field label="name*" name="name" autoComplete="name" maxLength={80} />
            <Field label="company" name="company" autoComplete="organization" maxLength={100} />
            <Field label="linkedin" name="linkedin" autoComplete="off" placeholder="your name on linkedin" maxLength={200} />
            <Field label="email" name="email" type="email" autoComplete="email" maxLength={120} placeholder="optional" />
            <Field label="note" name="note" textarea maxLength={500} placeholder="e.g. summer 2027 security intern" />
            <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] size-px opacity-0" />

            {error && (
              <p role="alert" className="text-[13px] text-err">
                ! error:{' '}
                {typeof error === 'string' ? (
                  error
                ) : (
                  <>
                    weak signal here.{' '}
                    <a href={error.mailto} className="underline">
                      send by email instead
                    </a>
                  </>
                )}
              </p>
            )}

            <Button type="submit" disabled={sending}>
              {sending ? 'Transmitting…' : `Transmit to ${PROFILE.name}`}
            </Button>
          </form>
        </Box>
      </Reveal>

      <Button variant="menu" size="sm" onClick={onSkip} className="mt-3 justify-center">
        Skip, just save the contact
      </Button>
    </Screen>
  )
}

// Terminal prompt style input: "name> ______"
function Field({ label, name, textarea, ...props }) {
  const cls =
    'w-full border-0 border-b border-(--accent)/40 bg-transparent px-0 py-1.5 text-[16px] text-(--accent) caret-(--accent) outline-none transition-colors placeholder:text-(--accent)/30 focus:border-(--accent)'
  return (
    <label className="flex items-start gap-2">
      <span className="dim w-[86px] shrink-0 pt-2 text-[13px]">{label}{'>'}</span>
      {textarea ? (
        <textarea name={name} rows={2} className={`${cls} resize-none`} {...props} />
      ) : (
        <input name={name} className={cls} {...props} />
      )}
    </label>
  )
}
