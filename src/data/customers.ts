import type { Customer } from './types'

export const CUSTOMERS: readonly Customer[] = [
  { id: 'c-01', name: 'Northwind Goods', contact: 'Elena Marsh', plan: 'Scale', mrr: 4200, seats: 48, renewal: '2027-03-01', status: 'active' },
  { id: 'c-02', name: 'Brightline Health', contact: 'Omar Haddad', plan: 'Growth', mrr: 2150, seats: 22, renewal: '2026-12-15', status: 'at-risk' },
  { id: 'c-03', name: 'Atlas Freight', contact: 'Jonas Lindqvist', plan: 'Scale', mrr: 5100, seats: 61, renewal: '2027-01-20', status: 'at-risk' },
  { id: 'c-04', name: 'Juniper Studio', contact: 'Ada Whitfield', plan: 'Starter', mrr: 490, seats: 6, renewal: '2026-11-30', status: 'active' },
  { id: 'c-05', name: 'Meridian Capital', contact: 'Rafael Costa', plan: 'Scale', mrr: 6300, seats: 74, renewal: '2027-02-10', status: 'active' },
  { id: 'c-06', name: 'Lumen Retail', contact: 'Sofia Brandt', plan: 'Growth', mrr: 1890, seats: 19, renewal: '2026-11-18', status: 'active' },
  { id: 'c-07', name: 'Harbor Logistics', contact: 'Kwame Mensah', plan: 'Growth', mrr: 2400, seats: 27, renewal: '2027-04-05', status: 'active' },
  { id: 'c-08', name: 'Fernwood Stays', contact: 'Isla Fraser', plan: 'Starter', mrr: 620, seats: 8, renewal: '2026-11-08', status: 'trial' },
  { id: 'c-09', name: 'Quartz Software', contact: 'Mei Tanaka', plan: 'Growth', mrr: 2780, seats: 31, renewal: '2027-01-12', status: 'active' },
  { id: 'c-10', name: 'Tidewater Marine', contact: 'Callum Reid', plan: 'Growth', mrr: 1960, seats: 20, renewal: '2026-12-02', status: 'at-risk' },
  { id: 'c-11', name: 'Orchard Foods', contact: 'Noor Rahman', plan: 'Scale', mrr: 4700, seats: 55, renewal: '2027-05-22', status: 'active' },
  { id: 'c-12', name: 'Saffron Kitchens', contact: 'Lucia Moretti', plan: 'Starter', mrr: 540, seats: 7, renewal: '2026-11-25', status: 'trial' },
  { id: 'c-13', name: 'Vantage Labs', contact: 'Ibrahim Yusuf', plan: 'Growth', mrr: 2230, seats: 24, renewal: '2027-02-28', status: 'active' },
  { id: 'c-14', name: 'Copperfield Legal', contact: 'Grace Albright', plan: 'Starter', mrr: 410, seats: 5, renewal: '2026-12-20', status: 'active' },
  { id: 'c-15', name: 'Redwood Education', contact: 'Tariq Aziz', plan: 'Growth', mrr: 1740, seats: 18, renewal: '2027-03-17', status: 'active' },
  { id: 'c-16', name: 'Skyline Realty', contact: 'Beatriz Santos', plan: 'Starter', mrr: 380, seats: 4, renewal: '2026-11-14', status: 'at-risk' },
  { id: 'c-17', name: 'Pioneer Energy', contact: 'Magnus Berg', plan: 'Scale', mrr: 5480, seats: 66, renewal: '2027-06-01', status: 'active' },
  { id: 'c-18', name: 'Ember Coffee Co.', contact: 'Yara Khoury', plan: 'Starter', mrr: 450, seats: 6, renewal: '2026-12-09', status: 'trial' },
  { id: 'c-19', name: 'Silverline Transit', contact: 'Daria Novak', plan: 'Growth', mrr: 2060, seats: 23, renewal: '2027-01-30', status: 'active' },
  { id: 'c-20', name: 'Kestrel Aerospace', contact: 'Noah Fischer', plan: 'Scale', mrr: 4950, seats: 58, renewal: '2027-04-18', status: 'active' },
  { id: 'c-21', name: 'Willow & Pine', contact: 'Hannah Cole', plan: 'Starter', mrr: 360, seats: 4, renewal: '2026-11-21', status: 'active' },
  { id: 'c-22', name: 'Cobalt Security', contact: 'Zain Malik', plan: 'Growth', mrr: 2510, seats: 29, renewal: '2027-02-04', status: 'active' },
  { id: 'c-23', name: 'Marigold Pharmacy', contact: 'Chloe Dubois', plan: 'Growth', mrr: 1620, seats: 16, renewal: '2026-12-27', status: 'at-risk' },
  { id: 'c-24', name: 'Basalt Construction', contact: 'Viktor Horvat', plan: 'Starter', mrr: 520, seats: 9, renewal: '2027-01-08', status: 'active' },
]

export const PLAN_OPTIONS = ['Starter', 'Growth', 'Scale'] as const
export const CUSTOMER_STATUS_LABELS = { active: 'Active', trial: 'Trial', 'at-risk': 'At risk' } as const
