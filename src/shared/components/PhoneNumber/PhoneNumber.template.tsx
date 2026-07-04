import { useController } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { PhoneNumberProps } from './PhoneNumber.types'
import clsx from 'clsx'

import {
  INVALID_PHONE_NUMBERS,
  PHONE_MIN_LENGTH,
  PHONE_MAX_LENGTH,
  CODE_MIN_LENGTH,
  CODE_MAX_LENGTH,
  PHONE_NUMBER_LENGTH_VALID,
  isNumber,
} from 'lib/utils/constants'
import { useEffect, useState } from 'react'

export const PhoneNumberTemplate = ({
  control,
  disabled = false,
  labelPhone = 'Teléfono',
  labelCode = 'Cod. área',
}: PhoneNumberProps) => {
  const [errorNumber, setErrorNumber] = useState(false)
  const { field: phoneField } = useController({
    control,
    name: 'cellPhone.number',
    rules: {
      required: 'Este campo es requerido.',
      minLength: {
        value: PHONE_MIN_LENGTH,
        message: `No pueden ser menos de ${PHONE_MIN_LENGTH} caracteres.`,
      },
      maxLength: {
        value: PHONE_MAX_LENGTH,
        message: `No pueden ser más de ${PHONE_MAX_LENGTH} caracteres.`,
      },
      validate: {
        validNumber: (v) =>
          (!INVALID_PHONE_NUMBERS.includes(v) && !errorNumber) ||
          'Número inválido',
      },
    },
  })
  const { field: codeField } = useController({
    control,
    name: 'cellPhone.area_code',
    rules: {
      required: 'Requerido.',
      minLength: {
        value: CODE_MIN_LENGTH,
        message: 'Código inválido',
      },
      maxLength: {
        value: CODE_MAX_LENGTH,
        message: 'Código inválido',
      },
      validate: {
        validNumber: () => !errorNumber,
      },
    },
  })

  useEffect(() => {
    if (phoneField.value && codeField.value) {
      setErrorNumber(
        phoneField.value?.length + codeField.value?.length !==
          PHONE_NUMBER_LENGTH_VALID || !isNumber.test(codeField.value)
      )
    }
  }, [phoneField.value, codeField.value])

  const renderLabel = (label: string) => (
    <label
      htmlFor="code"
      className="absolute -top-2 left-3 h-4 overflow-hidden bg-white px-1 text-xs text-input"
    >
      {label}
    </label>
  )
  const renderError = (message: string) => (
    <p className="absolute mt-1 text-xs text-error">{message}</p>
  )
  return (
    <>
      <div className="grid grid-cols-3 gap-x-4">
        <div className="relative">
          {renderLabel(labelCode)}
          <input
            className={clsx(
              'block w-full rounded-md border p-3 text-sm leading-3 text-black focus:outline-focus',
              disabled
                ? 'border-gray-400 placeholder:opacity-90'
                : 'placeholder:text-input-placeholder border-input-border'
            )}
            placeholder="Ej. 11"
            id="area_code"
            name="area_code"
            type="tel"
            {...codeField}
            value={codeField.value}
          />
        </div>
        <div className="relative col-span-2 col-start-2">
          {renderLabel(labelPhone)}
          <NumericFormat
            className={clsx(
              'block w-full rounded-md border p-3 text-sm leading-3 text-black focus:outline-focus',
              disabled
                ? 'border-gray-400 placeholder:opacity-90'
                : 'placeholder:text-input-placeholder border-input-border'
            )}
            placeholder="sin el 15"
            id="number"
            name="number"
            type="tel"
            {...phoneField}
          />
        </div>
        <div className="relative col-span-3">
          {errorNumber && renderError('Número de teléfono inválido.')}
        </div>
      </div>
    </>
  )
}