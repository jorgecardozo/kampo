import { baseFetch } from './api'

export const fetchGetEmployees = async (data) => {
  const { userId } = data
  return await baseFetch({
    url: `/api/employees/${userId}`,
    method: 'POST',
    data: { data },
  })
}
