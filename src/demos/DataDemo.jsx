import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { useLog, useSequence, useSteps } from '../lib/hooks'
import { ActionButton, Actions, Log } from './ui'

// A messy export with 3 hidden problems: a duplicate, a missing value, bad casing
const ROWS = [
  { id: 1, region: 'North', city: 'Charlotte', sales: '4,200' },
  { id: 2, region: 'north ', city: 'charlotte', sales: '4,200', issue: 'dup' },
  { id: 3, region: 'South', city: 'Raleigh', sales: '—', issue: 'null' },
  { id: 4, region: 'East', city: 'Durham', sales: '3,100' },
  { id: 5, region: 'West', city: 'Asheville', sales: '2,650' },
  { id: 6, region: 'South', city: 'raleigh ', sales: '3,900', issue: 'case', fixed: 'Raleigh' },
]
const TOTALS = [
  ['North', 4200],
  ['South', 3900],
  ['East', 3100],
  ['West', 2650],
]
const MAX = 4200

export default function DataDemo({ onDone }) {
  const { run, busy } = useSequence()
  const { mark, isUsed } = useSteps(2, onDone)
  const [lines, log] = useLog('// 6 rows · 3 problems hiding in here')
  const [marks, setMarks] = useState({}) // issue → 'flag' | 'fix' | 'gone'
  const [view, setView] = useState('table')

  const markIssue = (issue, value) => setMarks((prev) => ({ ...prev, [issue]: value }))

  const clean = () =>
    run(async (wait) => {
      markIssue('dup', 'flag')
      log('duplicate row found (case + whitespace)', 'warn')
      await wait(650)
      markIssue('null', 'flag')
      log('missing sales value: excluded', 'warn')
      await wait(650)
      markIssue('case', 'fix')
      log('normalized casing + trimmed spaces', 'good')
      await wait(650)
      markIssue('dup', 'gone')
      markIssue('null', 'gone')
      log('✓ 4 clean rows · ready', 'good')
      mark('clean')
    })

  const insight = () =>
    run(async (wait) => {
      setView('chart')
      await wait(1400)
      log('insight → North + South = 58% of sales', 'good')
      await wait(300)
      log("action → focus next quarter's spend there", 'good')
      mark('viz')
    })

  return (
    <>
      <div className="min-h-[240px]">
        <AnimatePresence mode="wait">
          {view === 'table' ? (
            <m.div key="table" exit={{ opacity: 0 }} className="overflow-hidden border border-(--accent)/30 text-[12.5px]">
              <Row head cells={['Region', 'City', 'Sales']} />
              {ROWS.map((r) => (
                <Row
                  key={r.id}
                  state={marks[r.issue]}
                  cells={[r.region, marks[r.issue] === 'fix' ? r.fixed : r.city, r.sales]}
                />
              ))}
            </m.div>
          ) : (
            <m.div key="chart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2.5 pt-2">
              {TOTALS.map(([region, value], i) => (
                <div key={region} className="grid grid-cols-[52px_1fr_44px] items-center gap-2.5 text-[12.5px]">
                  <span>{region}</span>
                  <div className="h-3.5 overflow-hidden bg-(--accent)/5">
                    {/* bars grow with scaleX (GPU) instead of width */}
                    <m.div
                      className="h-full bg-(--accent)"
                      style={{ originX: 0 }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: value / MAX }}
                      transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
                    />
                  </div>
                  <span className="text-right tabular-nums text-(--accent)/55">{(value / 1000).toFixed(1)}k</span>
                </div>
              ))}
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <Log lines={lines} className="min-h-16" />

      <Actions>
        <ActionButton onClick={clean} disabled={busy} done={isUsed('clean')}>
          Clean data
        </ActionButton>
        <ActionButton onClick={insight} disabled={busy || !isUsed('clean')} done={isUsed('viz')}>
          Find the insight
        </ActionButton>
      </Actions>
    </>
  )
}

function Row({ cells, head, state }) {
  const tone = head
    ? 'bg-(--accent)/5 text-[11px] uppercase tracking-wide text-(--accent)/55'
    : state === 'flag'
      ? 'bg-err/15'
      : state === 'fix'
        ? 'bg-ok/15'
        : state === 'gone'
          ? 'opacity-30 line-through'
          : ''
  return (
    <div className={`grid grid-cols-[1fr_1.2fr_0.8fr] border-t border-(--accent)/30 px-3 leading-[38px] transition-all duration-500 first:border-t-0 ${tone}`}>
      <span>{cells[0]}</span>
      <span>{cells[1]}</span>
      <span className="text-right tabular-nums">{cells[2]}</span>
    </div>
  )
}
