import { lazy, Suspense, useState } from 'react'
import * as m from 'motion/react-m'
import Button from './Button'
import Screen, { Box, Eyebrow, Reveal, Title } from './Screen'
import Type from './Type'
import { ROLES } from '../config'
import { DEMO_LOADERS } from '../demos'
import { sfx } from '../lib/sound'

// Code-splitting: each demo is its own small file that downloads only when needed.
// A security recruiter never downloads the supply-chain demo.
const DEMOS = Object.fromEntries(Object.entries(DEMO_LOADERS).map(([id, load]) => [id, lazy(load)]))

export default function Challenge({ role, onComplete, onNext, onBack }) {
  const [done, setDone] = useState(false)
  const Demo = DEMOS[role.id]
  const num = String(ROLES.indexOf(role) + 1).padStart(2, '0')

  const handleDone = () => {
    setDone(true)
    sfx.good()
    onComplete(role.id)
  }

  return (
    <Screen>
      <Reveal>
        <Eyebrow>
          Mission {num} // {role.label}
        </Eyebrow>
      </Reveal>
      <Reveal className="mt-3">
        <Title>
          <Type key={role.id} text={role.title} speed={35} delay={300} />
        </Title>
      </Reveal>
      <Reveal className="mt-2">
        <p className="dim text-[14px] leading-relaxed">{'>'} {role.desc}</p>
      </Reveal>

      <Reveal className="mt-6">
        <Box title="LIVE" className="flex flex-col gap-4">
          <Suspense fallback={<p className="dim h-72 text-[13px]">{'>'} loading module…</p>}>
            <Demo onDone={handleDone} />
          </Suspense>
        </Box>
      </Reveal>

      {done && (
        <m.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="mt-6">
          <Box title="[OK] MISSION COMPLETE" className="text-[14px] leading-relaxed">
            <b className="glow uppercase">{role.takeaway.bold}</b> <span className="text-(--accent)/80">{role.takeaway.rest}</span>
          </Box>
        </m.div>
      )}

      <div className="min-h-5 flex-1" />

      <Button disabled={!done} onClick={onNext} className="mt-5">
        View fit report
      </Button>
      <Button variant="menu" size="sm" onClick={onBack} className="mt-1 justify-center">
        Choose another role
      </Button>
    </Screen>
  )
}
