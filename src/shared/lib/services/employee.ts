import { baseFetch } from './api'

export const fetchCreateEmployee = async (employee: any) => {
  return await baseFetch({
    url: `/api/employee/${null}`,
    method: 'POST',
    data: { employee },
  })
}

export const fetchUpdateEmployee = async (employee: any) => {
  return await baseFetch({
    url: `/api/employee/${employee.id}`,
    method: 'PUT',
    data: { employee },
  })
}

export const fetchDeleteEmployee = async (employeeId: string) => {
  return await baseFetch({
    url: `/api/employee/${employeeId}`,
    method: 'DELETE',
  })
}
