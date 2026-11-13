// Top status bar: "LVL 2/5 ██░░░" plus the sound toggle slot on the right.
export default function Progress({ index, total = 5, right }) {
  return (
    <div className="fixed inset-x-0 top-0 z-30 mx-auto flex max-w-md items-center justify-between gap-3 bg-[#030603]/85 px-5 pb-2 pt-[max(12px,env(safe-area-inset-top))] font-pixel text-[9px] backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span className="dim">LVL {Math.min(index, total)}/{total}</span>
        <span className="flex gap-[3px]">
          {Array.from({ length: total }, (_, i) => (
            <i
              key={i}
              className={`block h-2.5 w-3 transition-colors duration-300 ${i < index ? 'bg-(--accent)' : 'bg-(--accent)/15'}`}
            />
          ))}
        </span>
      </div>
      {right}
    </div>
  )
}
