import request from '@/utils/request'

export async function getSystemLogs(params = {}) {
  return request('/console/GetSysLog', {
    method: 'GET',
    params,
  })
}
export async function queryLogToKafka(params = {}) {
  return request('/console/QueryLogToKafka', {
    method: 'GET',
    params,
  })
}
export async function createLogToKafka(params = {}) {
  return request('/console/CreateLogToKafka', {
    method: 'GET',
    params,
  })
}
