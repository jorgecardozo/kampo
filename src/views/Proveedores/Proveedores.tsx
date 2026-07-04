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
import ProveedoresViewTemplate from './Proveedores.template'

// Types
import { Header, Item } from './Proveedores.types'

// Utils
import { isEmptyObject, isResponseValid } from 'lib/utils/helpers'
import { getCookie } from 'lib/utils/cookies'

const ProveedoresView = () => {
  const [isLoadingProveedores, setIsLoadingProveedores] =
    useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [cajas, setCajas] = useState([])
  const [items, setItems] = useState<Array<any>>([])
  const [totalPages, setTotalPages] = useState<number | null>(1)
  const [currentPage, setCurrentPage] = useState<number | null>(1)

  const [
    mostrarModalActualizarYCrearProveedor,
    setMostrarModalActualizarYCrearProveedor,
  ] = useState<boolean>(false)
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<any>(null)
  const [
    isLoadingActualizarYCrearProveedor,
    setIsLoadingActualizarYCrearProveedor,
  ] = useState<boolean>(false)
  const [selectorDeEstado, setSelectorDeEstado] = useState(null)

  const { setIsOpen, isOpen } = useModalContext()
  const {
    obtenerProveedores,
    crearProveedor,
    setUserData,
    actualizarProveedor,
  } = useActions()
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
  } = useForm({ mode: 'onBlur' })

  const selectorEstadoWatch = watch('selector_estado')

  const createItems = (proveedores: Array<any>): Array<Item> => {
    return (
      proveedores?.map((proveedor: any) => {
        console.log('proveedor', proveedor)
        return {
          nombre: (
            <TextBody
              className="truncate font-normal md:w-[130px]"
              title={proveedor?.nombre}
            >
              {proveedor?.nombre}
            </TextBody>
          ),
          apellido: (
            <TextBody
              className="truncate font-normal md:w-[130px]"
              title={proveedor?.apellido || '-'}
            >
              {proveedor?.apellido || '-'}
            </TextBody>
          ),
          documento: (
            <TextBody
              className="truncate font-normal md:w-[130px]"
              title={proveedor?.documento}
            >
              {proveedor?.documento}
            </TextBody>
          ),
          telefono: (
            <TextBody
              className="truncate text-start font-normal md:w-[130px]"
              title={proveedor?.telefono}
            >
              {proveedor?.telefono}
            </TextBody>
          ),
          email: (
            <TextBody
              className="truncate text-start font-normal md:w-[130px]"
              title={`${proveedor?.email} %`}
            >
              {proveedor?.email} %
            </TextBody>
          ),
          descripcion: (
            <TextBody
              className="truncate font-normal md:w-[130px]"
              title={proveedor?.descripcion}
            >
              {proveedor?.descripcion}
            </TextBody>
          ),
          estado: (
            <TextBodyXs>
              {proveedor?.estado ? (
                <span className="inline-flex items-center rounded-md bg-green-200 p-1 px-2 font-medium text-green-700 ring-1 ring-inset ring-gray-500/10">
                  Activo
                </span>
              ) : (
                <span className="inline-flex items-center rounded-md bg-red-200 px-2 py-1 font-medium text-red-700 ring-1 ring-inset ring-gray-500/10">
                  Inactivo
                </span>
              )}
            </TextBodyXs>
          ),
          actions: (
            <div className="flex items-center justify-between gap-1 md:gap-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsOpen(true)
                  setMostrarModalActualizarYCrearProveedor(true)
                  setProveedorSeleccionado(proveedor)
                }}
                variant="primary"
              >
                <TextBodyXs className="font-bold"> Editar </TextBodyXs>
              </Button>

              {/* <Button
                onClick={(e) => {
                  setIsOpen(true)
                  e.stopPropagation()
                  setShowDeleteEmployeeModal(true)
                  setSelectedEmployee(employee)
                }}
                variant="primaryOutline"
              >
                <TextBodyXs className="font-bold"> Eliminar </TextBodyXs>
              </Button> */}

              {/* <Button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsOpen(true)
                  setShowDetailEmployeeModal(true)
                  setSelectedEmployee(caja)
                }}
                variant="primaryOutline"
              >
                <TextBodyXs className="font-bold"> Detalle </TextBodyXs>
              </Button> */}
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
      field: 'apellido',
      type: 'string',
      title: 'APELLIDO',
    },
    {
      className: 'px-2 justify-start items-center font-bold',
      field: 'documento',
      type: 'string',
      title: 'DNI',
    },
    {
      className: 'justify-start items-center font-bold',
      field: 'telefono',
      type: 'string',
      title: 'TEL.',
    },
    {
      className: 'justify-start items-center font-bold',
      field: 'email',
      type: 'string',
      title: 'EMAIL',
    },
    {
      className: 'justify-start items-center font-bold',
      field: 'descripcion',
      type: 'string',
      title: 'DESCRIPCIÓN',
    },
    {
      className: 'justify-start items-center font-bold',
      field: 'estado',
      type: 'string',
      title: 'ESTADO',
    },
    {
      className: 'justify-start font-bold',
      field: 'actions',
      title: 'ACCIONES',
    },
  ]

  const obtenerProveedoresData = async ({
    page,
    query = '',
    size = 4,
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
      setIsLoadingProveedores(true)
      setSearchQuery(query)

      console.log('ver selectorDeEstado', selectorDeEstado)
      console.log(
        'valor',
        selectorDeEstado === null ? null : selectorDeEstado === 'activo'
      )

      const response = await obtenerProveedores({
        userId: usuario?.id || userCookie?.id,
        // page: page,
        // size: size,
        query: query === null ? searchQuery : query,
        estado:
          selectorDeEstado === null ? null : selectorDeEstado === 'activo',
      })

      console.log('Response proveedores', response)

      if (response?.data) {
        setCajas(response.data)
      }

      if (response?.meta && response?.meta?.pagination) {
        setTotalPages(response.meta.pagination.pageCount)
        setCurrentPage(response.meta.pagination.page)
      }
      setIsLoadingProveedores(false)
    }
  }

  const resetHandler = () => {
    reset({
      name: '',
      last_name: '',
      alias: '',
      dni: '',
      phone_number: '',
      address: '',
      status_selector: getValues('status_selector'),
    })
  }

  const cancelActualizarYCrearProveedorHandler = () => {
    setMostrarModalActualizarYCrearProveedor(false)
    setIsOpen(false)
    setProveedorSeleccionado(null)
    resetHandler()
  }

  const crearProveedorHandler = async () => {
    const nuevoProveedor: any = {
      nombre: getValues('nombre'),
      apellido: getValues('apellido'),
      documento: getValues('dni'),
      telefono: getValues('telefono'),
      email: getValues('email'),
      descripcion: getValues('descripcion'),
      estado: getValues('estado').value === 'true',
    }

    console.log('nuevoProveedor', nuevoProveedor)

    setIsLoadingActualizarYCrearProveedor(true)
    const response = await crearProveedor(nuevoProveedor)
    if (isResponseValid(response)) {
      toast.success('¡El proveedor se ha creado con éxito!', {
        theme: 'colored',
      })
      await obtenerProveedoresData({ page: 1, query: searchQuery })
      cancelActualizarYCrearProveedorHandler()
    } else {
      toast.error('¡Ocurrió un error en la creación!', {
        theme: 'colored',
      })
    }
    setIsLoadingActualizarYCrearProveedor(false)
  }

  const actualizarProveedorHandler = async () => {
    const nuevoProveedor: any = {
      nombre: getValues('nombre'),
      apellido: getValues('apellido'),
      telefono: getValues('telefono'),
      documento: getValues('dni'),
      email: getValues('email'),
      descripcion: getValues('descripcion'),
      estado: getValues('estado').value === 'true',
      proveedor_id: proveedorSeleccionado?.id,
    }

    setIsLoadingActualizarYCrearProveedor(true)
    const response = await actualizarProveedor(nuevoProveedor)
    if (isResponseValid(response)) {
      toast.success('¡El proveedor se ha editado con éxito!', {
        theme: 'colored',
      })
      await obtenerProveedoresData({ page: 1, query: searchQuery })
      cancelActualizarYCrearProveedorHandler()
    } else {
      toast.error('¡Ocurrió un error en la edición!', {
        theme: 'colored',
      })
    }
    setIsLoadingActualizarYCrearProveedor(false)
  }

  useEffect(() => {
    if (selectorEstadoWatch) {
      console.log('selectorEstadoWatch', selectorEstadoWatch)
      setSelectorDeEstado(selectorEstadoWatch.value)
    }
  }, [selectorEstadoWatch])

  useEffect(() => {
    obtenerProveedoresData({ page: 1, query: searchQuery })
  }, [selectorDeEstado])

  useEffect(() => {
    obtenerProveedoresData({ page: 1, query: searchQuery })
    setValue('selector_estado', { label: 'Todos', value: null })
  }, [])

  useEffect(() => {
    if (cajas) {
      setItems(createItems(cajas))
    }
  }, [cajas])

  useEffect(() => {
    if (mostrarModalActualizarYCrearProveedor && !proveedorSeleccionado) {
      setValue('estado', { value: 'true', label: 'Activo' })
      setValue('tiene_envase', { value: 'false', label: 'No' })
    }
  }, [mostrarModalActualizarYCrearProveedor])

  useEffect(() => {
    if (proveedorSeleccionado) {
      setValue('nombre', proveedorSeleccionado?.nombre)
      setValue('apellido', proveedorSeleccionado?.apellido)
      setValue('dni', proveedorSeleccionado?.documento)
      setValue('telefono', proveedorSeleccionado?.telefono)
      setValue('email', proveedorSeleccionado?.email)
      setValue('descripcion', proveedorSeleccionado?.descripcion)
      setValue(
        'estado',
        proveedorSeleccionado?.estado
          ? { value: 'true', label: 'Activo' }
          : { value: 'false', label: 'Inactivo' }
      )
    } else {
      setValue('estado', { value: 'true', label: 'Activo' })
    }
  }, [proveedorSeleccionado])

  return (
    <>
      <ProveedoresViewTemplate
        isLoadingActualizarYCrearProveedor={isLoadingActualizarYCrearProveedor}
        isLoadingProveedores={isLoadingProveedores}
        proveedorSeleccionado={proveedorSeleccionado}
        mostrarModalActualizarYCrearProveedor={
          mostrarModalActualizarYCrearProveedor
        }
        disabled={!isDirty || !isValid}
        headers={headers}
        items={items}
        totalPages={totalPages}
        currentPage={currentPage}
        searchQuery={searchQuery}
        isOpen={isOpen}
        onPageChange={obtenerProveedoresData}
        onSearch={obtenerProveedoresData}
        setIsOpen={setIsOpen}
        errors={errors}
        control={control}
        register={register}
        setMostrarModalActualizarYCrearProveedor={
          setMostrarModalActualizarYCrearProveedor
        }
        cancelActualizarYCrearProveedorHandler={
          cancelActualizarYCrearProveedorHandler
        }
        crearProveedorHandler={crearProveedorHandler}
        handleSubmit={handleSubmit}
        actualizarProveedorHandler={actualizarProveedorHandler}
      />
    </>
  )
}

export default ProveedoresView
