import { useState } from 'react'
import * as m from 'motion/react-m'
import { useLog, useSequence, useSteps } from '../lib/hooks'
import { ActionButton, Actions, Log } from './ui'

const MAX_DAYS = 15

export default function SupplyDemo({ onDone }) {
  const { run, busy } = useSequence()
  const { mark, isUsed } = useSteps(2, onDone)
  const [lines, log] = useLog('// network healthy')
  const [phase, setPhase] = useState('ok') // ok | hit | fixed
  const [days, setDays] = useState(12)

  const disrupt = () =>
    run(async (wait) => {
      setPhase('hit')
      log('ALERT · labor action at LA port', 'bad')
      await wait(500)
      setDays(3)
      await wait(700)
      log('stockout risk in 3 days · 42 stores exposed', 'warn')
      mark('hit')
    })

  const reroute = () =>
    run(async (wait) => {
      setPhase('fixed')
      log('re-sourced PO · stock transfer created')
      await wait(700)
      setDays(11)
      await wait(600)
      log('✓ stockout avoided · freight cost +3%', 'good')
      mark('fix')
    })

  const portState = phase === 'hit' ? 'bad' : phase === 'fixed' ? 'skip' : 'ok'
  const danger = days < 5

  return (
    <>
      <div className="flex flex-col">
        <Hop label="Supplier · Shenzhen" note="on time" />
        <Link />
        <Hop label="Port of Los Angeles" note={phase === 'ok' ? 'on time' : '+9 days'} state={portState} />
        <Link />
        {phase === 'fixed' && (
          <m.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <Hop label="Savannah port → rail" note="+1 day" state="alt" />
            <Link />
          </m.div>
        )}
        <Hop label="DC · Charlotte" note="receiving" />
        <Link />
        <Hop label="42 stores" note={danger ? 'at risk' : 'stocked'} state={danger ? 'bad' : 'ok'} />
      </div>

      <div>
        <div className="mb-1.5 flex justify-between text-xs text-(--accent)/55">
          <span>Days of supply</span>
          <b className={`tabular-nums transition-colors ${danger ? 'text-err' : 'text-(--accent)'}`}>{days} days</b>
        </div>
        <div className="h-3 overflow-hidden bg-(--accent)/5">
          <m.div
            className={`h-full transition-colors duration-500 ${danger ? 'bg-err' : 'bg-ok'}`}
            style={{ originX: 0 }}
            initial={false}
            animate={{ scaleX: days / MAX_DAYS }}
            transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
          />
        </div>
      </div>

      <Log lines={lines} className="min-h-12" />

      <Actions>
        <ActionButton onClick={disrupt} disabled={busy} done={isUsed('hit')}>
          Port delay hits
        </ActionButton>
        <ActionButton onClick={reroute} disabled={busy || !isUsed('hit')} done={isUsed('fix')}>
          Reroute it
        </ActionButton>
      </Actions>
    </>
  )
}

const HOP = {
  ok: 'border-(--accent)/30 bg-(--accent)/5',
  bad: 'border-err bg-err/10',
  skip: 'border-(--accent)/30 bg-(--accent)/5 opacity-35 line-through',
  alt: 'border-ok bg-ok/10',
}
const DOT = { ok: 'bg-ok', bad: 'bg-err', skip: 'bg-(--accent)/40', alt: 'bg-ok' }

function Hop({ label, note, state = 'ok' }) {
  return (
    <div className={`flex items-center gap-3 border px-3 py-2 text-[13px] transition-colors duration-500 ${HOP[state]}`}>
      <i className={`size-2 flex-none ${DOT[state]}`} />
      {label}
      <small className={`ml-auto text-[11px] ${state === 'bad' ? 'text-err' : 'text-(--accent)/55'}`}>{note}</small>
    </div>
  )
}

function Link() {
  return <span className="ml-[15px] block h-2.5 w-0.5 bg-(--accent)/30" />
}
