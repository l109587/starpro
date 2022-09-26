import component from './en-US/component'
import globalHeader from './en-US/globalHeader'
import menu from './en-US/menu'
import settings from './en-US/settings'
import pages from './en-US/pages'
import utilsMessage from './en-US/utilsMessage'

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  ...component,
  ...globalHeader,
  ...menu,
  ...settings,
  ...pages,
  ...utilsMessage,
}
