import { baseFetch } from './api'

export const fetchGetApplications = async (includeInactive: boolean) => {
  return await baseFetch({
    url: '/api/applications/get_applications',
    method: 'POST',
    data: { includeInactive },
  })
}
