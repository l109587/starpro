import request from '@/utils/request'

export async function getTableData(params) {
  return request('/console/ListIssues', {
    method: 'GET',
    params, 
  })
}
export async function getIssuesStat(params) {
  return request('/console/GetIssuesStat', {
    method: 'GET',
    params,
  })
}

export async function getTrendsData(params) {
  return request('/console/ListIssuesTrends', {
    method: 'GET',
    params,
  })
}
export async function getTopListData(params) {
  return request('/console/ListIssuesTopHosts', {
    method: 'GET',
    params,
  })
}
export async function getIssuesDetails(params) {
  return request('/console/GetIssueDetails', {
    method: 'GET',
    params,
  })
}

export async function modifyStatus(params) {
  return request('/console/ModifyIssuesStatus', {
    method: 'POST',
    data: params,
  })
}