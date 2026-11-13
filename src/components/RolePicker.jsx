import { useState } from 'react'
import Screen, { Box, Cursor, Eyebrow, Reveal, Title } from './Screen'
import { ROLES } from '../config'
import { preloadDemo } from '../demos'
import { sfx } from '../lib/sound'

export default function RolePicker({ tried, onPick }) {
  // The ▸ cursor jumps to the tapped row for a beat before moving on, like a game menu
  const [selected, setSelected] = useState(null)

  const choose = (id) => {
    if (selected) return
    setSelected(id)
    sfx.confirm()
    setTimeout(() => onPick(id), 260)
  }

  const rows = [...ROLES.map((r, i) => ({ ...r, num: String(i + 1).padStart(2, '0') })), { id: 'all', num: '??', label: 'Not sure yet', sub: 'show me everything' }]

  return (
    <Screen>
      <Reveal>
        <Eyebrow>Step 1 of 3</Eyebrow>
      </Reveal>
      <Reveal className="mt-3">
        <Title>
          Select target role<Cursor />
        </Title>
      </Reveal>
      <Reveal className="mt-2">
        <p className="dim text-[14px]">{'>'} the rest of this adapts to your answer</p>
      </Reveal>

      <Reveal className="mt-7">
        <Box title="ROLES" className="px-1.5 py-3">
          <ul>
            {rows.map((r) => {
              const isSel = selected === r.id
              const done = tried.includes(r.id)
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    // Start downloading this role's demo the moment a finger touches it
                    onPointerDown={() => r.id !== 'all' && preloadDemo(r.id)}
                    onClick={() => choose(r.id)}
                    className={`group flex w-full items-start gap-2 px-2 py-2.5 text-left transition-colors
                      ${isSel ? 'bg-(--accent) text-[#030603]' : 'hover:bg-(--accent)/10'}`}
                  >
                    <span className={`w-3 pt-px ${isSel ? '' : 'opacity-0 group-hover:opacity-100'}`}>▸</span>
                    <span className={`pt-px text-[13px] ${isSel ? '' : 'dim'}`}>[{r.num}]</span>
                    <span className="flex-1">
                      <span className="block text-[15px] font-bold uppercase leading-tight">{r.label}</span>
                      <span className={`block text-[12px] ${isSel ? 'opacity-70' : 'dim'}`}>{r.sub}</span>
                    </span>
                    {done && <span className={`pt-px text-[11px] font-bold ${isSel ? '' : 'text-ok'}`}>✓ CLEARED</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        </Box>
      </Reveal>
    </Screen>
  )
}
