import request from '@/utils/request'
import { setToken, setUserId, setUsername, setUserRole } from '@/utils/user'

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  })
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`)
}

export async function postUserLogin(data = {}, params = {}) {
  try {
    const { Code, Data, status } = await request('/console/UserLogin', {
      method: 'POST',
      data,
      params,
    })

    if (status === 423)
      return {
        currentAuthority: 'guest',
        status: 'codeError',
        type: 'account',
      }

    if (status === 424)
      return {
        currentAuthority: 'guest',
        status: 'ipError',
        type: 'account',
      }

    if (Code !== 'Succeed')
      return {
        currentAuthority: 'guest',
        status: 'error',
        type: 'account',
      }

    const { Token, UserId, Username = '', Role } = Data

    setToken(Token)
    setUserId(UserId)
    setUsername(Username)
    setUserRole(Role)

    return {
      currentAuthority: 'admin',
      status: 'ok',
      type: 'account',
      Role,
    }
  } catch (err) {
    return {
      currentAuthority: 'guest',
      status: 'error',
      type: 'account',
    }
  }
}

export async function postUserLogout(data = {}, params = {}) {
  return request('/console/UserLogout', {
    method: 'POST',
    data,
    params,
  })
}

export async function getPublicKey(params = {}) {
  return request('/console/GetPublicKey', {
    method: 'GET',
    params,
  })
}

export async function getCode(params = {}) {
  return request('/console/GetCode', {
    method: 'GET',
    params,
  })
}
