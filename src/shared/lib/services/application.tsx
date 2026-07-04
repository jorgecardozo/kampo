// Models
import { Application } from 'models/Application.model'

import { baseFetch } from './api'

export const fetchAddApplication = async (application: Application) => {
  return await baseFetch({
    url: `/api/application/${application.code}`,
    data: application,
    method: 'POST',
  })
}

export const fetchEditApplication = async (application: Application) => {
  return await baseFetch({
    url: `/api/application/${application.code}`,
    data: application,
    method: 'PUT',
  })
}

export const fetchDeleteApplication = async (application: Application) => {
  return await baseFetch({
    url: `/api/application/${application.code}`,
    data: application,
    method: 'DELETE',
  })
}

export const fetchSetApplicationStatus = async (appCode: string) => {
  return await baseFetch({
    url: `/api/application/${appCode}/set_status`,
    method: 'POST',
  })
}
