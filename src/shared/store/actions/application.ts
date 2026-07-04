// Models
import { Application } from 'models/Application.model'

// Services
import * as api from 'lib/services/api'

const addApplication = async (application: Application) => {
  const payload = await api.fetchAddApplication(application)
  if (!payload) {
    return
  }
  return payload
}

const editApplication = async (application: Application) => {
  const payload = await api.fetchEditApplication(application)
  if (!payload) {
    return
  }
  return payload
}

const deleteApplication = async (application: Application) => {
  const payload = await api.fetchDeleteApplication(application)
  if (!payload) {
    return
  }
  return payload
}

const setApplicationStatus = async (appCode: string) => {
  const payload = await api.fetchSetApplicationStatus(appCode)
  if (!payload) {
    return
  }
  return payload
}

export {
  addApplication,
  editApplication,
  deleteApplication,
  setApplicationStatus,
}
