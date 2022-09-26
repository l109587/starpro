import request from '@/utils/request'

export async function getDataOverview(params = {}) {
  return request('/console/GetDataOverview', {
    method: 'GET',
    params,
  })
}
export async function getEventsTotal(params = {}) {
  return request('/console/GetEventsTotal', {
    method: 'GET',
    params,
  })
}
export async function getIPOverview(params = {}) {
  return request('/console/GetIPOverview', {
    method: 'GET',
    params,
  })
}
export async function getAPIOverview(params = {}) {
  return request('/console/GetAPIOverview', {
    method: 'GET',
    params,
  })
}
export async function getAPPOverview(params = {}) {
  return request('/console/GetAPPOverview', {
    method: 'GET',
    params,
  })
}
export async function getEventIncrement(params = {}) {
  return request('/console/GetEventIncrement', {
    method: 'GET',
    params,
  })
}
