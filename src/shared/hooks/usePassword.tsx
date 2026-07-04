// Libraries
import { Dispatch, SetStateAction, useState } from 'react'

// Utils
import { validatePassword } from 'lib/utils/password'

interface UsePasswordReturn {
  hidePassword: boolean
  setHidePassword: Dispatch<SetStateAction<boolean>>
  hideConfirmPassword: boolean
  setHideConfirmPassword: Dispatch<SetStateAction<boolean>>
  checkPasswordMatch: () => boolean
  isPasswordValid: () => boolean
}

export const usePassword = ({
  password,
  confirmPassword,
}: {
  password: string
  confirmPassword: string
}): UsePasswordReturn => {
  const [hidePassword, setHidePassword] = useState<boolean>(true)
  const [hideConfirmPassword, setHideConfirmPassword] = useState<boolean>(true)

  const checkPasswordMatch = (): boolean =>
    password &&
    password !== '' &&
    confirmPassword &&
    confirmPassword !== '' &&
    password === confirmPassword

  const isPasswordValid = (): boolean => {
    return Boolean(
      checkPasswordMatch() &&
        validatePassword({
          password,
          confirmPassword,
        })
    )
  }

  return {
    hidePassword,
    setHidePassword,
    hideConfirmPassword,
    setHideConfirmPassword,
    checkPasswordMatch,
    isPasswordValid,
  }
}
