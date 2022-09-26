import { stringify } from 'querystring'
import { history, getIntl } from 'umi'
import { postUserLogin, getPublicKey } from '@/services/login'
import { setAuthority } from '@/utils/authority'
import { getPageQuery } from '@/utils/utils'
import { message, Modal } from 'antd'
import JsEncrypt from 'jsencrypt'
import moment from 'moment'

let loginFailedCount = 0

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const { Username, Password, Code } = payload
      const {
        Data: { Public },
      } = yield call(getPublicKey)
      const encryptor = new JsEncrypt()
      encryptor.setPublicKey(Public)
      const rsaPassword = encryptor.encrypt(Password)
      const response = yield call(postUserLogin, { Username, Password: rsaPassword, Code })

      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }) // Login successfully

      if (response.status === 'ok') {
        if (response.Role === 'Auditor') {
          return history.replace('/operate/systemOperationLog')
        }
        const urlParams = new URL(window.location.href)
        const params = getPageQuery()
        const intl = getIntl()
        message.success(intl.formatMessage({ id: 'pages.login.login.successful' }))

        let { redirect } = params

        if (redirect) {
          const redirectUrlParams = new URL(redirect)

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length)

            if (window.routerBase !== '/') {
              redirect = redirect.replace(window.routerBase, '/')
            }

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1)
            }
          } else {
            window.location.href = '/'
            return
          }
        }

        history.replace(redirect || '/')
      } else {
        loginFailedCount++
        if (loginFailedCount % 3 === 0) {
          Modal.warning({
            title: '提示',
            content: `登录失败已超过3次，请稍后重试\n${moment(Date.now()).format(
              'YYYY-MM-DD HH:mm:ss',
            )}`,
            okText: '确定',
            className: 'loginFailedModal',
          })
        }
      }
    },

    logout() {
      const { redirect } = getPageQuery() // Note: There may be security issues, please note

      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority)
      return { ...state, status: payload.status, type: payload.type, Role: payload.Role }
    },
  },
}
export default Model
