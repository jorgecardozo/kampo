// Models
import { Role } from 'models/Role.model'

import { baseFetch } from './api'

// export const fetchA = async (appCode: string, role: Role) => {
//   return await baseFetch({
//     url: `/api/role/${appCode}`,
//     data: role,
//     method: 'POST',
//   })
// }

export const fetchEditarUsuario = async ({ id, usuario }) => {
  return await baseFetch({
    url: `/api/usuarios/${id}`,
    data: { usuario },
    method: 'PUT',
  })
}

export const fetchObtenerUsuario = async (id: number) => {
  return await baseFetch({
    url: `/api/usuarios/${id}`,
    method: 'GET',
  })
}

export const fetchSubirImagen = async ({ id, formData }) => {
  return await baseFetch({
    url: `/api/usuarios/subir_imagen/${id}`,
    method: 'PUT',
    data: formData,
    json: false,
  })
}
