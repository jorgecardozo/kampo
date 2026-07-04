// Libraries
import React from 'react'

// Components
import { Button } from 'components/Button'
import {
  TextBody,
  TextBodySm,
  TextBodyXs,
  TextHeadingH4,
} from 'components/Text'
import Table from 'components/Table'
import GrayBox from 'components/Graybox'
import Loader from 'components/Loader'
import Search from 'components/Table/components/Search'
import Pagination from 'components/Table/components/Pagination'
import Cards from 'components/Cards'

// Types
import { PerfilTemplateProps } from './Perfil.types'
import { TextInput } from 'components/TextInput'
import Modal from 'components/Modal'
import { NumberInput } from 'components/NumberInput'

// Utils
import {
  COLORS,
  DOCUMENT_MAX_VALUE,
  DOCUMENT_MIN_VALUE,
} from 'lib/utils/constants'
import { Select } from 'components/Select'
import Dropdown from 'components/Dropdown'
import { paths } from 'lib/utils/paths'

const PerfilViewTemplate = ({
  usuario,
  disabled,
  isLoading,
  errors,
  control,
  register,
  handleSubmit,
  editarUsuarioHandler,
}: PerfilTemplateProps) => {
  return (
    <div className="md:h-full flex flex-col grow">
      <div>
        <TextHeadingH4>{paths.perfil.title}</TextHeadingH4>
        <div className="my-2 w-full p-[1px] bg-main-500"></div>
      </div>

      <form
        autoComplete="off"
        className="md:flex md:flex-col justify-between md:m-6 mx-6 md:h-full md:flex-1"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-7">
          <TextInput
            register={register}
            name="nombre"
            label="Nombre "
            rules={{
              required: 'Este campo es requerido.',
            }}
            errors={errors}
            disabled={isLoading}
          />
          <TextInput
            register={register}
            name="apellido"
            label="Apellido "
            rules={{
              required: 'Este campo es requerido.',
            }}
            errors={errors}
            disabled={isLoading}
          />
          <TextInput
            register={register}
            name="email"
            label="Email "
            rules={{
              required: 'Este campo es requerido.',
            }}
            errors={errors}
            disabled={isLoading}
          />

          <NumberInput
            control={control}
            name="dni"
            label="DNI"
            placeholder="XX.XXX.XXX"
            thousandSeparator={'.'}
            errors={errors}
            disabled={isLoading}
            isAllowed={({ floatValue, value }) => {
              return floatValue < DOCUMENT_MAX_VALUE || value === ''
            }}
            // rules={{
            //   // required: 'Este campo es requerido.',
            //   minLength: {
            //     value: DOCUMENT_MIN_VALUE,
            //     message: 'Este campo no puede tener menos de 7 cifras.',
            //   },
            //   maxLength: {
            //     value: DOCUMENT_MAX_VALUE,
            //     message: 'Este campo no puede tener más de 8 cifras.',
            //   },
            // }}
            // rules={{
            //   validate: (value) => {
            //     if (!value) return true
            //     const stringValue = value.toString()
            //     if (stringValue.length < DOCUMENT_MIN_VALUE) {
            //       return 'Este campo no puede tener menos de 7 cifras.'
            //     }
            //     if (stringValue.length > DOCUMENT_MAX_VALUE) {
            //       return 'Este campo no puede tener más de 8 cifras.'
            //     }
            //     return true
            //   },
            // }}
          />

          <TextInput
            register={register}
            rules={{
              required: 'Este campo es requerido.',
            }}
            name="telefono"
            label="Teléfono"
            errors={errors}
            disabled={isLoading}
          />

          <TextInput
            register={register}
            name="direccion"
            label="Dirección"
            errors={errors}
            disabled={isLoading}
            rules={{
              required: 'Este campo es requerido.',
            }}
          />
        </div>

        <div className="md:flex md:justify-end md:mt-4 mt-4">
          <Button
            className="w-full md:!w-60"
            type="submit"
            variant="primary"
            disabled={disabled}
            loading={isLoading}
            onClick={handleSubmit(editarUsuarioHandler)}
          >
            <TextBodyXs className="font-bold">Editar</TextBodyXs>
          </Button>
        </div>
      </form>
    </div>
  )
}

export default PerfilViewTemplate
