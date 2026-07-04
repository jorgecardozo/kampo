import Select from 'react-select'
import { useController } from 'react-hook-form'
import { SelectProps } from './Select.types'
import { getCustomStyles } from './Select.styles'

export const SelectTemplate = ({
  isInput = true,
  name,
  control,
  children,
  placeholder,
  options,
  rules,
  errors,
  isSearchable = true,
  isDisabled = false,
  optionLabel = 'label',
  optionValue = 'value',
  handleChange,
  defaultValue,
  inputHeight = 'default',
}: SelectProps) => {
  const { field } = useController({
    name,
    control,
    rules,
  })
  const errorMessage = errors && errors[name]
  const hasError = !!(errors && errorMessage)

  // const customStyles = {
  //   option: (provided, state) => ({
  //     ...provided,
  //     color: state.isSelected ? '#131313' : '#73A4B9',
  //     fontSize: '16px',
  //     backgroundColor: state.isFocused ? '#F0F6FA' : 'transparent',
  //     cursor: state.isDisabled ? 'not-allowed' : 'default',
  //     opacity: state.isDisabled ? 0.5 : 1,
  //     '&:hover': {
  //       backgroundColor: '#F0F6FA',
  //     },
  //   }),
  //   menuList: (provided) => ({ padding: isInput ? provided.padding : 0 }),
  //   menu: (provided) => ({
  //     ...provided,
  //     zIndex: 20,
  //     textAlign: 'left',
  //     borderRadius: isInput ? provided.borderRadius : '20px',
  //     overflow: isInput ? provided.overflow : 'hidden',
  //   }),
  //   indicatorSeparator: (provided) => ({
  //     ...provided,
  //     backgroundColor: 'none',
  //   }),
  //   dropdownIndicator: (styles, state) => ({
  //     ...styles,
  //     color: '#EC0000',
  //     transform: state.isFocused && 'rotate(180deg)',
  //     transition: 'all 0.3s ease-out',
  //     '&:hover': {
  //       color: state.isFocused && '#6395AA',
  //     },
  //   }),
  //   control: (styles) => ({
  //     ...styles,
  //     backgroundColor: 'transparent',
  //     border: '1px solid #EC0000',
  //     padding: '2px',
  //     borderRadius: isInput ? '0.375rem' : '1.5rem',
  //     '&:hover': {
  //       border: '1px solid #EC0000',
  //     },
  //     paddingTop: isInput ? '4px' : styles.paddingTop,
  //     paddingBottom: isInput ? '3px' : styles.paddingBottom,
  //     textAlign: 'left',
  //     height: isInput ? '47px' : styles.height,
  //   }),
  //   singleValue: (provided, state) => {
  //     const opacity = state.isDisabled ? 0.5 : 1
  //     const transition = 'opacity 300ms'

  //     return { ...provided, opacity, transition, fontSize: '16px' }
  //   },
  //   placeholder: (provided) => ({
  //     ...provided,
  //     fontSize: '16px',
  //     textAlign: 'left',
  //   }),
  // }

  if (handleChange) {
    field.onChange = handleChange
  }

  // Convertir field.value a objeto de opción para react-select
  const selectedValue = field.value
    ? options.find((opt) => opt[optionValue] === field.value)
    : defaultValue

  return (
    <div className="relative">
      <label
        htmlFor={name}
        className={`absolute -top-2.5 ${isInput ? 'left-3' : 'left-1/2 -translate-x-1/2'
          } ${isDisabled ? 'text-disabled' : 'text-black'} z-10 bg-white px-1 text-xs`}
      >
        {children}
      </label>
      <Select
        id={field.name}
        instanceId={field.name}
        placeholder={placeholder}
        value={selectedValue}
        options={options}
        isOptionDisabled={(option) => option.disabled}
        onChange={field.onChange}
        name={field.name}
        styles={getCustomStyles(inputHeight)}
        isSearchable={isSearchable}
        isDisabled={isDisabled}
        getOptionLabel={(option) => `${option[optionLabel]}`}
        getOptionValue={(option) => `${option[optionValue]}`}
      />
      {hasError && isInput && (
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
