import { useState } from 'react'
import { useSequence, useSteps, useTween } from '../lib/hooks'
import { ActionButton, Actions, Metric } from './ui'

const STAGES = [
  { name: 'Lint', note: 'clean' },
  { name: 'Test', note: '128 passed' },
  { name: 'Build', note: '2.1 MB' },
  { name: 'Deploy', note: 'live' },
]

export default function SoftwareDemo({ onDone }) {
  const { run, busy } = useSequence()
  const { mark, isUsed } = useSteps(2, onDone)
  const [status, setStatus] = useState(STAGES.map(() => 'idle')) // idle | run | ok
  const [sending, setSending] = useState(false)
  const [requests, tweenRequests] = useTween(0)
  const [p95, setP95] = useState(null)
  const deployed = status.at(-1) === 'ok'

  const setStage = (i, value) => setStatus((s) => s.map((v, j) => (j === i ? value : v)))

  const deploy = () =>
    run(async (wait) => {
      for (let i = 0; i < STAGES.length; i++) {
        setStage(i, 'run')
        await wait(620)
        setStage(i, 'ok')
      }
      mark('deploy')
    })

  const sendTraffic = () =>
    run(async (wait) => {
      setSending(true)
      const latency = (async () => {
        for (const ms of [88, 64, 51, 44, 41]) {
          setP95(ms)
          await wait(420)
        }
      })()
      await Promise.all([tweenRequests(1000, 2200), latency])
      setSending(false)
      mark('load')
    })

  return (
    <>
      <div className="grid grid-cols-4 gap-1.5">
        {STAGES.map((stage, i) => (
          <div
            key={stage.name}
            className={`relative overflow-hidden border px-1 py-2.5 text-center text-[11px] transition-colors
              ${status[i] === 'ok' ? 'border-ok/40 text-ok' : 'border-(--accent)/30 text-(--accent)/55'} bg-(--accent)/5`}
          >
            {stage.name}
            <small className="mt-0.5 block text-[10px] text-(--accent)/55">{status[i] === 'ok' ? stage.note : '–'}</small>
            {/* progress bar: scaleX from 0 → 1 */}
            <span
              className={`absolute inset-x-0 bottom-0 h-[3px] origin-left bg-(--accent) transition-transform duration-[600ms] ease-linear
                ${status[i] === 'idle' ? 'scale-x-0' : 'scale-x-100'}`}
            />
          </div>
        ))}
      </div>

      {/* Request trace: client → api → cache → db */}
      <div className="relative flex items-center justify-between py-1.5">
        <span className="absolute inset-x-[8%] top-1/2 h-px bg-linear-to-r from-(--accent)/10 via-(--accent) to-(--accent)/10" />
        {['client', 'api', 'cache', 'db'].map((n) => (
          <span key={n} className="relative z-10 border border-(--accent)/30 bg-black px-2.5 py-2 text-[11px]">
            {n}
          </span>
        ))}
        {sending && (
          <span className="@container absolute inset-x-[8%] top-1/2 z-20 -mt-[4.5px] h-[9px]">
            <i className="packet block size-[9px] bg-(--accent2) shadow-[0_0_14px_var(--accent2)]" />
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Metric label="Requests" value={Math.round(requests).toLocaleString()} />
        <Metric label="p95" value={p95 ? `${p95}ms` : '–'} tone={p95 === 41 ? 'good' : undefined} />
        <Metric label="Errors" value={p95 ? '0' : '–'} tone={p95 ? 'good' : undefined} />
      </div>

      <Actions>
        <ActionButton onClick={deploy} disabled={busy} done={isUsed('deploy')}>
          Deploy v2.4
        </ActionButton>
        <ActionButton onClick={sendTraffic} disabled={busy || !deployed} done={isUsed('load')}>
          Send 1,000 requests
        </ActionButton>
      </Actions>
    </>
  )
}
