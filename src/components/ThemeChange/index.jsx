import { useState } from 'react'
import { Menu } from 'antd'
import { getTheme, setTheme } from '@/utils/user'
import { BgColorsOutlined } from '@ant-design/icons'
import { connect } from 'umi'

const ThemeChange = ({ collapsed, dispatch }) => {
  const theme = getTheme() || 'dark'
  const [isDark, setIsDark] = useState(theme === 'dark')

  const onChangeTheme = () => {
    const body = document.getElementsByTagName('body')[0]
    if (isDark) {
      body.className = 'body-wrap-light'
    } else {
      body.className = 'body-wrap-dark'
    }
    setTheme(isDark ? 'light' : 'dark')
    setIsDark(!isDark)
    dispatch &&
      dispatch({
        type: 'global/setTheme',
        payload: isDark ? 'light' : 'dark',
      })
  }

  return (
    <Menu.Item
      key="theme"
      icon={<BgColorsOutlined style={{ fontSize: collapsed ? 18 : 14 }} />}
      title={isDark ? '浅色模式' : '深色模式'}
      onClick={onChangeTheme}
    >
      {!collapsed && (isDark ? '浅色模式' : '深色模式')}
    </Menu.Item>
  )
}

export default connect(() => ({}))(ThemeChange)
