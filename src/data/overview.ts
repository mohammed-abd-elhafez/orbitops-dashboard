import type { Metric, OverviewData, RangeKey, RevenuePoint } from './types'

export const RANGE_OPTIONS: ReadonlyArray<{ key: RangeKey; label: string; description: string }> = [
  { key: '7d', label: '7 days', description: 'Oct 16 – Oct 22, 2026' },
  { key: '30d', label: '30 days', description: 'Sep 23 – Oct 22, 2026' },
  { key: '90d', label: '90 days', description: 'Jul 25 – Oct 22, 2026' },
]

const metricsByRange: Record<RangeKey, Metric[]> = {
  '7d': [
    { id: 'mrr', label: 'Monthly recurring revenue', value: '$48,200', delta: '+0.9% vs previous 7 days', trend: 'up', favourable: true },
    { id: 'projects', label: 'Active projects', value: '23', delta: '+1 vs previous 7 days', trend: 'up', favourable: true },
    { id: 'support', label: 'Open support items', value: '31', delta: '+6 vs previous 7 days', trend: 'up', favourable: false },
    { id: 'csat', label: 'Customer satisfaction', value: '4.6 / 5', delta: 'No change', trend: 'flat', favourable: true },
  ],
  '30d': [
    { id: 'mrr', label: 'Monthly recurring revenue', value: '$48,200', delta: '+4.2% vs previous 30 days', trend: 'up', favourable: true },
    { id: 'projects', label: 'Active projects', value: '23', delta: '+3 vs previous 30 days', trend: 'up', favourable: true },
    { id: 'support', label: 'Open support items', value: '31', delta: '-8 vs previous 30 days', trend: 'down', favourable: true },
    { id: 'csat', label: 'Customer satisfaction', value: '4.6 / 5', delta: '+0.2 vs previous 30 days', trend: 'up', favourable: true },
  ],
  '90d': [
    { id: 'mrr', label: 'Monthly recurring revenue', value: '$48,200', delta: '+11.8% vs previous 90 days', trend: 'up', favourable: true },
    { id: 'projects', label: 'Active projects', value: '23', delta: '+7 vs previous 90 days', trend: 'up', favourable: true },
    { id: 'support', label: 'Open support items', value: '31', delta: '+4 vs previous 90 days', trend: 'up', favourable: false },
    { id: 'csat', label: 'Customer satisfaction', value: '4.6 / 5', delta: '-0.1 vs previous 90 days', trend: 'down', favourable: false },
  ],
}

const series = (labels: string[], values: number[]): RevenuePoint[] =>
  labels.map((label, i) => ({ label, value: values[i] }))

const revenueByRange: Record<RangeKey, RevenuePoint[]> = {
  '7d': series(
    ['Oct 16', 'Oct 17', 'Oct 18', 'Oct 19', 'Oct 20', 'Oct 21', 'Oct 22'],
    [47760, 47810, 47940, 47980, 48050, 48120, 48200],
  ),
  '30d': series(
    ['Sep 23', 'Sep 27', 'Oct 1', 'Oct 5', 'Oct 9', 'Oct 13', 'Oct 17', 'Oct 22'],
    [46250, 46700, 46980, 47300, 47620, 47710, 47980, 48200],
  ),
  '90d': series(
    ['Jul 25', 'Aug 8', 'Aug 22', 'Sep 5', 'Sep 19', 'Oct 3', 'Oct 22'],
    [43100, 43900, 44800, 45400, 46100, 47100, 48200],
  ),
}

export function getOverview(range: RangeKey): OverviewData {
  const option = RANGE_OPTIONS.find((r) => r.key === range) ?? RANGE_OPTIONS[1]
  return { rangeLabel: option.description, metrics: metricsByRange[range], revenue: revenueByRange[range] }
}

export const EMPTY_OVERVIEW: OverviewData = { rangeLabel: '', metrics: [], revenue: [] }
