import request from '@/utils/request'

export async function getSrcEvents(data = {}, params = {}) {
  return request('/console/GetSrcEvents', {
    method: 'POST',
    data,
    params,
  })
}

export async function getSrcEventDetail(params = {}) {
  return request('/console/GetSrcEventDetail', {
    method: 'GET',
    params,
  })
}
