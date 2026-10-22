export function Progress({ value, label }: { value: number; label: string }) {
  return (
    <div className="progress">
      <progress className="progress__bar" value={value} max={100} aria-label={`${label} progress`} />
      <span className="num">{value}%</span>
    </div>
  )
}
