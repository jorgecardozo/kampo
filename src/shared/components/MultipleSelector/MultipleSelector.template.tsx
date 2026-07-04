// Libraries
import Select, { MultiValue } from 'react-select'
import { useController } from 'react-hook-form'

// types
import { MultipleSelectorProps } from './MultipleSelector.types'

export const MultipleSelectorTemplate = ({
  name,
  children,
  placeholder,
  options,
  selectedOption,
  isDisabled,
  isLoading,
  isSearchable,
  isMulti,
  closeMenuOnSelect,
  hideSelectedOptions,
  rules,
  control,
  errors,
  onSelectOption,
}: MultipleSelectorProps) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      overflowY: 'auto',
      border: '1px solid #B2D2DF',
      '&:hover': {
        border: '1px solid #B2D2DF',
      },
      borderRadius: '0.375rem',
      display: 'flex',
      flexWrap: 'wrap',
      minHeight: '48px',
      maxHeight: '300px',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#73A4B9' : 'transparent',
      color: state.isSelected ? 'white' : '#73A4B9',
      '&:hover': {
        backgroundColor: state.isSelected ? '#5D8A9E' : '#F0F6FA',
      },
    }),
    dropdownIndicator: (styles, state) => ({
      ...styles,
      color: state.isFocused ? '#6395AA' : '#73A4B9',
      transform: state.isFocused && 'rotate(180deg)',
      transition: 'all 0.3s ease-out',
      '&:hover': {
        color: state.isFocused && '#6395AA',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: '14px',
      textAlign: 'left',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'white',
      backgroundColor: '#6395AA',
      borderRadius: '0.375rem 0 0 0.375rem',
      whiteSpace: 'nowrap',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      backgroundColor: '#CBCFD4',
      borderRadius: '0 0.375rem 0.375rem 0',
    }),
    multiValue: (provided) => ({
      ...provided,
      borderRadius: '0.375rem 0.375rem 0.375rem 0.375rem',
      whiteSpace: 'nowrap',
      maxWidth: '100%',
    }),
  }

  const { field } = useController({
    name,
    control,
    rules,
  })
  const errorMessage = errors && errors[name]
  const hasError = !!(errors && errorMessage)

  const handleChange = (selected: MultiValue<any>) => {
    field.onChange(selected)
    if (onSelectOption) {
      onSelectOption(selected)
    }
  }

  return (
    <div className="relative">
      <label
        htmlFor={name}
        className="absolute -top-2 left-3 z-10 bg-white px-1 text-xs text-input"
      >
        {children}
      </label>
      <Select
        id={field.name}
        instanceId={field.name}
        placeholder={placeholder}
        options={options}
        value={selectedOption}
        isOptionDisabled={(option) => option.disabled}
        isSearchable={isSearchable}
        isMulti={isMulti}
        closeMenuOnSelect={closeMenuOnSelect}
        hideSelectedOptions={hideSelectedOptions}
        name={field.name}
        styles={customStyles}
        isLoading={isLoading}
        isDisabled={isDisabled}
        onChange={handleChange}
        {...field}
      />
      {hasError && (
        <p className="absolute mt-1 text-xs text-error">
          {errorMessage && (
            <>
              {typeof errorMessage === 'string'
                ? errorMessage
                : errorMessage?.message}
            </>
          )}
        </p>
      )}
    </div>
  )
}
