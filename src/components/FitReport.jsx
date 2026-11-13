import Button from './Button'
import Screen, { Box, Eyebrow, Reveal, Title } from './Screen'
import { GENERAL_FIT, PROFILE, PROJECTS, ROLES } from '../config'

export default function FitReport({ role, tried, onConnect, onBack }) {
  // A specific role, or the "Not sure yet" overview
  const fit = role ?? GENERAL_FIT
  const others = tried.filter((id) => id !== role?.id).map((id) => ROLES.find((r) => r.id === id).label)
  const { links } = PROFILE

  return (
    <Screen>
      <Reveal>
        <Eyebrow>Step 3 of 3 // Fit report</Eyebrow>
      </Reveal>
      <Reveal className="mt-3">
        <Title>{role ? `Why I fit ${role.fitWord}` : GENERAL_FIT.title}</Title>
      </Reveal>

      <Reveal className="mt-7">
        <Box title="STATUS">
          <ul className="flex flex-col gap-2.5 text-[14px] leading-snug">
            {fit.proof.map((p) => (
              <li key={p} className="flex gap-2">
                <span className="text-ok">[✓]</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </Box>
      </Reveal>

      <Reveal className="mt-7">
        <Box title="PROOF OF WORK">
          <ul className="flex flex-col gap-3">
            {fit.projects.map((key) => (
              <li key={key}>
                <b className="block text-[14px] uppercase">{'>'} {PROJECTS[key].name}</b>
                <span className="dim mt-0.5 block pl-4 text-[12.5px] leading-snug">{PROJECTS[key].desc}</span>
              </li>
            ))}
          </ul>
        </Box>
      </Reveal>

      <Reveal className="mt-5 flex flex-wrap gap-x-2 gap-y-1.5 text-[12px] uppercase">
        {fit.skills.map((s) => (
          <span key={s} className="text-(--accent)/85">
            [{s}]
          </span>
        ))}
        {others.length > 0 && <span className="dim">· also cleared: {others.join(', ')}</span>}
      </Reveal>

      <Reveal className="mt-6 grid grid-cols-2 gap-2">
        <Button variant="ghost" size="sm" href={links.resume} target="_blank" rel="noopener">résumé.pdf</Button>
        <Button variant="ghost" size="sm" href={links.linkedin} target="_blank" rel="noopener">linkedin</Button>
        <Button variant="ghost" size="sm" href={links.github} target="_blank" rel="noopener">github</Button>
        <Button variant="ghost" size="sm" href={`mailto:${links.email}`}>email</Button>
      </Reveal>

      <Reveal className="mt-7">
        <Button onClick={onConnect}>Stay in touch</Button>
      </Reveal>
      <Button variant="menu" size="sm" onClick={onBack} className="mt-1 justify-center">
        Explore another role
      </Button>
    </Screen>
  )
}
