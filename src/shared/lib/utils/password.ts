export const UPPERCASE_REGEX = new RegExp('[A-Z]+')
export const LOWERCASE_REGEX = new RegExp('[a-z]+')
export const LENGTH_REGEX = new RegExp('.{8,}')
export const NUMBER_REGEX = new RegExp('[0-9]+')
export const SPECIAL_CHARACTER_REGEX = new RegExp(
  '[!@#$%^&*()_+{}\\[\\]:;<>,.?~\\/-]'
)

export const passwordRules = [
  { label: 'Mínimo 8 caracteres', pattern: LENGTH_REGEX },
  { label: 'Al menos 1 número', pattern: NUMBER_REGEX },
  { label: 'Al menos 1 letra mayúscula', pattern: UPPERCASE_REGEX },
  { label: 'Al menos 1 letra minúscula', pattern: LOWERCASE_REGEX },
  { label: 'Al menos 1 caracter especial', pattern: SPECIAL_CHARACTER_REGEX },
]

const testPasswordStrength = (password) => {
  const hasUppercase = UPPERCASE_REGEX.test(password)
  const hasLowercase = LOWERCASE_REGEX.test(password)
  const hasLength = LENGTH_REGEX.test(password)
  const hasNumber = NUMBER_REGEX.test(password)
  const hasSpecialChar = SPECIAL_CHARACTER_REGEX.test(password)
  return (
    hasUppercase && hasLowercase && hasLength && hasNumber && hasSpecialChar
  )
}

export const validatePassword = ({ password, confirmPassword }) =>
  password !== '' && confirmPassword !== '' && testPasswordStrength(password)
