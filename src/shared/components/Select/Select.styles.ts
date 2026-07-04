export const getCustomStyles = (inputHeight?: 'default' | 'lg') => ({
  control: (provided) => ({
    ...provided,
    // overflowY: 'auto',
    backgroundColor: provided.isDisabled ? '#f3f4f6' : '#3d61e0',
    border: provided.isDisabled ? '1px solid #9ca3af' : '1px solid #3d61e0',
    '&:hover': {
      backgroundColor: provided.isDisabled ? '#f3f4f6' : '#2f4db3',
      border: provided.isDisabled ? '1px solid #9ca3af' : '1px solid #2f4db3',
    },
    borderRadius: '0.375rem',
    display: 'flex',
    flexWrap: 'wrap',
    minHeight: inputHeight === 'lg' ? '40px' : '40px',
    maxHeight: '300px',
    borderColor: provided.isFocused ? '#3d61e0' : '#3d61e0',
    boxShadow: provided.isFocused ? '0 0 0 2px rgba(61, 97, 224, 0.2)' : 'none',
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#3d61e0' : 'transparent',
    color: state.isSelected ? 'white' : '#3d61e0',
    fontSize: '14px',
    '&:hover': {
      backgroundColor: state.isSelected ? '#2f4db3' : '#3d61e0',
      color: 'white',
    },
  }),
  dropdownIndicator: (styles, state) => ({
    ...styles,
    color: state.isDisabled ? '#9ca3af' : 'white',
    transform: state.selectProps.menuIsOpen && 'rotate(180deg)',
    transition: 'all 0.3s ease-out',
    '&:hover': {
      color: state.isDisabled ? '#9ca3af' : 'white',
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: '14px',
    textAlign: 'left',
    color: 'white',
  }),
  singleValue: (provided, state) => ({
    ...provided,
    fontSize: '14px',
    opacity: state.isDisabled ? 0.5 : 1,
    color: 'white',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: 'white',
    backgroundColor: '#3d61e0',
    borderRadius: '0.375rem 0 0 0.375rem',
    whiteSpace: 'nowrap',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    backgroundColor: '#CBCFD4',
    borderRadius: '0 0.375rem 0.375rem 0',
    '&:hover': {
      backgroundColor: '#2f4db3',
      color: 'white',
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    borderRadius: '0.375rem 0.375rem 0.375rem 0.375rem',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
  }),
})

// Mantener compatibilidad con el uso anterior
export const customStyles = getCustomStyles()