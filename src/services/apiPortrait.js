import request from '@/utils/request'

export async function getApiPortraitDetails(params = {}) {
  return request('/console/GetApiPortraitDetails', {
    method: 'GET',
    params,
  })
}

export async function getApiTagsDistribution(params = {}) {
  return request('/console/GetApiTagsDistribution', {
    method: 'GET',
    params,
  })
}

export async function getApiTopTags(params = {}) {
  return request('/console/GetApiTopTags', {
    method: 'GET',
    params,
  })
}

export async function getApiTrafficTrends(params = {}) {
  return request('/console/GetApiTrafficTrends', {
    method: 'GET',
    params,
  })
}

export async function getApiTopIps(params = {}) {
  return request('/console/GetApiTopIps', {
    method: 'GET',
    params,
  })
}

export async function getApiIssues(params = {}) {
  return request('/console/GetApiIssues', {
    method: 'GET',
    params,
  })
}

export async function modifyApiIssueStatus(data = {}, params = {}) {
  return request('/console/ModifyApiIssueStatus', {
    method: 'POST',
    data,
    params,
  })
}

export async function modifyApiRiskStatus(data = {}, params = {}) {
  return request('/console/ModifyApiRiskStatus', {
    method: 'POST',
    data,
    params,
  })
}

export async function getApiEvents(params = {}) {
  return request('/console/GetApiEvents', {
    method: 'GET',
    params,
  })
}

export async function modifyApiEventStatus(data = {}, params = {}) {
  return request('/console/ModifyApiEventStatus', {
    method: 'POST',
    data,
    params,
  })
}

export async function getApiTagsClustered(params = {}) {
  return request('/console/GetApiTagsClustered', {
    method: 'GET',
    params,
  })
}

export async function getApiTagEntitiesClustered(params = {}) {
  return request('/console/GetApiTagEntitiesClustered', {
    method: 'GET',
    params,
  })
}
