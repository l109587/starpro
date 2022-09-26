import request from '@/utils/request'

// 获取实体识别策略列表
export async function getEntitiesStrategys(params = {}) {
  return request('/console/GetEntitiesStrategys', {
    method: 'GET',
    params,
  })
}
// 批量开启或关闭策略开关
export async function modifyEntitiesStrategysOnOff(data = {}) {
  return request('/console/ModifyEntitiesStrategysOnOff', {
    method: 'POST',
    data,
  })
}
// 获取Url忽略列表
export async function getUrlIgnores(params = {}) {
  return request('/console/GetUrlIgnores', {
    method: 'GET',
    params,
  })
}
// 新增URL策略
export async function addUrlStrategy(data = {}) {
  return request('/console/AddUrlStrategy', {
    method: 'POST',
    data,
  })
}
// 编辑Url策略
export async function updateUrlStrategy(data = {}) {
  return request('/console/UpdateUrlStrategy', {
    method: 'POST',
    data,
  })
}
// 删除Url策略
export async function deleteUrlStrategys(data = {}) {
  return request('/console/DeleteUrlStrategys', {
    method: 'POST',
    data,
  })
}

// 批量忽略或不忽略Url策略开关
export async function modifyUrlStrategysOnOff(data = {}) {
  return request('/console/ModifyUrlStrategysOnOff', {
    method: 'POST',
    data,
  })
}

export async function getAlarmTestList(params = {}) {
  return request('/console/GetSafeEvent', {
    method: 'GET',
    params,
  })
}

export async function createEntitiesStrategys(data = {}) {
  return request('/console/CreateEntitiesStrategys', {
    method: 'POST',
    data,
  })
}

export async function deleteEntitiesStrategys(data = {}) {
  return request('/console/DeleteEntitiesStrategys', {
    method: 'POST',
    data,
  })
}

export async function createSafeEvent(data = {}) {
  return request('/console/CreateSafeEvent', {
    method: 'POST',
    data,
  })
}

export async function deleteSafeEvent(data = {}) {
  return request('/console/DeleteSafeEvent', {
    method: 'POST',
    data,
  })
}

export async function entityImmediateDetection(data = {}) {
  return request('/console/EntityImmediateDetection', {
    method: 'POST',
    data,
  })
}

export async function safeEventImmediateDetection(data = {}) {
  return request('/console/SafeEventImmediateDetection', {
    method: 'POST',
    data,
  })
}
