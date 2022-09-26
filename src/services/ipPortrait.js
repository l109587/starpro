import request from '@/utils/request'

export async function getIpPortraitDetails(params = {}) {
  return request('/console/GetIpPortraitDetails', {
    method: 'GET',
    params,
  })
}

export async function getIpEventsScatters(params = {}) {
  return request('/console/GetIpEventsScatters', {
    method: 'GET',
    params,
  })
}

export async function getIpEventsDistribution(params = {}) {
  return request('/console/GetIpEventsDistribution', {
    method: 'GET',
    params,
  })
}

export async function getIpReuqestsTrends(params = {}) {
  return request('/console/GetIpReuqestsTrends', {
    method: 'GET',
    params,
  })
}

export async function getIpsTop(params = {}) {
  return request('/console/GetIpsTop', {
    method: 'GET',
    params,
  })
}

export async function getIpTagsClustered(params = {}) {
  return request('/console/GetIpTagsClustered', {
    method: 'GET',
    params,
  })
}

export async function getIpTagEntitiesClustered(params = {}) {
  return request('/console/GetIpTagEntitiesClustered', {
    method: 'GET',
    params,
  })
}

export async function modifyIpRisksStatus(data = {}, params = {}) {
  return request('/console/ModifyIpRisksStatus', {
    method: 'POST',
    data,
    params,
  })
}

export async function getIpEvents(params = {}) {
  return request('/console/GetIpEvents', {
    method: 'GET',
    params,
  })
}

export async function modifyIpEventsStatus(data = {}, params = {}) {
  return request('/console/ModifyIpEventsStatus', {
    method: 'POST',
    data,
    params,
  })
}
