// Libraries
import React from 'react'

// Components
import { Button } from 'components/Button'
import { TextBody, TextBodySm, TextBodyXs } from 'components/Text'
import Table from 'components/Table'
import GrayBox from 'components/Graybox'
import Loader from 'components/Loader'
import Search from 'components/Table/components/Search'
import { TextInput } from 'components/TextInput'
import Modal from 'components/Modal'
import Cards from 'components/Cards'
import Pagination from 'components/Table/components/Pagination'
import { DynamicDropdown } from 'components/DynamicDropdown'

// Types
import { FarmFieldsTemplateProps } from './FarmFields.types'

// Utils
import { COLORS } from 'lib/utils/constants'
import { Select } from 'components/Select'
import Dropdown from 'components/Dropdown'

const FarmFieldsViewTemplate = ({
  headers,
  items,
  disabled,
  isLoadingCreateAndUpdateFarmField,
  isLoadingDeleteFarmField,
  isLoadingFarmFields,
  showDeleteFarmFieldModal,
  showAddAndEditFarmFieldModal,
  totalPages,
  currentPage,
  searchQuery,
  selectedFarmField,
  isOpen,
  onPageChange,
  onSearch,
  setIsOpen,
  errors,
  control,
  register,
  setShowAddAndEditFarmFieldModal,
  cancelEnableAndDisableFarmFieldHandler,
  createFarmFieldHandler,
  updateFarmFieldHandler,
  deleteFarmFieldHandler,
  handleSubmit,
  cancelDeleteFarmFieldHandler,
  cancelDetailFarmFieldHandler,
  showDetailFarmFieldModal,
}: FarmFieldsTemplateProps) => {
  return (
    <div>
      <div className="pb-2">
        <Dropdown>
          <div className="flex flex-col flex-wrap justify-start gap-2 pb-1 md:flex-row md:items-center">
            <Search className="mb-1 h-[44px] md:mb-0" onSearch={onSearch} />

            <div className="flex flex-col justify-center gap-1 md:flex md:flex-row md:gap-2 lg:ml-auto">
              <Button
                variant="primary"
                onClick={() => {
                  setShowAddAndEditFarmFieldModal(true)
                  setIsOpen(true)
                }}
                className="z-[98]"
              >
                <TextBodySm className="whitespace-nowrap font-bold">
                  Añadir nuevo campo
                </TextBodySm>
              </Button>

              <div className="md:w-[210px]">
                <Select
                  isInput={false}
                  name="status_selector"
                  placeholder="Seleccioná una opción"
                  control={control}
                  isSearchable={false}
                  options={[
                    { value: null, label: 'Todos' },
                    { value: 'true', label: 'Activo' },
                    { value: 'false', label: 'Inactivo' },
                  ]}
                  errors={errors}
                >
                  <div className="flex items-center gap-1">
                    <p>Activo / Inactivo</p>
                  </div>
                </Select>
              </div>
            </div>
          </div>
        </Dropdown>
      </div>
      <div className="hidden flex-col flex-wrap justify-start gap-2 pb-6 md:flex md:flex-row md:items-center">
        <Search className="mb-1 h-[44px] md:mb-0" onSearch={onSearch} />

        <div className="flex flex-col justify-center gap-1 md:flex md:flex-row md:gap-2 lg:ml-auto">
          <Button
            variant="primary"
            onClick={() => {
              setShowAddAndEditFarmFieldModal(true)
              setIsOpen(true)
            }}
            className="z-[98]"
          >
            <TextBodySm className="whitespace-nowrap font-bold">
              Añadir nuevo campo
            </TextBodySm>
          </Button>

          <div className="md:w-[210px]">
            <Select
              isInput={false}
              name="status_selector"
              placeholder="Seleccioná una opción"
              control={control}
              isSearchable={false}
              options={[
                { value: null, label: 'Todos' },
                { value: 'true', label: 'Activo' },
                { value: 'false', label: 'Inactivo' },
              ]}
              errors={errors}
            >
              <div className="flex items-center gap-1">
                <p>Activo / Inactivo</p>
              </div>
            </Select>
          </div>
        </div>
      </div>
      {isLoadingFarmFields ? (
        <div className="flex h-full grow flex-col items-center justify-center">
          <Loader fill={COLORS['LoaderIcon']} />
        </div>
      ) : (
        <>
          <Cards items={items} headers={headers} />
          <Table
            emptyState={
              <GrayBox
                title={'¡No hay campos!'}
                subtitle={'Por favor, cree precios para poder visualizarlos.'}
                className="mt-6 min-h-[300px] grow py-6"
              />
            }
            headers={headers}
            items={items}
            totalPages={totalPages}
            currentPage={currentPage}
            maxVisiblePages={10}
            hideHeaders={false}
            searchQuery={searchQuery}
            gridClass="grid-cols-[30%_30%_10%_30%] hidden md:grid"
            gridClassHeaders="grid-cols-[30%_30%_10%_30%] hidden md:grid"
            className="text-black"
            onPageChange={onPageChange}
          />
          <div>
            {totalPages !== 0 && onPageChange && currentPage && (
              <Pagination
                className="mt-8 flex justify-center"
                totalPages={totalPages}
                maxVisiblePages={3}
                currentPage={currentPage}
                searchQuery={searchQuery}
                onPageChange={onPageChange}
              />
            )}
          </div>
        </>
      )}

      {showAddAndEditFarmFieldModal && isOpen && (
        <div className="m-4">
          <Modal isOpen size="sm">
            <Modal.Header
              className="mt-0 flex justify-start"
              setIsOpen={setIsOpen}
              onClose={() => {
                cancelEnableAndDisableFarmFieldHandler()
              }}
            >
              {selectedFarmField ? (
                <TextBody size="text-xl font-bold md:text-heading-h6">
                  Editar campo
                </TextBody>
              ) : (
                <TextBody size="text-heading-h6">Añadir nuevo campo</TextBody>
              )}
            </Modal.Header>
            <Modal.Content>
              <form
                autoComplete="off"
                className="flex flex-col justify-between"
              >
                <div className="grid grid-cols-1 gap-x-2 gap-y-7">
                  <TextInput
                    register={register}
                    name="description"
                    label="Descripción"
                    errors={errors}
                    // disabled={loadingAddAndEditApplication}
                  />

                  <TextInput
                    register={register}
                    name="address"
                    label="Dirección"
                    errors={errors}
                    // disabled={loadingAddAndEditApplication}
                  />
                </div>
              </form>
            </Modal.Content>
            <Modal.Actions className="bg-gray-50 flex justify-center">
              <div className="grid w-[380px] grid-cols-2 gap-x-2 px-4 md:w-full md:gap-x-2 md:pr-0">
                <Button
                  className="w-full md:w-[200px]"
                  variant="outlineBlack"
                  onClick={() => cancelEnableAndDisableFarmFieldHandler()}
                >
                  <TextBodySm className="font-bold">Cancelar</TextBodySm>
                </Button>
                {selectedFarmField ? (
                  <Button
                    className="w-full md:w-[200px]"
                    variant="primary"
                    onClick={handleSubmit(updateFarmFieldHandler)}
                    disabled={disabled || isLoadingCreateAndUpdateFarmField}
                    loading={isLoadingCreateAndUpdateFarmField}
                  >
                    <TextBodySm className=" font-bold">Confirmar</TextBodySm>
                  </Button>
                ) : (
                  <Button
                    className="w-full md:w-[200px]"
                    variant="primary"
                    onClick={handleSubmit(createFarmFieldHandler)}
                    disabled={disabled || isLoadingCreateAndUpdateFarmField}
                    loading={isLoadingCreateAndUpdateFarmField}
                  >
                    <TextBodySm className=" font-bold">Confirmar</TextBodySm>
                  </Button>
                )}
              </div>
            </Modal.Actions>
          </Modal>
        </div>
      )}

      {showDeleteFarmFieldModal && isOpen && (
        <Modal isOpen size="md">
          <Modal.Header
            className="flex justify-center"
            setIsOpen={setIsOpen}
            onClose={() => {
              cancelDeleteFarmFieldHandler()
            }}
          >
            <TextBody size="text-base font-bold md:text-heading-h6">
              ¿Estás seguro/a de eliminar este campo?
            </TextBody>
          </Modal.Header>
          <Modal.Content className="flex justify-center">
            <TextBody>Si lo eliminás no podrás recuperar los datos</TextBody>
          </Modal.Content>
          <Modal.Actions className="bg-gray-50 flex justify-center pt-8">
            <div className="grid w-[380px] grid-cols-2 gap-x-2 px-4 md:w-[450px] md:gap-x-2 md:pr-0">
              <Button
                className="md:w-[200px]"
                variant="outlineBlack"
                onClick={() => cancelDeleteFarmFieldHandler()}
              >
                <TextBodySm className="font-bold">Cancelar</TextBodySm>
              </Button>
              <Button
                className="md:w-[200px]"
                variant="primary"
                onClick={() => {
                  deleteFarmFieldHandler()
                }}
                loading={isLoadingDeleteFarmField}
              >
                <TextBodySm className="font-bold">Eliminar</TextBodySm>
              </Button>
            </div>
          </Modal.Actions>
        </Modal>
      )}

      {showDetailFarmFieldModal && isOpen && (
        <Modal isOpen size="md">
          <Modal.Header
            className="flex justify-center"
            setIsOpen={setIsOpen}
            onClose={() => {
              cancelDetailFarmFieldHandler()
            }}
          >
            <TextBody size="text-base font-bold md:text-heading-h6 w-[300px]">
              Datos del campo:
            </TextBody>
          </Modal.Header>
          <Modal.Content className="flex justify-start">
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              <TextBody className="text-start">
                <span className="font-bold">Descripción:</span>{' '}
                {selectedFarmField.attributes.description}
              </TextBody>
              <TextBody className="text-start">
                <span className="font-bold">Dirección:</span>{' '}
                {selectedFarmField.attributes.address}
              </TextBody>
              <div className="flex gap-2">
                <TextBody className="text-start">
                  <span className="font-bold">Estado:</span>{' '}
                </TextBody>
                <TextBodyXs>
                  {selectedFarmField.attributes.active ? (
                    <span className="inline-flex items-center rounded-md bg-green-200 p-1 px-2 font-medium text-green-700 ring-1 ring-inset ring-gray-500/10">
                      activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-red-200 px-2 py-1 font-medium text-red-700 ring-1 ring-inset ring-gray-500/10">
                      inactivo
                    </span>
                  )}
                </TextBodyXs>
              </div>
            </div>
          </Modal.Content>
        </Modal>
      )}
    </div>
  )
}

export default FarmFieldsViewTemplate
