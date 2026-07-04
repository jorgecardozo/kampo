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
import FarmFieldsViewTemplate from './FarmFields.template'

// Types
import { Header, Item } from './FarmFields.types'

// Utils
import { isEmptyObject, isResponseValid } from 'lib/utils/helpers'
import { getCookie } from 'lib/utils/cookies'

const FarmFieldsView = () => {
  const [isLoadingFarmFields, setIsLoadingFarmFields] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [bagPrices, setFarmFields] = useState([])
  const [items, setItems] = useState<Array<any>>([])
  const [totalPages, setTotalPages] = useState<number | null>(1)
  const [currentPage, setCurrentPage] = useState<number | null>(1)
  const [showAddAndEditFarmFieldModal, setShowAddAndEditFarmFieldModal] =
    useState<boolean>(false)
  const [showDeleteFarmFieldModal, setShowDeleteFarmFieldModal] =
    useState<boolean>(false)
  const [showDetailFarmFieldModal, setShowDetailFarmFieldModal] =
    useState<boolean>(false)
  const [selectedFarmField, setSelectedFarmField] = useState<any>(null)
  const [
    isLoadingCreateAndUpdateFarmField,
    setIsLoadingCreateAndUpdateFarmField,
  ] = useState<boolean>(false)
  const [isLoadingDeleteFarmField, setIsLoadingDeleteFarmField] =
    useState<boolean>(false)
  const [isLoadingUpdateFarmField, setIsLoadingUpdateFarmField] = useState({})
  const [statusSelectorId, setStatusSelectorId] = useState(null)

  const { setIsOpen, isOpen } = useModalContext()
  const {
    createFarmField,
    updateFarmField,
    deleteFarmField,
    setUserData,
    getFarmFields,
  } = useActions()
  const { user } = useSelectors()
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
  const statusSelectorWatch = watch('status_selector')

  const createItems = (farmFieldList: Array<any>): Array<Item> => {
    return (
      farmFieldList?.map((farmField: any) => {
        return {
          description: (
            <TextBody
              className="truncate text-start font-normal md:w-[300px]"
              title={farmField?.attributes?.description}
            >
              {farmField?.attributes?.description}
            </TextBody>
          ),
          address: (
            <TextBody className="truncate text-start font-normal md:w-[300px]">
              {farmField?.attributes?.address}
            </TextBody>
          ),
          active: (
            <TextBodyXs>
              {farmField?.attributes?.active ? (
                <span className="inline-flex items-center rounded-md bg-green-200 p-1 px-2 font-medium text-green-700 ring-1 ring-inset ring-gray-500/10">
                  activo
                </span>
              ) : (
                <span className="inline-flex items-center rounded-md bg-red-200 px-2 py-1 font-medium text-red-700 ring-1 ring-inset ring-gray-500/10">
                  inactivo
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
                  setShowAddAndEditFarmFieldModal(true)
                  setSelectedFarmField(farmField)
                }}
                variant="primary"
              >
                <TextBodyXs className="font-bold"> Editar </TextBodyXs>
              </Button>

              <Button
                onClick={(e) => {
                  setIsOpen(true)
                  e.stopPropagation()
                  updateFarmFieldStatusHandler(
                    farmField,
                    !farmField.attributes.active
                  )
                }}
                variant="primaryOutline"
                loading={isLoadingUpdateFarmField[farmField.id]}
              >
                {farmField.attributes.active ? (
                  <TextBodyXs className="font-bold"> Desactivar </TextBodyXs>
                ) : (
                  <TextBodyXs className="font-bold"> Activar </TextBodyXs>
                )}
              </Button>

              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsOpen(true)
                  setShowDetailFarmFieldModal(true)
                  setSelectedFarmField(farmField)
                }}
                variant="primaryOutline"
              >
                <TextBodyXs className="font-bold"> Detalle </TextBodyXs>
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
      field: 'description',
      type: 'string',
      title: 'DESCRIPCIÓN',
    },
    {
      className: 'justify-start items-center font-bold',
      field: 'address',
      type: 'string',
      title: 'DIRECCIÓN',
    },
    {
      className: 'justify-start items-center font-bold',
      field: 'active',
      type: 'string',
      title: 'ESTADO',
    },
    {
      className: 'justify-start font-bold',
      field: 'actions',
      title: 'ACCIONES',
    },
  ]

  const getFarmFieldsData = async ({
    page,
    query = '',
    size = 4,
  }: {
    page: number
    query?: string
    size?: number
  }) => {
    const userCookie = getCookie('user')

    if (isEmptyObject(user) && !isEmptyObject(userCookie)) {
      setUserData(userCookie)
    }

    if (user?.id || userCookie?.id) {
      setIsLoadingFarmFields(true)
      setSearchQuery(query)

      const response = await getFarmFields({
        // page: page,
        // size: size,
        query: query === null ? searchQuery : query,
        active: statusSelectorId,
        user: user.id,
      })

      if (response?.data) {
        setFarmFields(response.data)
      }

      if (response?.meta && response?.meta?.pagination) {
        setTotalPages(response.meta.pagination.pageCount)
        setCurrentPage(response.meta.pagination.page)
      }
      setIsLoadingFarmFields(false)
    }
  }

  const resetHandler = () => {
    reset({
      description: '',
      address: '',
      status_selector: getValues('status_selector'),
    })
  }

  const cancelEnableAndDisableFarmFieldHandler = () => {
    setShowAddAndEditFarmFieldModal(false)
    setIsOpen(false)
    setSelectedFarmField(null)
    resetHandler()
  }

  const cancelDeleteFarmFieldHandler = () => {
    setShowDeleteFarmFieldModal(false)
    setIsOpen(false)
    setSelectedFarmField(null)
    resetHandler()
  }

  const cancelDetailFarmFieldHandler = () => {
    setShowDetailFarmFieldModal(false)
    setIsOpen(false)
    setSelectedFarmField(null)
    resetHandler()
  }

  const createFarmFieldHandler = async () => {
    const newFarmField: any = {
      description: getValues('description'),
      address: getValues('address'),
      active: true,
      user: user.id,
    }

    setIsLoadingCreateAndUpdateFarmField(true)
    const response = await createFarmField(newFarmField)
    if (isResponseValid(response)) {
      toast.success('¡El campo se ha creado con éxito!', {
        theme: 'colored',
      })
      await getFarmFieldsData({ page: 1 })
      cancelEnableAndDisableFarmFieldHandler()
    } else {
      toast.error('¡Ocurrió un error en la creación!', {
        theme: 'colored',
      })
    }
    setIsLoadingCreateAndUpdateFarmField(false)
  }

  const updateFarmFieldHandler = async () => {
    const newFarmField: any = {
      description: getValues('description'),
      address: getValues('address'),
      id: selectedFarmField.id,
    }

    setIsLoadingCreateAndUpdateFarmField(true)
    const response = await updateFarmField(newFarmField)
    if (isResponseValid(response)) {
      toast.success('¡El campo se ha editado éxito!', {
        theme: 'colored',
      })
      await getFarmFieldsData({ page: 1 })
      cancelEnableAndDisableFarmFieldHandler()
    } else {
      toast.error('¡Ocurrió un error en la edición!', {
        theme: 'colored',
      })
    }
    setIsLoadingCreateAndUpdateFarmField(false)
  }

  const updateFarmFieldStatusHandler = async (
    paymentInvoice: any,
    active: boolean
  ) => {
    const newFarmField: any = {
      active: active,
      id: paymentInvoice.id,
    }

    setIsLoadingUpdateFarmField((prev) => ({
      ...prev,
      [paymentInvoice.id]: true,
    }))
    const response = await updateFarmField(newFarmField)
    if (isResponseValid(response)) {
      toast.success('¡El campo se ha editado con éxito!', {
        theme: 'colored',
      })
      await getFarmFieldsData({ page: 1 })
    } else {
      toast.error('¡Ocurrió un error en la edición!', {
        theme: 'colored',
      })
    }
    setIsLoadingUpdateFarmField((prev) => ({
      ...prev,
      [paymentInvoice.id]: false,
    }))
  }

  const deleteFarmFieldHandler = async () => {
    setIsLoadingDeleteFarmField(true)
    const response = await deleteFarmField(selectedFarmField.id)

    if (isResponseValid(response)) {
      toast.success('¡El campo se ha eliminado con éxito!', {
        theme: 'colored',
      })
      await getFarmFieldsData({ page: 1 })
      cancelDeleteFarmFieldHandler()
    } else {
      toast.error('¡Ocurrió un error en la eliminación!', {
        theme: 'colored',
      })
    }
    setIsLoadingDeleteFarmField(false)
  }

  useEffect(() => {
    getFarmFieldsData({ page: 1 })
    setValue('status_selector', { label: 'Todos', value: null })
  }, [])

  useEffect(() => {
    getFarmFieldsData({ page: 1 })
  }, [statusSelectorId])

  useEffect(() => {
    if (statusSelectorWatch) {
      setStatusSelectorId(statusSelectorWatch.value)
    }
  }, [statusSelectorWatch])

  useEffect(() => {
    if (bagPrices) {
      setItems(createItems(bagPrices))
    }
  }, [bagPrices])

  useEffect(() => {
    if (selectedFarmField) {
      setValue('description', selectedFarmField?.attributes?.description)
      setValue('address', selectedFarmField?.attributes?.address)
    }
  }, [selectedFarmField])

  return (
    <>
      <FarmFieldsViewTemplate
        headers={headers}
        items={items}
        totalPages={totalPages}
        currentPage={currentPage}
        searchQuery={searchQuery}
        selectedFarmField={selectedFarmField}
        showAddAndEditFarmFieldModal={showAddAndEditFarmFieldModal}
        showDeleteFarmFieldModal={showDeleteFarmFieldModal}
        isOpen={isOpen}
        isLoadingFarmFields={isLoadingFarmFields}
        onPageChange={getFarmFieldsData}
        onSearch={getFarmFieldsData}
        setIsOpen={setIsOpen}
        errors={errors}
        control={control}
        register={register}
        setShowAddAndEditFarmFieldModal={setShowAddAndEditFarmFieldModal}
        cancelEnableAndDisableFarmFieldHandler={
          cancelEnableAndDisableFarmFieldHandler
        }
        createFarmFieldHandler={createFarmFieldHandler}
        isLoadingCreateAndUpdateFarmField={isLoadingCreateAndUpdateFarmField}
        isLoadingDeleteFarmField={isLoadingDeleteFarmField}
        disabled={!isValid || !isDirty}
        handleSubmit={handleSubmit}
        updateFarmFieldHandler={updateFarmFieldHandler}
        deleteFarmFieldHandler={deleteFarmFieldHandler}
        cancelDeleteFarmFieldHandler={cancelDeleteFarmFieldHandler}
        cancelDetailFarmFieldHandler={cancelDetailFarmFieldHandler}
        showDetailFarmFieldModal={showDetailFarmFieldModal}
      />
    </>
  )
}

export default FarmFieldsView
