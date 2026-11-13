import { useState } from 'react'
import { AnimatePresence, LazyMotion, MotionConfig } from 'motion/react'
import Background from './components/Background'
import BootScreen from './components/BootScreen'
import Challenge from './components/Challenge'
import ConnectForm from './components/ConnectForm'
import Done from './components/Done'
import FitReport from './components/FitReport'
import Progress from './components/Progress'
import RolePicker from './components/RolePicker'
import { DEFAULT_THEME, ROLES } from './config'
import { sendTap } from './lib/api'
import { DEMO } from './lib/device'
import { setSound } from './lib/sound'

// Animation engine is downloaded separately, after the first paint
const loadMotion = () => import('./lib/motion-features').then((mod) => mod.default)

const STEPS = ['boot', 'pick', 'demo', 'fit', 'connect', 'done']

/**
 * The whole app is a small state machine.
 *   step   → which screen is showing
 *   roleId → which role the recruiter picked (null = "Not sure yet")
 *   tried  → roles whose demo they finished
 *   name   → their name after they submit the form
 *   sound  → 8-bit sound effects on/off (off by default)
 */
export default function App() {
  const [step, setStep] = useState('boot')
  const [roleId, setRoleId] = useState(null)
  const [tried, setTried] = useState([])
  const [name, setName] = useState(null)
  const [sound, setSoundState] = useState(false)

  const role = ROLES.find((r) => r.id === roleId) ?? null

  // Picking a role re-colors the whole terminal through two CSS variables
  const theme = {
    '--accent': role?.accent ?? DEFAULT_THEME.accent,
    '--accent2': role?.accent2 ?? DEFAULT_THEME.accent2,
  }

  function toggleSound() {
    setSound(!sound)
    setSoundState(!sound)
  }

  function pickRole(id) {
    if (id === 'all') {
      setRoleId(null)
      setStep('fit')
      return
    }
    setRoleId(id)
    sendTap(ROLES.find((r) => r.id === id).label)
    setStep('demo')
  }

  const markTried = (id) => setTried((t) => (t.includes(id) ? t : [...t, id]))
  const triedLabels = tried.map((id) => ROLES.find((r) => r.id === id).label)

  return (
    // strict: forces the small `m.` components, so the full engine is never bundled by accident
    <LazyMotion features={loadMotion} strict>
      {/* Respect the phone's "Reduce Motion" accessibility setting */}
      <MotionConfig reducedMotion="user">
        <main style={theme} className="relative min-h-dvh overflow-x-hidden bg-[#030603] text-(--accent)">
          <Progress
            index={STEPS.indexOf(step)}
            right={
              <button type="button" onClick={toggleSound} aria-pressed={sound} className="px-1 py-1 uppercase">
                snd:{sound ? <span className="text-(--accent)">on</span> : <span className="dim">off</span>}
              </button>
            }
          />

          {/* mode="wait": the old screen glitches OUT, then the new one switches ON */}
          <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
            {step === 'boot' && <BootScreen key="boot" onStart={() => setStep('pick')} />}

            {step === 'pick' && <RolePicker key="pick" tried={tried} onPick={pickRole} />}

            {step === 'demo' && role && (
              <Challenge
                key={`demo-${role.id}`}
                role={role}
                onComplete={markTried}
                onNext={() => setStep('fit')}
                onBack={() => setStep('pick')}
              />
            )}

            {step === 'fit' && (
              <FitReport
                key="fit"
                role={role}
                tried={tried}
                onConnect={() => setStep('connect')}
                onBack={() => setStep('pick')}
              />
            )}

            {step === 'connect' && (
              <ConnectForm
                key="connect"
                lens={role?.label ?? 'Not sure yet'}
                tried={triedLabels}
                onSent={(n) => {
                  setName(n)
                  setStep('done')
                }}
                onSkip={() => setStep('done')}
              />
            )}

            {step === 'done' && (
              <Done
                key="done"
                name={name}
                onExplore={() => setStep('pick')}
                onRestart={() => {
                  // back to a fresh start, as if the card was just tapped
                  setRoleId(null)
                  setTried([])
                  setName(null)
                  setStep('boot')
                }}
              />
            )}
          </AnimatePresence>

          {DEMO && (
            <div className="fixed bottom-2.5 left-1/2 z-30 -translate-x-1/2 bg-warn px-2 py-1 font-pixel text-[8px] text-black">
              PREVIEW · NOTHING IS SENT
            </div>
          )}

          {/* CRT scanlines + vignette sit on top of everything */}
          <Background />
        </main>
      </MotionConfig>
    </LazyMotion>
  )
}
