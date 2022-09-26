/* eslint-disable no-underscore-dangle */
import { parse } from 'querystring'
import moment from 'moment'
import { history, getLocale } from 'umi'
import { postUserLogout } from '@/services/login'
import { getUserId, removeToken, removeUserId, removeUsername, removeUserRole } from './user'
import { removeAuthority } from './authority'
import { getTheme } from './user'
import numeral from 'numeral'

const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/
export const isUrl = (path) => reg.test(path)
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true
  }

  return window.location.hostname === 'preview.pro.ant.design'
} // For the official demo site, it is used to turn off features that are not needed in the real development environment

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env

  if (NODE_ENV === 'development') {
    return true
  }

  return isAntDesignPro()
}
export const getPageQuery = () => parse(window.location.href.split('?')[1])

const fixedZero = (val) => {
  return val * 1 < 10 ? `0${val}` : val
}

// 获取当天、7天、30天时间段
export const getTimeDistance = (type) => {
  if (!type) return
  const now = new Date()
  const oneDay = 1000 * 60 * 60 * 24

  now.setHours(0)
  now.setMinutes(0)
  now.setSeconds(0)
  now.setMilliseconds(0)
  if (type === 'week') {
    const beginTime = now.getTime() - 6 * oneDay

    return [moment(beginTime), moment(now.getTime() + (oneDay - 1))]
  }

  if (type === 'month') {
    const beginTime = now.getTime() - 29 * oneDay

    // return [moment(beginTime), moment(endTime)];  // endTime为当下时分秒
    return [moment(beginTime), moment(now.getTime() + (oneDay - 1))] // endTime为23:59:59
  }
}

export function logout() {
  postUserLogout({ UserId: getUserId() })
    .catch((err) => console.log('退出接口报错 >>>', err))
    .finally(() => {
      removeToken()
      removeUserId()
      removeUsername()
      removeAuthority()
      removeUserRole()
      history.replace('/user/login')
    })
}

/**
 * 返回接口所需的语言类型
 * @returns {string} Zh | En
 */
export function getLocaleForAPI() {
  const localeMap = {
    'zh-CN': 'Zh',
    'en-US': 'En',
  }
  const locale = getLocale()

  return localeMap[locale]
}

const hours = ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22']

function getUniqNum() {
  return Number(
    `${Math.floor(Math.random() * 100000)}${Math.floor(Math.random() * 100000)}${Math.floor(
      Math.random() * 100000,
    )}`,
  )
}

/**
 * 补齐行为日历图表数据
 * @param {Array} data 待填充的真实数据
 * @param {object} params 参数
 * @returns {Array} 补齐的完整数据
 */
export function fillRequestTrends(data, { StartTime, Count }) {
  const fullList = []
  const oneDay = 1000 * 3600 * 24
  const _startTime = new Date(StartTime).getTime()

  Array.from({ length: Count }).forEach((_, i) => {
    const timing = _startTime + oneDay * i
    const date = moment(timing).format('YYYY-MM-DD')

    hours.forEach((h) =>
      fullList.push({
        Count: 0,
        Date: date,
        Hour: h,
        Index: getUniqNum(),
      }),
    )
  })

  for (let i = 0; i < fullList.length; i++) {
    const ele = fullList[i]
    const finded = data.find((e) => e.Date === ele.Date && e.Hour === ele.Hour)

    if (finded) {
      fullList.splice(i, 1, finded)
    }
  }

  return fullList
}

/**
 * 图表数据补齐(向前补0)
 * @param {Array} numArr 原数字数组
 * @param {Number} count 目标长度
 * @returns {Array} 补齐数据的数组
 */
export function fillStart(numArr = [], count = 15) {
  const arr = numArr.slice()
  const diffCount = count - numArr.length

  Array.from({ length: diffCount }).forEach(() => arr.unshift(0))

  return arr
}

/**
 * 校验json格式合法性
 * @param {string} str 要校验的json字符串
 * @returns {boolean}
 */
export function isJSON(str) {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str)

      if (typeof obj === 'object' && obj) {
        return true
      }

      return false
    } catch (e) {
      console.log(`error: ${str}, ${e}`)
      return false
    }
  }
  console.log('It is not a string!')
  return false
}

export function initTheme() {
  const theme = getTheme() || 'dark'
  const body = document.getElementsByTagName('body')[0]
  if (theme === 'dark') {
    body.className = 'body-wrap-dark'
  } else {
    body.className = 'body-wrap-light'
  }
}

export function numFormat(num) {
  let res = null

  if (num >= 10000) {
    res = numeral(Math.round(num / 1000) / 10).format('0,0') + ' w'
  } else {
    res = numeral(num).format('0,0')
  }

  return res
}
