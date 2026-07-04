import * as api from 'lib/services/api'

// const createEmployee = async (employee: any) => {
//   const payload = await api.fetchCreateEmployee(employee)

//   if (!payload) {
//     return
//   }

//   return payload
// }

const editarUsuario = async ({ id, usuario }) => {
  const payload = await api.fetchEditarUsuario({ id, usuario })

  if (!payload) {
    return
  }

  return payload
}

const obtenerUsuario = async (id: number) => {
  const payload = await api.fetchObtenerUsuario(id)

  if (!payload) {
    return
  }

  return payload
}

const subirImagen = async ({ id, formData }) => {
  const payload = await api.fetchSubirImagen({ id, formData })
  console.log('PAYLOAD', payload)

  if (!payload) {
    return
  }

  return payload
}

export { obtenerUsuario, editarUsuario, subirImagen }
