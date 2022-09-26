import request from '@/utils/request'

export async function getUsers(params = {}) {
  return request('/console/ListUsers', {
    method: 'GET',
    params,
  })
}

export async function getUserSettings(params = {}) {
  return request('/console/GetUserSettings', {
    method: 'GET',
    params,
  })
}

export async function postEditEmail(data = {}, params = {}) {
  return request('/console/EditEmail', {
    method: 'POST',
    data,
    params,
  })
}

export async function postModifyPassword(data = {}, params = {}) {
  return request('/console/ModifyPassword', {
    method: 'POST',
    data,
    params,
  })
}

export async function postCreateUser(data = {}, params = {}) {
  return request('/console/CreateUser', {
    method: 'POST',
    data,
    params,
  })
}

export async function postEditUser(data = {}, params = {}) {
  return request('/console/EditUser', {
    method: 'POST',
    data,
    params,
  })
}

export async function postDeleteUsers(data = {}, params = {}) {
  return request('/console/DeleteUsers', {
    method: 'POST',
    data,
    params,
  })
}
