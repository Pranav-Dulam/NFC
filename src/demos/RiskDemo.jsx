import { useState } from 'react'
import * as m from 'motion/react-m'
import { useSteps, useTween } from '../lib/hooks'
import { Metric } from './ui'

// L = likelihood (1–3), I = impact (1–3). `to` = position after the control.
const RISKS = [
  { name: 'Phishing', L: 3, I: 3, to: [1, 2], control: 'MFA + training' },
  { name: 'Vendor outage', L: 2, I: 3, to: [2, 1], control: 'Backup vendor' },
  { name: 'Data loss', L: 3, I: 2, to: [1, 1], control: 'Encrypted backups' },
]
const START_SCORE = RISKS.reduce((sum, r) => sum + r.L * r.I, 0) // 21

// Heat map color by score (L × I)
const heat = (score) =>
  score >= 9 ? 'bg-err/40' : score >= 6 ? 'bg-warn/30' : score >= 3 ? 'bg-warn/15' : 'bg-ok/15'

export default function RiskDemo({ onDone }) {
  const { mark, isUsed } = useSteps(RISKS.length, onDone)
  const [score, setScore] = useState(START_SCORE)
  const [shown, tweenShown] = useTween(START_SCORE)

  const applyControl = (risk) => {
    if (isUsed(risk.name)) return
    const next = score - (risk.L * risk.I - risk.to[0] * risk.to[1])
    setScore(next)
    tweenShown(next, 800)
    mark(risk.name)
  }

  const reduced = Math.round((1 - score / START_SCORE) * 100)
  const allDone = RISKS.every((r) => isUsed(r.name))

  // Grid cells top → bottom = impact 3 → 1, left → right = likelihood 1 → 3
  const cells = []
  for (let I = 3; I >= 1; I--) for (let L = 1; L <= 3; L++) cells.push({ key: `${L}-${I}`, score: L * I })

  return (
    <>
      <div className="flex gap-2">
        <span className="rotate-180 text-center text-[10px] uppercase tracking-widest text-(--accent)/55 [writing-mode:vertical-rl]">
          Impact →
        </span>
        <div className="flex-1">
          <div className="relative grid h-[204px] grid-cols-3 grid-rows-3">
            {cells.map((c) => (
              <div key={c.key} className="p-0.5">
                <div className={`size-full ${heat(c.score)}`} />
              </div>
            ))}

            {/* Each chip wrapper is exactly one cell big, so moving it by 100%
                of its own size = moving one cell. Pure transform → smooth. */}
            {RISKS.map((r) => {
              const fixed = isUsed(r.name)
              const [L, I] = fixed ? r.to : [r.L, r.I]
              return (
                <m.div
                  key={r.name}
                  className="absolute left-0 top-0 h-1/3 w-1/3 p-1.5"
                  initial={false}
                  animate={{ x: `${(L - 1) * 100}%`, y: `${(3 - I) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 16 }}
                >
                  <button
                    type="button"
                    onClick={() => applyControl(r)}
                    className={`w-full border bg-black px-1.5 py-1 text-left text-[10.5px] leading-tight shadow-lg transition-colors
                      ${fixed ? 'border-ok' : 'animate-pulse border-err'}`}
                  >
                    <b className="block">{r.name}</b>
                    <small className={`text-[9.5px] ${fixed ? 'text-ok' : 'text-(--accent)/55'}`}>
                      {fixed ? r.control : `L${r.L} × I${r.I}`}
                    </small>
                  </button>
                </m.div>
              )
            })}
          </div>
          <p className="mt-1.5 text-center text-[10px] uppercase tracking-widest text-(--accent)/55">Likelihood →</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Metric label="Risk score" value={Math.round(shown)} tone={score <= 8 ? 'good' : 'bad'} />
        <Metric label="Reduced" value={`${reduced}%`} tone={allDone ? 'good' : undefined} />
      </div>

      <p className="text-center text-[13px] text-(--accent)/55">
        {allDone ? `Residual risk down from ${START_SCORE} to ${score}` : 'Tap each risk to apply a control'}
      </p>
    </>
  )
}
