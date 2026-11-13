import { useState } from 'react'
import * as m from 'motion/react-m'
import Icon from '../components/Icon'
import { useLog, useSequence, useSteps } from '../lib/hooks'
import { ActionButton, Actions, Log } from './ui'

const GUESSES = ['password', '123456', 'qwerty', 'letmein', 'admin123']
const INJECTION = "admin' OR 1=1 --"
const MASK = '••••••••'

export default function SecurityDemo({ onDone }) {
  const { run, busy } = useSequence()
  const { mark, isUsed } = useSteps(2, onDone)
  const [lines, log] = useLog('// waiting for your attack…')
  const [user, setUser] = useState('admin')
  const [pass, setPass] = useState(MASK)
  const [hot, setHot] = useState(null) // which field is under attack
  const [blocks, setBlocks] = useState(0) // bump → shield pulses

  const bruteForce = () =>
    run(async (wait) => {
      setHot('pass')
      for (const guess of GUESSES) {
        setPass(guess)
        log(`POST /login  401  pw="${guess}"`)
        await wait(420)
      }
      setPass(MASK)
      setHot(null)
      log('429 Too Many Requests · IP throttled 15m', 'bad')
      await wait(450)
      log('✓ account locked · alert sent to security', 'good')
      setBlocks((b) => b + 1)
      mark('brute')
    })

  const sqlInjection = () =>
    run(async (wait) => {
      setHot('user')
      for (let i = 1; i <= INJECTION.length; i++) {
        setUser(INJECTION.slice(0, i))
        await wait(45)
      }
      await wait(250)
      log(`POST /login  400  user="${INJECTION}"`, 'warn')
      await wait(450)
      log('✓ blocked · parameterized query, input never executed', 'good')
      await wait(300)
      log('source flagged for review')
      setUser('admin')
      setHot(null)
      setBlocks((b) => b + 1)
      mark('sqli')
    })

  return (
    <>
      <div className="border border-(--accent)/30 bg-(--accent)/[0.03] p-3.5">
        <div className="mb-3 flex items-center gap-2 text-xs text-(--accent)/55">
          <i className="size-2 bg-err" /> admin.portal / sign-in
        </div>
        <FakeField label="Username" value={user} hot={hot === 'user'} />
        <FakeField label="Password" value={pass} hot={hot === 'pass'} />
        {/* key changes → element remounts → the pulse animation replays */}
        <m.div
          key={blocks}
          initial={blocks ? { scale: 1.15 } : false}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 12 }}
          className="mt-3 flex origin-left items-center gap-2 text-[13px] font-semibold text-ok"
        >
          <Icon name="shield" className="size-[18px]" /> Protected
        </m.div>
      </div>

      <Actions>
        <ActionButton onClick={bruteForce} disabled={busy} done={isUsed('brute')}>
          Brute-force it
        </ActionButton>
        <ActionButton onClick={sqlInjection} disabled={busy} done={isUsed('sqli')}>
          SQL injection
        </ActionButton>
      </Actions>

      <Log lines={lines} />
    </>
  )
}

function FakeField({ label, value, hot }) {
  return (
    <>
      <span className="mb-1 mt-2 block text-[11px] text-(--accent)/55">{label}</span>
      <div
        className={`min-h-[42px] truncate border bg-black/30 px-3 py-2.5 text-sm transition-colors
          ${hot ? 'border-err' : 'border-(--accent)/30'}`}
      >
        {value}
      </div>
    </>
  )
}
