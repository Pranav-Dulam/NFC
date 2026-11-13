import { useState } from 'react'
import * as m from 'motion/react-m'
import { useLog, useSequence, useSteps, useTween } from '../lib/hooks'
import { ActionButton, Actions, Log, Metric } from './ui'

const START = [1, 2, 3].map((id) => ({ id, status: 'up' })) // up | down | boot

export default function CloudDemo({ onDone }) {
  const { run, busy } = useSequence()
  const { mark, isUsed } = useSteps(2, onDone)
  const [lines, log] = useLog('// all systems healthy')
  const [servers, setServers] = useState(START)
  const [load, setLoad] = useState(33) // % load per live server (simulated)
  const [users, tweenUsers] = useTween(2481)

  const live = servers.filter((s) => s.status === 'up').length

  // New servers get the next id; "boot" → "up" after a health check
  const launch = (count) =>
    setServers((s) => [...s, ...Array.from({ length: count }, (_, i) => ({ id: s.length + i + 1, status: 'boot' }))])
  const markHealthy = () => setServers((s) => s.map((x) => (x.status === 'boot' ? { ...x, status: 'up' } : x)))

  const killServer = () =>
    run(async (wait) => {
      const victim = servers.find((s) => s.status === 'up')
      setServers((s) => s.map((x) => (x.id === victim.id ? { ...x, status: 'down' } : x)))
      setLoad(50)
      log(`health check failed · srv-${victim.id} removed`, 'bad')
      await wait(700)
      log('traffic rerouted · 0 requests dropped', 'good')
      await wait(500)
      log('auto-scaling: launching replacement…')
      launch(1)
      await wait(1100)
      markHealthy()
      setLoad(33)
      log('✓ replacement healthy · joined pool', 'good')
      mark('kill')
    })

  const spikeTraffic = () =>
    run(async (wait) => {
      await tweenUsers(24810, 1100)
      setLoad(91)
      log('cpu 91% · scale-out policy triggered', 'warn')
      await wait(600)
      launch(2)
      await wait(1100)
      markHealthy()
      setLoad(45)
      log('✓ load back to normal · users never noticed', 'good')
      mark('spike')
    })

  return (
    <>
      <div className="self-center border border-(--accent) bg-black px-4 py-2 text-xs text-(--accent)">
        load balancer
      </div>

      <div className="grid grid-cols-3 gap-2">
        {servers.map((s) => (
          <m.div
            key={s.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: s.status === 'down' ? 0.55 : 1, scale: 1 }}
            className={`border p-2.5 text-[11.5px] transition-colors duration-500
              ${s.status === 'down' ? 'border-err bg-err/10' : 'border-(--accent)/30 bg-(--accent)/5'}`}
          >
            <div className="flex items-center gap-1.5 font-semibold">
              <StatusDot status={s.status} />
              srv-{s.id}
            </div>
            <div className={`mt-1 tabular-nums ${s.status === 'up' && load > 70 ? 'text-warn' : 'text-(--accent)/55'}`}>
              {s.status === 'down' ? 'DOWN' : s.status === 'boot' ? 'booting…' : `load ${load}%`}
            </div>
          </m.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Metric label="Uptime" value="100.00%" tone="good" />
        <Metric label="Users" value={Math.round(users).toLocaleString()} />
        <Metric label="Servers" value={live} />
      </div>

      <Log lines={lines} className="min-h-16" />

      <Actions>
        <ActionButton onClick={killServer} disabled={busy} done={isUsed('kill')}>
          Kill a server
        </ActionButton>
        <ActionButton onClick={spikeTraffic} disabled={busy} done={isUsed('spike')}>
          10× traffic spike
        </ActionButton>
      </Actions>
    </>
  )
}

function StatusDot({ status }) {
  // text-* sets currentColor, which the glow (box-shadow) uses
  const color =
    status === 'down' ? 'bg-err text-err' : status === 'boot' ? 'bg-warn text-warn' : 'bg-ok text-ok'
  return <i className={`size-[7px] shadow-[0_0_8px_currentColor] ${color}`} />
}
