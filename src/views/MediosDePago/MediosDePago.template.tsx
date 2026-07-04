// Libraries
import React from 'react'

// Components
import { Button } from 'components/Button'
import { TextBody, TextBodySm, TextHeadingH4 } from 'components/Text'
import Table from 'components/Table'
import GrayBox from 'components/Graybox'
import Loader from 'components/Loader'
import Search from 'components/Table/components/Search'
import Pagination from 'components/Table/components/Pagination'
import Cards from 'components/Cards'
import Dropdown from 'components/Dropdown'
import Modal from 'components/Modal'
import { TextInput } from 'components/TextInput'
import { NumberInput } from 'components/NumberInput'

// Types
import { MediosDePagoTemplateProps } from './MediosDePago.types'

// Utils
import { COLORS } from 'lib/utils/constants'
import { FaPlus } from 'react-icons/fa'
import { Select } from 'components/Select'
import { paths } from 'lib/utils/paths'

const MediosDePagoTemplate = ({
  isLoadingMediosDePago,
  isLoadingGuardarMedioDePago,
  medioDePagoSeleccionado,
  editandoMedioDePago,
  mostrarModalCrearEditarMedioDePago,
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
  cancelCrearMedioDePagoHandler,
  crearEditarMedioDePagoHandler,
  handleSubmit,
  abrirModalCrearMedioDePago,
  nombreWatch,
  tipoWatch
}: MediosDePagoTemplateProps) => {

  return (
    <div className="w-full flex flex-col h-full">
      <TextHeadingH4 className="pb-4">Gestión de Medios de Pago</TextHeadingH4>

      <div className="pb-2">
        <Dropdown>
          <div className="flex flex-col flex-wrap justify-start gap-2 pb-1 md:flex-row md:items-center">
            <Search className="mb-1 h-[44px] md:mb-0" onSearch={onSearch} />

            <div className="flex flex-col justify-center gap-2 md:flex md:flex-row md:gap-2 lg:ml-auto">
              <Button
                variant="primary"
                onClick={abrirModalCrearMedioDePago}
              >
                <TextBodySm className="whitespace-nowrap font-bold">
                  Añadir Medio de Pago
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
                    { value: '1', label: 'Activo' },
                    { value: '0', label: 'Inactivo' },
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
            onClick={abrirModalCrearMedioDePago}
            title="Añadir medio de pago"
          >
            <div className="flex justify-center items-center gap-2">
              <FaPlus />
              <TextBody className="whitespace-nowrap font-bold">
                Medio de Pago
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
                { value: '1', label: 'Activo' },
                { value: '0', label: 'Inactivo' },
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

      {isLoadingMediosDePago ? (
        <div className="flex h-full grow flex-col items-center justify-center">
          <Loader fill={COLORS['LoaderIcon']} />
        </div>
      ) : (
        <div className='flex-1 flex flex-col h-full'>
          <Cards items={items} headers={headers} />
          <Table
            emptyState={
              <GrayBox
                title={'¡No hay medios de pago registrados!'}
                subtitle={'No se encontraron medios de pago para visualizar.'}
                className="mt-6 h-full grow py-6"
              />
            }
            headers={headers}
            items={items}
            totalPages={totalPages}
            currentPage={currentPage}
            maxVisiblePages={10}
            hideHeaders={false}
            searchQuery={searchQuery}
            gridClass="grid-cols-[15%_15%_15%_15%_15%_25%] hidden md:grid"
            gridClassHeaders="grid-cols-[15%_15%_15%_15%_15%_25%] hidden md:grid"
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
        </div>
      )}

      {/* Modal Crear/Editar Medio de Pago */}
      {mostrarModalCrearEditarMedioDePago && isOpen && (
        <Modal isOpen size="md">
          <Modal.Header
            className="mt-0 flex justify-start"
            setIsOpen={setIsOpen}
            onClose={() => {
              cancelCrearMedioDePagoHandler()
            }}
          >
            <TextBody size="text-xl font-bold md:text-heading-h6">
              {medioDePagoSeleccionado ? 'Editar Medio de Pago' : 'Crear Nuevo Medio de Pago'}
            </TextBody>
          </Modal.Header>
          <Modal.Content>
            <form id="form-medio-pago" className="space-y-6">
              {/* Campo Nombre */}
              <TextInput
                register={register}
                name="nombre"
                label="Nombre"
                placeholder="Ej: Mercado Pago, Efectivo, Tarjeta de Crédito"
                rules={{
                  required: 'Este campo es requerido.',
                  minLength: {
                    value: 2,
                    message: 'El nombre debe tener al menos 2 caracteres'
                  }
                }}
                errors={errors}
                disabled={isLoadingGuardarMedioDePago}
              />

              {/* Campo Tipo - Deshabilitado y auto-completado */}
              <TextInput
                register={register}
                name="tipo"
                label="Tipo"
                placeholder="Se genera automáticamente..."
                rules={{
                  required: 'Este campo es requerido.',
                }}
                errors={errors}
                disabled={true} // Siempre deshabilitado
              />

              {/* Campo Comisión */}
              <NumberInput
                control={control}
                name="comision"
                label="Comisión (%)"
                thousandSeparator={'.'}
                decimalSeparator={','}
                decimalScale={2}
                suffix=" %"
                placeholder="Ej: 2,50"
                rules={{
                  required: 'Este campo es requerido.',
                  min: {
                    value: 0,
                    message: 'La comisión debe ser mayor o igual a 0'
                  },
                  max: {
                    value: 100,
                    message: 'La comisión no puede ser mayor a 100%'
                  }
                }}
                errors={errors}
                disabled={isLoadingGuardarMedioDePago}
              />

              <NumberInput
                control={control}
                name="descuento"
                label="Descuento (%)"
                thousandSeparator={'.'}
                decimalSeparator={','}
                decimalScale={2}
                suffix=" %"
                placeholder="Ej: 2,50"
                rules={{
                  // required: 'Este campo es requerido.',
                  min: {
                    value: 0,
                    message: 'La comisión debe ser mayor o igual a 0'
                  },
                  max: {
                    value: 100,
                    message: 'La comisión no puede ser mayor a 100%'
                  }
                }}
                errors={errors}
                disabled={isLoadingGuardarMedioDePago}
              />
              {/* Información adicional */}

              {!editandoMedioDePago && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <TextBodySm className="text-yellow-800">
                    <strong>Nota:</strong> El campo "Tipo" se genera automáticamente basándose en el nombre ingresado.
                  </TextBodySm>
                </div>
              )}
            </form>
          </Modal.Content>
          <Modal.Actions className="bg-gray-50 flex justify-center mt-2">
            <div className="flex justify-center w-[400px] gap-x-12">
              <Button
                className="w-full md:w-[180px]"
                variant="outlineBlack"
                onClick={() => cancelCrearMedioDePagoHandler()}
                type="button"
                disabled={isLoadingGuardarMedioDePago}
              >
                <TextBodySm className="font-bold">Cancelar</TextBodySm>
              </Button>

              <Button
                className="w-full md:w-[180px]"
                variant="primary"
                onClick={handleSubmit(crearEditarMedioDePagoHandler)}
                disabled={isLoadingGuardarMedioDePago || disabled}
                loading={isLoadingGuardarMedioDePago}
                type="button"
              >
                <TextBodySm className="font-bold">
                  {medioDePagoSeleccionado ? 'Editar' : 'Crear'}
                </TextBodySm>
              </Button>
            </div>
          </Modal.Actions>
        </Modal>
      )}
    </div>
  )
}

export default MediosDePagoTemplate