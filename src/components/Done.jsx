import * as m from 'motion/react-m'
import Button from './Button'
import Screen, { Box, Cursor, Reveal } from './Screen'
import Type from './Type'
import { PROFILE } from '../config'

export default function Done({ name, onExplore, onRestart }) {
  const first = name?.split(/\s+/)[0]

  return (
    <Screen>
      <div className="flex-1" />

      {/* Square "signal" pulses expanding out from the center */}
      <Reveal className="relative mx-auto size-[140px]">
        {[0, 0.7, 1.4].map((delay) => (
          <m.i
            key={delay}
            className="absolute inset-0 border-2 border-(--accent)"
            initial={{ scale: 0.3, opacity: 1 }}
            animate={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 2.1, delay, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}
        <m.div
          className="glow absolute inset-[46px] grid place-items-center bg-(--accent) font-pixel text-[18px] text-[#030603]"
          animate={{ x: [0, 0, -3, 3, -2, 2, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, times: [0, 0.7, 0.75, 0.8, 0.85, 0.9, 1] }}
        >
          !
        </m.div>
      </Reveal>

      <Reveal className="mt-8 text-center">
        <p className="dim font-pixel text-[9px] tracking-wider"><span className="font-mono text-[12px]">★</span> PROGRESS SAVED</p>
        <h1 className="glow mt-4 font-pixel text-[clamp(24px,8vw,32px)]">{name ? 'LOOK UP.' : 'THANKS.'}</h1>
      </Reveal>

      <Reveal className="mt-8">
        <Box className="text-[14px] leading-relaxed">
          {name ? (
            <>
              <p>{'>'} notification sent to {PROFILE.name}'s phone</p>
              <p>
                {'>'} <Type text={`talk soon, ${first}.`} delay={900} />
              </p>
            </>
          ) : (
            <p>
              {'>'} save my contact and I'll be easy to find.
              <Cursor />
            </p>
          )}
        </Box>
      </Reveal>

      <div className="flex-1" />

      <Reveal className="flex flex-col gap-2.5">
        <Button href={PROFILE.links.vcard} download>
          Save {PROFILE.name} to contacts
        </Button>
        <Button variant="ghost" href={PROFILE.links.resume} target="_blank" rel="noopener">
          Open résumé.pdf
        </Button>
        <div className="mt-1 grid grid-cols-2">
          <Button variant="menu" size="sm" onClick={onExplore}>
            Try another role
          </Button>
          <Button variant="menu" size="sm" onClick={onRestart}>
            Restart
          </Button>
        </div>
      </Reveal>
    </Screen>
  )
}
