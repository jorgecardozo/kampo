// /api/people
import * as api from 'lib/services/api'

const obtenerMovimientosStock = async (data) => {
  const payload = await api.fetchObtenerMovimientosStock(data)

  if (!payload) {
    return
  }

  return payload
}

export { obtenerMovimientosStock }
