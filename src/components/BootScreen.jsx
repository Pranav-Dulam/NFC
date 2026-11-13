import { useState } from 'react'
import * as m from 'motion/react-m'
import Button from './Button'
import Screen, { Cursor, Reveal } from './Screen'
import Type from './Type'
import { PROFILE } from '../config'
import { DEVICE, EVENT, GREETING, TIME } from '../lib/device'

const EXE = `${PROFILE.name.toUpperCase()}.EXE`

export default function BootScreen({ onStart }) {
  // Boot runs in phases: 0 typing handshake → 1 loading bar → 2 show everything
  const [phase, setPhase] = useState(0)
  const where = EVENT ? ` · ${EVENT.replace(/[-_]/g, ' ')}` : ''

  return (
    <Screen>
      {/* Phase 0: handshake line */}
      <p className="text-[13px] leading-6">
        <Type text={`> secure handshake with ${DEVICE.os} … ok`} delay={350} onDone={() => setPhase(1)} />
      </p>

      {/* Phase 1: fake loader, fills with transform only */}
      {phase >= 1 && (
        <div className="mt-1 flex items-center gap-2 text-[13px] leading-6">
          <span>{'>'} loading {EXE}</span>
          <span className="relative h-3 flex-1 overflow-hidden border border-(--accent)/50">
            <m.span
              className="absolute inset-0 origin-left bg-(--accent)"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, ease: 'linear' }}
              onAnimationComplete={() => setPhase(2)}
            />
          </span>
        </div>
      )}

      {/* Phase 2: the actual intro */}
      {phase >= 2 && (
        <m.div className="flex flex-1 flex-col" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
          <div className="flex flex-1 flex-col justify-center gap-6 py-10">
            <Reveal>
              <p className="dim font-pixel text-[9px] uppercase tracking-wider">
                {GREETING}
                {where}
              </p>
            </Reveal>

            <Reveal>
              <p className="font-pixel text-[11px] leading-loose">YOU FOUND</p>
              <h1 className="glow font-pixel text-[clamp(24px,8vw,34px)] leading-tight">{EXE}</h1>
            </Reveal>

            <Reveal className="space-y-1 text-[16px] leading-relaxed">
              <p>{'>'} Most candidates talk.</p>
              <p>{'>'} This one lets you try it.</p>
              <p className="dim">{'>'} runtime: ~60 sec<Cursor /></p>
            </Reveal>

            <Reveal className="flex flex-wrap gap-2 text-[11px] uppercase">
              <Tag>● {DEVICE.os} · {DEVICE.browser}</Tag>
              <Tag>{TIME}</Tag>
              <Tag>nothing stored</Tag>
            </Reveal>
          </div>

          <Reveal>
            <Button onClick={onStart} className="animate-pulse hover:animate-none">
              Press start
            </Button>
          </Reveal>
        </m.div>
      )}
    </Screen>
  )
}

function Tag({ children }) {
  return <span className="border border-(--accent)/40 px-2 py-1 text-(--accent)/80">[ {children} ]</span>
}
