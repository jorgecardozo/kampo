import Select from 'react-select'

export type SelectOption = { value: string; label: string }

type Props = {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  isSearchable?: boolean
  className?: string
}

// Selector de opciones basado en react-select (mismo motor que usaba el proyecto
// original), en modo `unstyled` + Tailwind para respetar el theme y el dark mode.
export const FilterSelect = ({
  value,
  onChange,
  options,
  placeholder = 'Seleccionar…',
  isSearchable = false,
  className = '',
}: Props) => {
  const selected = options.find((o) => o.value === value) ?? null

  return (
    <Select<SelectOption>
      unstyled
      isSearchable={isSearchable}
      placeholder={placeholder}
      value={selected}
      onChange={(opt) => onChange((opt as SelectOption | null)?.value ?? '')}
      options={options}
      menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      classNames={{
        container: () => `w-full text-sm ${className}`,
        control: ({ isFocused }) =>
          `min-h-[38px] rounded-lg border bg-white dark:bg-gray-900 px-3 cursor-pointer transition-colors ${
            isFocused
              ? 'border-main-500 ring-1 ring-main-500'
              : 'border-gray-300 dark:border-gray-600'
          }`,
        valueContainer: () => 'gap-1',
        placeholder: () => 'text-gray-400',
        singleValue: () => 'text-gray-800 dark:text-white',
        input: () => 'text-gray-800 dark:text-white',
        indicatorsContainer: () => 'text-gray-400',
        dropdownIndicator: () => 'px-1',
        clearIndicator: () => 'px-1',
        indicatorSeparator: () => 'hidden',
        menu: () =>
          'mt-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg overflow-hidden',
        menuList: () => 'py-1',
        option: ({ isFocused, isSelected }) =>
          `px-3 py-2 cursor-pointer text-sm ${
            isSelected
              ? 'bg-main-600 text-white'
              : isFocused
                ? 'bg-main-50 dark:bg-gray-700 text-gray-800 dark:text-white'
                : 'text-gray-700 dark:text-gray-200'
          }`,
        noOptionsMessage: () => 'px-3 py-2 text-gray-400',
      }}
    />
  )
}

export default FilterSelect
