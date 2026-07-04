// Libraries
import dynamic from 'next/dynamic'

// Interfaces
import { DynamicDropdownProps } from './DynamicDropdown.types'

const Select = dynamic(() => import('react-select'), { ssr: false })

export const DynamicDropdownTemplate = ({
  disabled = false,
  width = 'auto',
  placeHolder = 'sin titulo',
  color,
  backgroundColor,
  disabledBackgroundColor = '#E8E8E8',
  disabledColor = '#AAB4BD',
  fontWeight = 'normal',
  options,
  selectedOption,
  loading = false,
  onSelectOption,
}: DynamicDropdownProps) => {
  const customStyles = {
    /* eslint-disable indent */
    control: (provided, state) => ({
      ...provided,
      width: width,
      padding: '2px',
      borderRadius: '1.5rem',
      backgroundColor: state.isFocused
        ? backgroundColor
        : disabled || loading
        ? disabledBackgroundColor
        : backgroundColor,
      borderColor: state.isFocused
        ? backgroundColor
        : disabled || loading
        ? disabledBackgroundColor
        : backgroundColor,
      color: color,
      cursor: disabled ? 'not-allowed' : 'pointer',
    }),
    /* eslint-enable indent */
    dropdownIndicator: (provided) => ({
      ...provided,
      color: color,
      ':hover': {
        color: color,
      },
    }),
    menu: (provided) => ({
      ...provided,
      // borderRadius: '1.5rem',
      border: '1px solid #0dbfbf',
      borderRadius: '20px',
      marginTop: '5px',
      overflow: 'hidden',
      zIndex: 99,
    }),
    menuList: (provided) => ({ padding: 0 }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? backgroundColor : color,
      color: state.isSelected ? color : '#718096',
      borderColor: backgroundColor,
      ':hover': {
        backgroundColor: state.isSelected ? backgroundColor : '#cafdf8',
        color: state.isSelected ? color : '#0b757a',
      },
      width: 'auto',
      borderBottom: '1px solid #0dbfbf',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: disabled || loading ? disabledColor : color,
      fontWeight: fontWeight,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: color,
      fontWeight: fontWeight,
    }),
  }

  return (
    <div>
      <Select
        options={options}
        value={selectedOption}
        onChange={onSelectOption}
        placeholder={placeHolder}
        styles={customStyles}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: backgroundColor,
            primary25: backgroundColor,
          },
        })}
        isDisabled={disabled || loading}
        isLoading={loading}
        isSearchable={false}
      />
    </div>
  )
}
