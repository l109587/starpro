import request from '@/utils/request'

export async function getApis(params = {}) {
  return request('/console/GetApis', {
    method: 'GET',
    params,
  })
}

export async function getIPs(params = {}) {
  return request('/console/GetIps', {
    method: 'GET',
    params,
  })
}

export async function requestQuantity(params = {}) {
  return request('/console/RequestQuantity', {
    method: 'GET',
    params,
  })
}

export async function requestQuantityMax5(params = {}) {
  return request('/console/RequestQuantityMax5', {
    method: 'GET',
    params,
  })
}
