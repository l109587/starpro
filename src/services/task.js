import request from '@/utils/request'

// 获取任务实例趋势 - GetTaskRunTrends
export async function getTaskRunTrends(params) {
  return request(`/console/GetTaskRunTrends`, {
    method: 'GET',
    params,
  })
}

// 获取任务统计信息 - GetTasksStat
export async function getTasksStat(params) {
  return request(`/console/GetTasksStat`, {
    method: 'GET',
    params,
  })
}

// 获取任务实例统计信息 - GetTaskRunsStat
export async function getTaskRunsStat(params) {
  return request(`/console/GetTaskRunsStat`, {
    method: 'GET',
    params,
  })
}

// 获取任务实例列表
export async function getListTaskRuns(params) {
  return request(`/console/ListTaskRuns`, {
    method: 'GET',
    params,
  })
}

// 启动任务实例 - StartTaskRun
export async function startTaskRuns(params) {
  return request('/console/StartTaskRuns', {
    method: 'POST',
    data: params,
  })
}

// 停止任务实例 - StopTaskRuns
export async function stopTaskRuns(params) {
  return request('/console/StopTaskRuns', {
    method: 'POST',
    data: params,
  })
}

// 删除任务实例 - DeleteTaskRuns
export async function deleteTaskRuns(params) {
  return request('/console/DeleteTaskRuns', {
    method: 'POST',
    data: params,
  })
}

// 获取任务列表 - ListTasks
export async function getListTasks(params) {
  return request(`/console/ListTasks`, {
    method: 'GET',
    params,
  })
}

// 删除任务 - DeleteTasks
export async function deleteTasks(params) {
  return request(`/console/DeleteTasks`, {
    method: 'POST',
    data: params,
  })
}

// 创建任务 - CreateTask
export async function createTask(params) {
  return request(`/console/CreateTask`, {
    method: 'POST',
    data: params,
  })
}

// 获取任务详情 - GetTaskDetails
export async function getTaskDetails(params) {
  return request(`/console/GetTaskDetails`, {
    method: 'GET',
    params,
  })
}

// 修改任务 - ModifyTask
export async function modifyTask(params) {
  return request(`/console/ModifyTask`, {
    method: 'POST',
    data: params,
  })
}
