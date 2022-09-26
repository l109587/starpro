import component from './zh-CN/component'
import globalHeader from './zh-CN/globalHeader'
import menu from './zh-CN/menu'
import settings from './zh-CN/settings'
import pages from './zh-CN/pages'
import utilsMessage from './zh-CN/utilsMessage'

export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  ...component,
  ...globalHeader,
  ...menu,
  ...settings,
  ...pages,
  ...utilsMessage,
}
