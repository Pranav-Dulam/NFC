import * as m from 'motion/react-m'
import { sfx } from '../lib/sound'

/**
 * Game-menu style button.
 * - primary: solid phosphor block (the main action on a screen)
 * - menu:    text with a ▸ cursor that appears on hover / focus / press
 * - ghost:   outlined, used for small actions inside demos
 * Pass `href` to render a link instead of a button.
 */
const VARIANTS = {
  primary:
    'bg-(--accent) text-[#030603] font-bold shadow-[4px_4px_0_0_color-mix(in_srgb,var(--accent)_35%,transparent)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
  menu: 'text-(--accent) hover:bg-(--accent)/10 focus-visible:bg-(--accent)/10',
  ghost: 'border border-(--accent)/60 text-(--accent) hover:bg-(--accent)/10',
}
const SIZES = {
  lg: 'min-h-14 px-4 text-[15px]',
  sm: 'min-h-11 px-3 text-[13px]',
}

export default function Button({ variant = 'primary', size = 'lg', href, className = '', onClick, children, ...props }) {
  const cls = `group inline-flex w-full items-center justify-center gap-2 uppercase tracking-wide transition-colors
    disabled:pointer-events-none disabled:opacity-30 ${SIZES[size]} ${VARIANTS[variant]} ${className}`

  const handleClick = (e) => {
    sfx.select()
    onClick?.(e)
  }

  const content = (
    <>
      {variant !== 'primary' && (
        <span className="w-3 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 group-active:opacity-100">
          ▸
        </span>
      )}
      {variant === 'primary' && <span>▸</span>}
      {children}
    </>
  )

  if (href) {
    return (
      <m.a href={href} whileTap={{ scale: 0.98 }} className={cls} onClick={handleClick} {...props}>
        {content}
      </m.a>
    )
  }
  return (
    <m.button type="button" whileTap={{ scale: 0.98 }} className={cls} onClick={handleClick} {...props}>
      {content}
    </m.button>
  )
}
