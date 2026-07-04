// Campo (establecimiento) activo, a nivel módulo, para que las capas *.api.ts
// puedan filtrar/estampar `campo_id` sin tener que pasarlo por cada llamada.
// Lo setea el CampoProvider; al cambiarlo se invalidan las queries y todo
// se vuelve a pedir con el nuevo campo.
let _campoId: string | null = null

export const setCampoActual = (id: string | null) => {
  _campoId = id
}
export const getCampoActual = (): string | null => _campoId
