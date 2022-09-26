import request from '@/utils/request'

export async function getReports(params = {}) {
  return request('/console/GetReports', {
    method: 'GET',
    params,
  })
}

// 创建/修改 共用一个接口
export async function createPushReport(data = {}, params = {}) {
  return request('/console/CreatePushReport', {
    method: 'POST',
    data,
    params,
  })
}

export async function alarmSwitch(params = {}) {
  return request('/console/AlarmSwitch', {
    method: 'GET',
    params,
  })
}

export async function alarmDelete(params = {}) {
  return request('/console/AlarmDelete', {
    method: 'GET',
    params,
  })
}

export async function alarmPushTest(params = {}) {
  return request('/console/AlarmPushTest', {
    method: 'GET',
    params,
  })
}
