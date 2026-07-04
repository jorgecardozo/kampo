// Libraries
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

// Components
import { TextBody, TextBodyXs } from 'components/Text'
import { Button } from 'components/Button'
import { useModalContext } from 'components/Modal'

// Store
import { useActions } from 'store/actions'
import { useSelectors } from 'store/selectors'

// Templates
import MediosDePagoTemplate from './MediosDePago.template'

// Types
import { Header, Item, MedioDePago } from './MediosDePago.types'

// Utils
import { isEmptyObject, isResponseValid } from 'lib/utils/helpers'
import { getCookie } from 'lib/utils/cookies'

const MediosDePagoView = () => {
  const [isLoadingMediosDePago, setIsLoadingMediosDePago] = useState<boolean>(false)
  const [isLoadingGuardarMedioDePago, setIsLoadingGuardarMedioDePago] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [mediosDePago, setMediosDePago] = useState<MedioDePago[]>([])
  const [items, setItems] = useState<Array<any>>([])
  const [totalPages, setTotalPages] = useState<number | null>(1)
  const [currentPage, setCurrentPage] = useState<number | null>(1)
  const [estadoSelectorId, setEstadoSelectorId] = useState(null)
  const [isLoadingCambiarEstado, setIsLoadingCambiarEstado] = useState({})

  // Estados para modales
  const [mostrarModalCrearEditarMedioDePago, setMostrarModalCrearEditarMedioDePago] = useState<boolean>(false)
  const [medioDePagoSeleccionado, setMedioDePagoSeleccionado] = useState<any>(null)
  const [editandoMedioDePago, setEditandoMedioDePago] = useState<boolean>(false)

  const { setIsOpen, isOpen } = useModalContext()
  const { setUserData, obtenerMediosDePago, crearMedioDePago, editarMedioDePago, cambiarEstadoMedioDePago } = useActions()
  const { usuario } = useSelectors()

  const {
    register,
    control,
    formState: { errors, isValid, isDirty },
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
  } = useForm({ mode: 'onBlur' })

  const nombreWatch = watch('nombre')
  const tipoWatch = watch('tipo')
  const selectorEstadoWatch = watch('selector_estado')

  // Función para generar tipo automáticamente
  const generarTipo = (nombre: string) => {
    return nombre
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '')
  }

  // Efecto para actualizar tipo cuando cambia el nombre
  useEffect(() => {
    if (nombreWatch) {
      const tipoGenerado = generarTipo(nombreWatch)
      setValue('tipo', tipoGenerado)
    } else {
      setValue('tipo', '')
    }
  }, [nombreWatch, editandoMedioDePago, setValue])

  const createItems = (mediosDePago: Array<any>): Array<Item> => {
    return (
      mediosDePago?.map((medioDePago: any) => {
        return {
          nombre: (
            <TextBody className="truncate font-normal md:w-[150px]" title={medioDePago?.nombre}>
              {medioDePago?.nombre}
            </TextBody>
          ),
          tipo: (
            <TextBody className="truncate font-normal md:w-[130px]" title={medioDePago?.tipo}>
              {medioDePago?.tipo}
            </TextBody>
          ),
          estado: (
            <TextBodyXs>
              <span
                className={`inline-flex items-center rounded-md px-2 py-1 font-medium ring-1 ring-inset ${medioDePago?.estado
                  ? 'bg-green-50 text-green-700 ring-green-600/20'
                  : 'bg-red-50 text-red-700 ring-red-600/20'
                  }`}
              >
                {medioDePago?.estado ? 'Activo' : 'Inactivo'}
              </span>
            </TextBodyXs>
          ),
          comision: (
            <TextBody className="truncate font-normal md:w-[100px]" title={`${medioDePago?.comision}%`}>
              {medioDePago?.comision} %
            </TextBody>
          ),
          descuento: (
            <TextBody className="truncate font-normal md:w-[100px]" title={`${medioDePago?.descuento}%`}>
              {medioDePago?.descuento} %
            </TextBody>
          ),
          actions: (
            <div className="flex items-center justify-start gap-1 md:gap-2">
              <Button
                className='w-[110px]'
                onClick={(e) => {
                  e.stopPropagation()
                  setMostrarModalCrearEditarMedioDePago(true)
                  setIsOpen(true)
                  setMedioDePagoSeleccionado(medioDePago)
                  setEditandoMedioDePago(true)
                }}
                variant="black"
              >
                <TextBodyXs className="font-bold">Editar</TextBodyXs>
              </Button>
              <Button
                className='w-[110px]'
                onClick={(e) => {
                  e.stopPropagation()
                  cambiarEstadoHandler(medioDePago)
                }}
                variant={medioDePago.estado === 1 ? "primaryOutline" : "outlineGreen"}
                loading={isLoadingCambiarEstado[medioDePago.id]}
              >
                {medioDePago.estado === 1 ? (
                  <TextBodyXs className="font-bold">Deshabilitar</TextBodyXs>
                ) : (
                  <TextBodyXs className="font-bold">Habilitar</TextBodyXs>
                )}
              </Button>
            </div>
          ),
        }
      }) || []
    )
  }

  const headers: Array<Header> = [
    {
      className: 'justify-start items-center font-bold',
      field: 'nombre',
      type: 'string',
      title: 'NOMBRE',
    },
    {
      className: 'justify-start items-center font-bold',
      field: 'tipo',
      type: 'string',
      title: 'TIPO',
    },
    {
      className: 'justify-start items-center font-bold',
      field: 'estado',
      type: 'string',
      title: 'ESTADO',
    },
    {
      className: 'justify-start items-center font-bold',
      field: 'comision',
      type: 'string',
      title: 'COMISIÓN',
    },
    {
      className: 'justify-start items-center font-bold',
      field: 'descuento',
      type: 'string',
      title: 'DESCUENTO',
    },
    {
      className: 'justify-start font-bold',
      field: 'actions',
      title: 'ACCIONES',
    },
  ]

  const obtenerMediosDePagoData = async ({
    page,
    query = '',
    size = 10,
  }: {
    page: number
    query?: string
    size?: number
  }) => {
    const userCookie = getCookie('user')

    if (isEmptyObject(usuario) && !isEmptyObject(userCookie)) {
      setUserData(userCookie)
    }

    if (usuario?.id || userCookie?.id) {
      setIsLoadingMediosDePago(true)
      setSearchQuery(query)

      console.log("estadoSelectorId", estadoSelectorId)
      const response = await obtenerMediosDePago({
        query: query === null ? searchQuery : query,
        estado: estadoSelectorId,
      })

      if (response?.data) {
        setMediosDePago(response.data)
      }

      setIsLoadingMediosDePago(false)
    }
  }

  const resetHandler = () => {
    reset({
      nombre: '',
      tipo: '',
      comision: '',
      descuento: '',
    })
  }

  const cancelCrearMedioDePagoHandler = () => {
    setMostrarModalCrearEditarMedioDePago(false)
    setIsOpen(false)
    setMedioDePagoSeleccionado(null)
    setEditandoMedioDePago(false)
    resetHandler()
  }

  const crearEditarMedioDePagoHandler = async () => {
    const data = {
      nombre: getValues('nombre'),
      tipo: getValues('tipo'),
      comision: parseFloat(getValues('comision')),
      descuento: parseFloat(getValues('descuento')),
    }

    setIsLoadingGuardarMedioDePago(true)

    if (medioDePagoSeleccionado) {
      // Editar medio de pago existente
      console.log('Editando medio de pago:', { ...data, id: medioDePagoSeleccionado.id })
      const response = await editarMedioDePago({ ...data, id: medioDePagoSeleccionado.id })

      if (isResponseValid(response)) {
        toast.success('¡El medio de pago se ha editado con éxito!', {
          theme: 'colored',
        })
        await obtenerMediosDePagoData({ page: 1 })
        cancelCrearMedioDePagoHandler()
      } else {
        toast.error('¡Ocurrió un error en la edición!', {
          theme: 'colored',
        })
      }
    } else {
      // Crear nuevo medio de pago
      console.log('Creando nuevo medio de pago:', data)
      const response = await crearMedioDePago(data)

      if (isResponseValid(response)) {
        toast.success('¡El medio de pago se ha creado con éxito!', {
          theme: 'colored',
        })
        await obtenerMediosDePagoData({ page: 1 })
        cancelCrearMedioDePagoHandler()
      } else {
        toast.error('¡Ocurrió un error en la creación!', {
          theme: 'colored',
        })
      }
    }

    setIsLoadingGuardarMedioDePago(false)
  }

  useEffect(() => {
    if (medioDePagoSeleccionado) {
      setValue('nombre', medioDePagoSeleccionado.nombre)
      setValue('tipo', medioDePagoSeleccionado.tipo)
      setValue('comision', medioDePagoSeleccionado.comision)
      setValue('descuento', medioDePagoSeleccionado.descuento)
    }
  }, [medioDePagoSeleccionado])

  const cambiarEstadoHandler = async (medioDePago: any) => {
    const nuevoMedioDePago: any = {
      id: medioDePago.id,
    }

    setIsLoadingCambiarEstado((prev) => ({
      ...prev,
      [medioDePago.id]: true,
    }))

    const response = await cambiarEstadoMedioDePago(nuevoMedioDePago)
    if (isResponseValid(response)) {
      toast.success('¡El medio de pago se cambió con éxito!', {
        theme: 'colored',
      })
      setIsLoadingCambiarEstado((prev) => ({
        ...prev,
        [medioDePago.id]: false,
      }))
      await obtenerMediosDePagoData({ page: 1 })
    } else {
      toast.error('¡Ocurrió un error en el cambio de estado!', {
        theme: 'colored',
      })
      setIsLoadingCambiarEstado((prev) => ({
        ...prev,
        [medioDePago.id]: false,
      }))
    }
  }

  const abrirModalCrearMedioDePago = () => {
    setEditandoMedioDePago(false)
    setMedioDePagoSeleccionado(null)
    setMostrarModalCrearEditarMedioDePago(true)
    setIsOpen(true)
    resetHandler()
  }

  useEffect(() => {
    obtenerMediosDePagoData({ page: 1, query: searchQuery })
  }, [])

  useEffect(() => {
    if (mediosDePago) {
      setItems(createItems(mediosDePago))
    }
  }, [mediosDePago])

  useEffect(() => {
    if (selectorEstadoWatch) {
      setEstadoSelectorId(selectorEstadoWatch.value)
    }
  }, [selectorEstadoWatch])

  useEffect(() => {
    obtenerMediosDePagoData({ page: 1 })
  }, [estadoSelectorId])

  return (
    <>
      <MediosDePagoTemplate
        isLoadingMediosDePago={isLoadingMediosDePago}
        isLoadingGuardarMedioDePago={isLoadingGuardarMedioDePago}
        medioDePagoSeleccionado={medioDePagoSeleccionado}
        editandoMedioDePago={editandoMedioDePago}
        mostrarModalCrearEditarMedioDePago={mostrarModalCrearEditarMedioDePago}
        disabled={!isDirty || !isValid}
        headers={headers}
        items={items}
        totalPages={totalPages}
        currentPage={currentPage}
        searchQuery={searchQuery}
        isOpen={isOpen}
        onPageChange={obtenerMediosDePagoData}
        onSearch={obtenerMediosDePagoData}
        setIsOpen={setIsOpen}
        errors={errors}
        control={control}
        register={register}
        cancelCrearMedioDePagoHandler={cancelCrearMedioDePagoHandler}
        crearEditarMedioDePagoHandler={crearEditarMedioDePagoHandler}
        handleSubmit={handleSubmit}
        abrirModalCrearMedioDePago={abrirModalCrearMedioDePago}
        nombreWatch={nombreWatch}
        tipoWatch={tipoWatch}
      />
    </>
  )
}

export default MediosDePagoView