import { RANGE_OPTIONS } from '../data/overview'
import type { RangeKey } from '../data/types'

interface Props {
  value: RangeKey
  onChange: (value: RangeKey) => void
}

/** Native radios styled as a segmented control: arrow keys and group semantics for free. */
export function DateRangeControl({ value, onChange }: Props) {
  return (
    <fieldset>
      <legend className="sr-only">Date range</legend>
      <div className="segmented">
        {RANGE_OPTIONS.map((option) => (
          <label key={option.key} className="segmented__option">
            <input
              type="radio"
              name="date-range"
              value={option.key}
              checked={value === option.key}
              onChange={() => onChange(option.key)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
