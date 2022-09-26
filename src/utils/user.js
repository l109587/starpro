const APP_TOKEN = 'APP_USER_TOKEN'
const APP_USER_ID = 'APP_GLOBAL_USER_ID'
const APP_USERNAME = 'APP_GLOBAL_USERNAME'
const APP_ROLE = 'APP_GLOBAL_USER_ROLE'
const APP_THEME = 'APP_THEME'

export function setToken(val) {
  window.localStorage.setItem(APP_TOKEN, val)
}

export function getToken() {
  return window.localStorage.getItem(APP_TOKEN)
}

export function removeToken() {
  window.localStorage.removeItem(APP_TOKEN)
}

export function setUserId(val) {
  window.localStorage.setItem(APP_USER_ID, val)
}

export function getUserId() {
  return window.localStorage.getItem(APP_USER_ID)
}

export function removeUserId() {
  window.localStorage.removeItem(APP_USER_ID)
}

export function setUsername(val) {
  window.localStorage.setItem(APP_USERNAME, val)
}

export function getUsername() {
  return window.localStorage.getItem(APP_USERNAME)
}

export function removeUsername() {
  window.localStorage.removeItem(APP_USERNAME)
}

export function setUserRole(val) {
  window.localStorage.setItem(APP_ROLE, val)
}

export function getUserRole() {
  return window.localStorage.getItem(APP_ROLE)
}

export function removeUserRole() {
  window.localStorage.removeItem(APP_ROLE)
}

export function setTheme(val) {
  window.localStorage.setItem(APP_THEME, val)
}

export function getTheme() {
  return window.localStorage.getItem(APP_THEME)
}

export function removeTheme() {
  window.localStorage.removeItem(APP_THEME)
}
