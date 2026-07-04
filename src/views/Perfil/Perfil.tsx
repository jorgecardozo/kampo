// Libraries
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'react-toastify'

// Components
import { TextBody, TextBodyXs } from 'components/Text'
import { Button } from 'components/Button'
import { useModalContext } from 'components/Modal'

// Store
import { useActions } from 'store/actions'
import { useSelectors } from 'store/selectors'

// Templates
import PerfilViewTemplate from './Perfil.template'

// Types
import { Header, Item } from './Perfil.types'

// Utils
import {
  isEmptyObject,
  isResponseValid,
  isValidValueDni,
} from 'lib/utils/helpers'
import { getCookie } from 'lib/utils/cookies'

const PerfilView = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingRoles, setIsLoadingRoles] = useState<boolean>(false)
  const [usuarioData, setUsuarioData] = useState(null)

  const { obtenerUsuario, editarUsuario, obtenerRoles, setUserData } =
    useActions()
  const { usuario } = useSelectors()
  const {
    register,
    control,
    formState: { errors, isValid, isDirty },
    handleSubmit,
    reset,
    getValues,
    setValue,
    setError,
    watch,
    trigger,
  } = useForm({ mode: 'onBlur' })
  const dniWatch = useWatch({ control, name: 'dni' })
  const statusSelectorWatch = watch('status_selector')

  const editarPerfilHandler = async () => {
    const nuevoUsuario: any = {
      nombre: getValues('nombre'),
      apellido: getValues('apellido'),
      email: String(getValues('email')),
      dni: getValues('dni'),
      telefono: getValues('telefono'),
      direccion: getValues('direccion'),
    }

    setIsLoading(true)
    const response = await editarUsuario({
      id: usuario.id,
      usuario: nuevoUsuario,
    })
    console.log('rsponse', response)
    if (isResponseValid(response)) {
      setUserData(response.data.usuario)
      toast.success('¡El usuario se ha editado con éxito!', {
        theme: 'colored',
      })
    } else {
      toast.error('¡Ocurrió un error en la edición!', {
        theme: 'colored',
      })
    }
    setIsLoading(false)
  }

  const obtenerUsuarioData = async (id: number) => {
    setIsLoading(true)
    const response = await obtenerUsuario(id)
    console.log('usuarios', response)

    if (!isResponseValid(response)) {
      toast.error('¡Ocurrió un error al obtener el usuario!', {
        theme: 'colored',
      })
    }

    setUsuarioData(response?.data?.usuario)
    setIsLoading(false)
  }

  const obtenerRolesData = async () => {
    setIsLoadingRoles(true)
    const response = await obtenerRoles()

    console.log('roles', response)

    if (!isResponseValid(response)) {
      toast.error('¡Ocurrió un error al obtener los roles!', {
        theme: 'colored',
      })
    }
    setIsLoadingRoles(false)
  }

  useEffect(() => {
    console.log('valor', usuario)
    const userCookie = getCookie('user')

    if (isEmptyObject(usuario) && !isEmptyObject(userCookie)) {
      setUserData(userCookie)
    }

    if (usuario?.id || userCookie?.id) {
      // if (usuario && usuario.id) {
      obtenerUsuarioData(usuario?.id || userCookie?.id)
      // obtenerRolesData()
    }
  }, [])

  useEffect(() => {
    if (usuarioData) {
      console.log('usuarioData', usuarioData)
      setValue('nombre', usuarioData?.nombre)
      setValue('email', usuarioData?.email)
      setValue('apellido', usuarioData?.apellido)
      setValue('dni', usuarioData?.dni)
      setValue('direccion', usuarioData?.direccion)
      setValue('telefono', usuarioData?.telefono)
      trigger('dni')
    }
  }, [usuarioData])

  return (
    <>
      <PerfilViewTemplate
        usuario={usuarioData}
        isLoading={isLoading}
        errors={errors}
        control={control}
        register={register}
        disabled={!isValid || !isDirty}
        handleSubmit={handleSubmit}
        editarUsuarioHandler={editarPerfilHandler}
      />
    </>
  )
}

export default PerfilView
