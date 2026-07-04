import * as api from 'lib/services/api'
import { Approval } from 'models/Approval.model'

const rejectRequest = async (data: Approval) => {
  const payload = await api.fetchRejectRequest(data.id, data)
  if (!payload) {
    return
  }
  return payload
}

const approveRequest = async (
  request: Approval,
  pointOfSaleIds: Array<number>
) => {
  const payload = await api.fetchApproveRequest(request.id, pointOfSaleIds)
  if (!payload) {
    return
  }
  return payload
}

export { rejectRequest, approveRequest }
