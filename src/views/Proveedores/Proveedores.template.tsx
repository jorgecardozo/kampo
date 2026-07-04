// Libraries
import React from 'react'
import { FaPlus } from 'react-icons/fa'

// Components
import { Button } from 'components/Button'
import { TextBody, TextBodySm, TextHeadingH4 } from 'components/Text'
import Table from 'components/Table'
import GrayBox from 'components/Graybox'
import Loader from 'components/Loader'
import Search from 'components/Table/components/Search'
import Pagination from 'components/Table/components/Pagination'
import Cards from 'components/Cards'
import { Select } from 'components/Select'
import Dropdown from 'components/Dropdown'
import { TextInput } from 'components/TextInput'
import Modal from 'components/Modal'
import { NumberInput } from 'components/NumberInput'

// Types
import { ProveedoresTemplateProps } from './Proveedores.types'

// Utils
import {
  COLORS,
  DOCUMENT_MAX_VALUE,
  DOCUMENT_MIN_VALUE,
  EMAIL_REGEX,
} from 'lib/utils/constants'
import { paths } from 'lib/utils/paths'
import { PhoneNumber } from 'components/PhoneNumber'

const ProveedoresViewTemplate = ({
  isLoadingProveedores,
  isLoadingActualizarYCrearProveedor,
  proveedorSeleccionado,
  mostrarModalActualizarYCrearProveedor,
  disabled,
  headers,
  items,
  totalPages,
  currentPage,
  searchQuery,
  isOpen,
  onPageChange,
  onSearch,
  setIsOpen,
  errors,
  control,
  register,
  setMostrarModalActualizarYCrearProveedor,
  cancelActualizarYCrearProveedorHandler,
  crearProveedorHandler,
  actualizarProveedorHandler,
  handleSubmit,
}: ProveedoresTemplateProps) => {
  return (
    <div>
      <TextHeadingH4 className="pb-4">
        {paths.proveedores.title}
      </TextHeadingH4>
      <div className="pb-2">
        <Dropdown>
          <div className="flex flex-col flex-wrap justify-start gap-2 pb-1 md:flex-row md:items-center">
            <Search className="mb-1 h-[44px] md:mb-0" onSearch={onSearch} />

            <div className="flex flex-col justify-center gap-2 md:flex md:flex-row md:gap-2 lg:ml-auto">
              <Button
                variant="primary"
                onClick={() => {
                  setMostrarModalActualizarYCrearProveedor(true)
                  setIsOpen(true)
                }}
              >
                <TextBodySm className="whitespace-nowrap font-bold">
                  Añadir Proveedor
                </TextBodySm>
              </Button>
              <div className="md:w-[210px]">
                <Select
                  isInput
                  name="selector_estado"
                  placeholder="Seleccioná una opción"
                  control={control}
                  isSearchable={false}
                  options={[
                    { value: null, label: 'Todos' },
                    { value: 'activo', label: 'Activo' },
                    { value: 'inactivo', label: 'Inactivo' },
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

        <div className="flex flex-col justify-center gap-2 md:flex md:flex-row md:gap-2 lg:ml-auto">
          <Button
            className="w-4/12"
            variant="primary"
            onClick={() => {
              setMostrarModalActualizarYCrearProveedor(true)
              setIsOpen(true)
            }}
            title="Añadir proveedor"
          >
            <div className="flex justify-center items-center gap-2">
              <FaPlus />
              <TextBody className="whitespace-nowrap font-bold">
                Proveedor
              </TextBody>
            </div>
          </Button>
          <div className="md:w-[210px]">
            <Select
              isInput
              defaultValue={{ value: null, label: 'Todos' }}
              name="selector_estado"
              placeholder="Seleccioná una opción"
              control={control}
              isSearchable={false}
              options={[
                { value: null, label: 'Todos' },
                { value: 'activo', label: 'Activo' },
                { value: 'inactivo', label: 'Inactivo' },
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
      {isLoadingProveedores ? (
        <div className="flex h-full grow flex-col items-center justify-center">
          <Loader fill={COLORS['LoaderIcon']} />
        </div>
      ) : (
        <>
          <Cards items={items} headers={headers} />
          <Table
            emptyState={
              <GrayBox
                title={'¡No hay empleados!'}
                subtitle={'Por favor, cree empleados para poder visualizarlos.'}
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
            gridClass="grid-cols-[10%_14%_14%_14%_10%_10%_12%_12%] hidden md:grid"
            gridClassHeaders="grid-cols-[10%_14%_14%_14%_10%_10%_12%_12%] hidden md:grid"
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

      {mostrarModalActualizarYCrearProveedor && isOpen && (
        <Modal isOpen size="sm">
          <Modal.Header
            className="mt-0 flex justify-start"
            setIsOpen={setIsOpen}
            onClose={() => {
              cancelActualizarYCrearProveedorHandler()
            }}
          >
            {proveedorSeleccionado ? (
              <TextBody size="text-xl font-bold md:text-heading-h6">
                Editar proveedor
              </TextBody>
            ) : (
              <TextBody size="text-xl font-bold md:text-heading-h6">
                Agregar nuevo proveedor
              </TextBody>
            )}
          </Modal.Header>
          <Modal.Content>
            <form autoComplete="off" className="flex flex-col justify-between">
              <div className="grid grid-cols-1 gap-x-2 gap-y-7">
                <TextInput
                  register={register}
                  name="nombre"
                  label="Nombre "
                  rules={{
                    required: 'Este campo es requerido.',
                  }}
                  errors={errors}
                  disabled={isLoadingActualizarYCrearProveedor}
                />

                <TextInput
                  register={register}
                  name="apellido"
                  label="Apellido"
                  rules={{
                    required: 'Este campo es requerido.',
                  }}
                  errors={errors}
                  disabled={isLoadingActualizarYCrearProveedor}
                />

                <NumberInput
                  control={control}
                  name="dni"
                  label="DNI"
                  placeholder="XX.XXX.XXX"
                  thousandSeparator={'.'}
                  errors={errors}
                  // disabled={isLoading}
                  isAllowed={({ floatValue, value }) => {
                    return floatValue < DOCUMENT_MAX_VALUE || value === ''
                  }}
                  rules={{
                    required: 'Este campo es requerido.',
                    minLength: {
                      value: DOCUMENT_MIN_VALUE,
                      message: 'Este campo no puede tener menos de 7 cifras.',
                    },
                    maxLength: {
                      value: DOCUMENT_MAX_VALUE,
                      message: 'Este campo no puede tener más de 8 cifras.',
                    },
                  }}
                />

                <Select
                  isInput={true}
                  name="estado"
                  placeholder="Seleccioná una opción"
                  control={control}
                  isSearchable={false}
                  // defaultValue={{ value: 'true', label: 'Activo' }}
                  options={[
                    { value: 'true', label: 'Activo' },
                    { value: 'false', label: 'Inactivo' },
                  ]}
                  errors={errors}
                  isDisabled={isLoadingActualizarYCrearProveedor}
                >
                  <div className="flex items-center gap-1">
                    <p>Estado</p>
                  </div>
                </Select>

                {/* <PhoneNumber control={control} /> */}

                <TextInput
                  register={register}
                  name="email"
                  label="Email"
                  type="email"
                  rules={{
                    required: 'Este campo es requerido.',
                    pattern: {
                      value: EMAIL_REGEX,
                      message: 'Por favor escriba un mail válido.',
                    },
                  }}
                  errors={errors}
                />

                <TextInput
                  register={register}
                  name="telefono"
                  label="Teléfono"
                  rules={{
                    required: 'Este campo es requerido.',
                  }}
                  errors={errors}
                  disabled={isLoadingActualizarYCrearProveedor}
                />

                <TextInput
                  register={register}
                  name="descripcion"
                  label="Descripción"
                  rules={{
                    required: 'Este campo es requerido.',
                  }}
                  errors={errors}
                  disabled={isLoadingActualizarYCrearProveedor}
                />
              </div>
            </form>
          </Modal.Content>
          <Modal.Actions className="bg-gray-50 flex justify-center">
            <div className="grid w-[380px] grid-cols-2 gap-x-2 px-4 md:w-full md:gap-x-2 md:pr-0">
              <Button
                className="w-full md:w-[200px]"
                variant="outlineBlack"
                onClick={() => cancelActualizarYCrearProveedorHandler()}
              >
                <TextBodySm className="font-bold">Cancelar</TextBodySm>
              </Button>

              {proveedorSeleccionado ? (
                <Button
                  className="w-full md:w-[200px]"
                  variant="primary"
                  onClick={handleSubmit(actualizarProveedorHandler)}
                  disabled={isLoadingActualizarYCrearProveedor || disabled}
                  loading={isLoadingActualizarYCrearProveedor}
                >
                  <TextBodySm className=" font-bold">Editar </TextBodySm>
                </Button>
              ) : (
                <Button
                  className="w-full md:w-[200px]"
                  variant="primary"
                  onClick={handleSubmit(crearProveedorHandler)}
                  disabled={isLoadingActualizarYCrearProveedor || disabled}
                  loading={isLoadingActualizarYCrearProveedor}
                >
                  <TextBodySm className=" font-bold">Crear</TextBodySm>
                </Button>
              )}
            </div>
          </Modal.Actions>
        </Modal>
      )}
    </div>
  )
}

export default ProveedoresViewTemplate
