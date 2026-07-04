export type DateRange = {
  from: Date | null
  to: Date | null
}

export type Preset = {
  label: string
  getValue: () => DateRange
}

export type DateRangePickerProps = {
  value?: DateRange
  onChange: (range: DateRange) => void
  onApply?: (range: DateRange) => void
  onCancel?: () => void
}
