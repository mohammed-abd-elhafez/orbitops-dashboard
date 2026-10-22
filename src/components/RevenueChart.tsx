import { Table2, LineChart } from 'lucide-react'
import { useId, useState } from 'react'
import type { RevenuePoint } from '../data/types'
import { formatCurrency } from '../lib/format'

const W = 640
const H = 260
const PAD = { top: 16, right: 16, bottom: 32, left: 64 }

export function summarizeRevenue(points: readonly RevenuePoint[]): string {
  if (points.length < 2) return 'Not enough data points to describe a trend.'
  const first = points[0]
  const last = points[points.length - 1]
  const change = ((last.value - first.value) / first.value) * 100
  const peak = points.reduce((a, b) => (b.value > a.value ? b : a))
  const direction = change >= 0 ? 'rose' : 'fell'
  return `Monthly recurring revenue ${direction} ${Math.abs(change).toFixed(1)}% from ${formatCurrency(first.value)} on ${first.label} to ${formatCurrency(last.value)} on ${last.label}. The highest value was ${formatCurrency(peak.value)} on ${peak.label}.`
}

function ChartTooltip({ point, cx, cy }: { point: RevenuePoint; cx: number; cy: number }) {
  const text = `${point.label} · ${formatCurrency(point.value)}`
  const width = 8 * text.length + 16
  // Keep the box inside the plot area near either edge.
  const left = Math.min(Math.max(cx - width / 2, PAD.left), W - PAD.right - width)
  const top = cy - 42 < 0 ? cy + 12 : cy - 42
  return (
    <g pointerEvents="none" aria-hidden="true">
      <rect x={left} y={top} width={width} height={28} rx={6} fill="var(--text)" />
      <text x={left + width / 2} y={top + 18} textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--surface)" fontFamily="var(--font-sans)">{text}</text>
    </g>
  )
}

export function RevenueChart({ points }: { points: readonly RevenuePoint[] }) {
  const [showTable, setShowTable] = useState(false)
  const [active, setActive] = useState<number | null>(null)
  const uid = useId()
  const summaryId = `${uid}-summary`
  const tableId = `${uid}-table`

  const values = points.map((p) => p.value)
  const min = Math.floor(Math.min(...values) / 1000) * 1000
  const max = Math.ceil(Math.max(...values) / 1000) * 1000
  const span = Math.max(max - min, 1)
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const x = (i: number) => PAD.left + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW)
  const y = (v: number) => PAD.top + innerH - ((v - min) / span) * innerH

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ')
  const area = `${line} L${x(points.length - 1).toFixed(1)},${PAD.top + innerH} L${x(0).toFixed(1)},${PAD.top + innerH} Z`
  const gridValues = [0, 1, 2, 3].map((i) => min + (span * i) / 3)

  return (
    <div className="chart">
      <p id={summaryId} className="chart__summary">{summarizeRevenue(points)}</p>

      {showTable ? (
        <div className="table-wrap" id={tableId}>
          <table className="table">
            <caption className="sr-only">Monthly recurring revenue by date</caption>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col" className="num">MRR</th>
              </tr>
            </thead>
            <tbody>
              {points.map((p) => (
                <tr key={p.label}>
                  <th scope="row" style={{ textTransform: 'none', letterSpacing: 0, fontSize: 'inherit', color: 'var(--text)' }}>{p.label}</th>
                  <td className="num">{formatCurrency(p.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Line chart of monthly recurring revenue" aria-describedby={summaryId} id={tableId}>
          {gridValues.map((v) => (
            <g key={v}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(v)} y2={y(v)} stroke="var(--chart-grid)" strokeWidth="1" />
              <text className="chart__tick" x={PAD.left - 8} y={y(v) + 4} textAnchor="end">{`$${Math.round(v / 1000)}k`}</text>
            </g>
          ))}
          <path className="chart__area" d={area} fill="var(--chart-fill)" />
          <path d={line} fill="none" stroke="var(--chart-line)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          {points.map((p, i) => (
            <g key={p.label}>
              {(points.length <= 8 || i % 2 === 0) && (
                <text className="chart__tick" x={x(i)} y={H - 8} textAnchor={i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle'}>{p.label}</text>
              )}
            </g>
          ))}
          {active !== null && <ChartTooltip point={points[active]} cx={x(active)} cy={y(points[active].value)} />}
          {/* Points are focusable so the tooltip is reachable by keyboard as well as hover. */}
          {points.map((p, i) => (
            <circle
              key={p.label}
              className="chart__point"
              cx={x(i)}
              cy={y(p.value)}
              r={active === i ? 6 : 4}
              fill="var(--surface)"
              stroke="var(--chart-line)"
              strokeWidth="2"
              tabIndex={0}
              role="img"
              aria-label={`${p.label}: ${formatCurrency(p.value)}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            />
          ))}
        </svg>
      )}

      <div className="chart__actions">
        <button type="button" className="btn btn--sm" aria-pressed={showTable} aria-controls={tableId} onClick={() => setShowTable((v) => !v)}>
          {showTable ? <LineChart size={16} aria-hidden="true" /> : <Table2 size={16} aria-hidden="true" />}
          {showTable ? 'View as chart' : 'View as table'}
        </button>
      </div>
    </div>
  )
}
