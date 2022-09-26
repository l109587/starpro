import request from '@/utils/request'

// 获取app列表 - 分页
export async function getApps(params) {
  return request(`/console/ListApps`, {
    method: 'GET',
    params,
  })
}

// 获取子节点
export async function getBranchUrls(params) {
  return request(`/console/ListAppSitemapBranchUrlNodes`, {
    method: 'GET',
    params,
  })
}

// 获取api子节点
export async function getBranchApis(params) {
  return request(`/console/ListAppSitemapBranchApiNodes`, {
    method: 'GET',
    params,
  })
}

// 获取urls根结点
export async function getRootUrls(params) {
  return request(`/console/ListAppSitemapRootUrlNodes`, {
    method: 'GET',
    params,
  })
}

// 获取apis根结点
export async function getRootApis(params) {
  return request(`/console/ListAppSitemapRootApiNodes`, {
    method: 'GET',
    params,
  })
}

// 获取url节点下所有叶子节点api
export async function getListAppNodeUrls(params) {
  return request(`/console/ListAppNodeUrls`, {
    method: 'GET',
    params,
  })
}

// 获取api节点下所有叶子节点api
export async function getListAppNodeApis(params) {
  return request(`/console/ListAppNodeApis`, {
    method: 'GET',
    params,
  })
}

// 删除apis
export async function deleteApiIds(params) {
  return request(`/console/DeleteAppApis`, {
    method: 'POST',
    data: params,
  })
}

// 获取api详情
export async function getApiDetails(params) {
  return request(`/console/GetApiDetails`, {
    method: 'GET',
    params,
  })
}

// 创建应用
export async function createApp(params) {
  return request('/console/CreateApp', {
    method: 'POST',
    data: params,
  })
}

// 添加api到app
export async function addUrlsToApps(url, params) {
  return request(url, {
    method: 'POST',
    data: params,
  })
}

// 获取app应用详情
export async function getAppBriefInfo(params) {
  return request('/console/GetAppBriefInfo', {
    method: 'GET',
    params,
  })
}

// 获取api安全事件列表 - ListApiEvents
export async function getListApiEvents(params) {
  return request('/console/ListApiEvents', {
    method: 'GET',
    params,
  })
}

// 获取api漏洞风险列表 - ListApiIssues
export async function getListApiIssues(params) {
  return request('/console/ListApiIssues', {
    method: 'GET',
    params,
  })
}

// 获取应用趋势图信息
export async function getListAppSecurityTrends(params) {
  return request('/console/ListAppSecurityTrends', {
    method: 'GET',
    params,
  })
}

// ModifyIssuesStatus
export async function modifyIssuesStatus(params) {
  return request('/console/ModifyIssuesStatus', {
    method: 'POST',
    data: params,
  })
}

// ModifyEventStatus
export async function modifyEventStatus(params) {
  return request('/console/ModifyEventsStatus', {
    method: 'POST',
    data: params,
  })
}

// 获取应用安全影响 TOP 资产 - ListAppSecurityTopHosts
export async function getListAppSecurityTopHosts(params) {
  return request('/console/ListAppSecurityTopHosts', {
    method: 'GET',
    params,
  })
}

// 删除应用
export async function deleteApp(params) {
  return request('/console/DeleteApp', {
    method: 'POST',
    data: params,
  })
}

// 获取URL的数据标签
export async function getAppApiUrlTagsClustered(params) {
  return request('/console/GetAppApiUrlTagsClustered', {
    method: 'GET',
    params,
  })
}

// 获取URL的数据标签实体
export async function getAppApiUrlTagEntitiesClustered(params) {
  return request('/console/GetAppApiUrlTagEntitiesClustered', {
    method: 'GET',
    params,
  })
}

// 获取输入联想
export async function searchDomainMatch(params) {
  return request('/console/SearchDomainMatch', {
    method: 'POST',
    data: params,
  })
}

// 编辑应用
export async function modifyApp(params) {
  return request('/console/ModifyApp', {
    method: 'POST',
    data: params,
  })
}

// 获取API详情
export async function getApiDetailsInfo(params) {
  return request('/console/GetApiDetailsInfo', {
    method: 'GET',
    params,
  })
}

// 获取资产拓扑图数据
export async function getAssetsVisualization(params) {
  return request('/console/GetAssetsVisualization', {
    method: 'GET',
    params,
  })
}

// 获取资产拓扑图API列表
export async function getAssetsVisualizationApis(params) {
  return request('/console/GetAssetsVisualizationApis', {
    method: 'GET',
    params,
  })
}
