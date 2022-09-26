import request from '@/utils/request'

export async function getTableData(params) {
  return request('/console/ListEvents', {
    method: 'GET',
    params,
  })
}
export async function getEventsStateTrend(params) {
  return request('/console/GetEventsStateTrend', {
    method: 'GET',
    params,
  })
}

export async function getTrendsData(params) {
  return request('/console/ListEventsTrends', {
    method: 'GET',
    params,
  })
}
export async function getTopListData(params) {
  return request('/console/ListEventsTopHosts', {
    method: 'GET',
    params,
  })
}
export async function GetEventDetails(params) {
  return request('/console/GetEventDetails', {
    method: 'GET',
    params,
  })
}

export async function modifyStatus(params) {
  return request('/console/ModifyEventsStatus', {
    method: 'POST',
    data: params,
  })
}

export async function getStatusEvents(params) {
  return request('/console/GetStatusEvents', {
    method: 'GET',
    params,
  })
}
export async function createWhiteStrategys(params) {
  return request('/console/CreateWhiteStrategys', {
    method: 'POST',
    data: params,
  })
}

export async function getWhiteStrategys(params) {
  return request('/console/GetWhiteStrategys', {
    method: 'GET',
    params,
  })
}

export async function updateWhiteStrategys(params) {
  return request('/console/UpdateWhiteStrategys', {
    method: 'POST',
    data: params,
  })
}

export async function deleteWhiteStrategys(params) {
  return request('/console/DeleteWhiteStrategys', {
    method: 'POST',
    data: params,
  })
}
export async function getWhiteDetails(params) {
  return request('/console/GetWhiteDetails', {
    method: 'GET',
    params,
  })
}
