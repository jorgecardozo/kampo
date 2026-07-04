import * as api from 'lib/services/api'

const createEmployee = async (employee: any) => {
  const payload = await api.fetchCreateEmployee(employee)

  if (!payload) {
    return
  }

  return payload
}

const updateEmployee = async (employee: any) => {
  const payload = await api.fetchUpdateEmployee(employee)

  if (!payload) {
    return
  }

  return payload
}

const deleteEmployee = async (employeeId: string) => {
  const payload = await api.fetchDeleteEmployee(employeeId)

  if (!payload) {
    return
  }

  return payload
}

export { createEmployee, updateEmployee, deleteEmployee }
