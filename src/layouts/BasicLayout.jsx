import ProLayout, { DefaultFooter } from '@ant-design/pro-layout'
import React, { useRef, useState, useEffect } from 'react'
import { Link, connect, history, SelectLang, getIntl, useLocation } from 'umi'
import { Menu, Dropdown, Space, Avatar, Typography } from 'antd'
import Authorized from '@/utils/Authorized'
import { logout } from '@/utils/utils'
import { getUsername, getUserRole } from '@/utils/user'
import logoFull from '../assets/logo_full.png'
import logoSimple from '../assets/logo_simple.png'
import {
  LogoutOutlined,
  RightOutlined,
  LeftOutlined,
  EllipsisOutlined,
  UserOutlined,
} from '@ant-design/icons'
import styles from './BasicLayout.less'
import { PermissionMap } from '@/constant/content'
import ThemeChange from '@/components/ThemeChange'

const intl = getIntl()
const roleMap = {
  Auditor: intl.formatMessage({ id: 'pages.settings.role.auditor' }),
  Guest: intl.formatMessage({ id: 'pages.settings.role.guest' }),
  Admin: intl.formatMessage({ id: 'pages.settings.role.admin' }),
  SuperAdmin: '超级管理员',
}
/** Use Authorized check all menu item */
const menuDataRender = (menuList) =>
  menuList.map((item) => {
    const localItem = {
      ...item,
      // name: item.locale && intl.formatMessage({ id: item.locale }),
      children: item.children ? menuDataRender(item.children) : undefined,
    }
    return Authorized.check(item.authority, localItem, null)
  })

const DefaultFooterDom = () => {
  // 需要隐藏 footer模块 的路由集合
  const HIDE_FOOTER_FOR_PATHS = ['/assets/graph']
  const location = useLocation()
  const { pathname } = location

  if (HIDE_FOOTER_FOR_PATHS.includes(pathname)) return null

  return <DefaultFooter copyright={`${new Date().getFullYear()} @ StarCross`} links={[]} />
}

const BasicLayout = (props) => {
  const [logo, setLogo] = useState('')
  const {
    collapsed,
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props

  useEffect(() => {
    setLogo(collapsed ? logoSimple : logoFull)
  }, [collapsed])

  const menuDataRef = useRef([])

  useEffect(() => {
    // aside 的前一个div
    const asidePrevEle = document.querySelector('.ant-layout div:first-child')
    asidePrevEle.className = collapsed ? 'aside-prev-ele-collapsed' : 'aside-prev-ele'
  }, [collapsed])

  const onCollapse = (payload) => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      })
    }
  }

  const menuExtraContent = () => {
    return (
      <div
        style={{ padding: '18px 2px', cursor: 'pointer' }}
        onClick={() => {
          onCollapse(!collapsed)
        }}
      >
        {collapsed ? (
          <RightOutlined />
        ) : (
          <LeftOutlined />
        )}
      </div>
    )
  }

  const menuFooterRender = () => {
    const userMenu = (
      <Menu>
        <Menu.Item
          key="personal"
          icon={<UserOutlined style={{ fontSize: collapsed ? 18 : 14 }} />}
          title="个人设置"
          onClick={() => history.push('/personal')}
        >
          {!collapsed && '个人设置'}
        </Menu.Item>
        <ThemeChange collapsed={collapsed} />
        <Menu.Item
          key="logout"
          icon={<LogoutOutlined style={{ fontSize: collapsed ? 18 : 14 }} />}
          title={intl.formatMessage({ id: 'globalHeader.logout' })}
          onClick={() => logout()}
        >
          {!collapsed && intl.formatMessage({ id: 'globalHeader.logout' })}
        </Menu.Item>
      </Menu>
    )
    return (
      <Dropdown
        overlay={userMenu}
        placement="topLeft"
        overlayClassName={collapsed ? 'user-dropdown-overlay-collapsed' : ''}
      >
        <div className={styles.menuFooter} style={{ padding: collapsed ? 6 : 16 }}>
          <Space>
            <Avatar
              style={{ backgroundColor: '#00a2ae', verticalAlign: 'middle' }}
              size={collapsed ? 36 : 'large'}
              gap={2}
            >
              {getUsername().charAt(0).toUpperCase()}
            </Avatar>
            {!collapsed && (
              <div>
                <div>
                  <Typography.Text
                    style={{
                      maxWidth: '100%',
                      color: 'rgba(255, 255, 255, 0.76)',
                      fontSize: 16,
                    }}
                    ellipsis={{ tooltip: getUsername() }}
                  >
                    {getUsername()}
                  </Typography.Text>
                </div>
                <div>
                  <Typography.Text
                    style={{
                      maxWidth: '100%',
                      color: 'rgba(255, 255, 255, 0.76)',
                      fontSize: 12,
                    }}
                    ellipsis={{ tooltip: roleMap[getUserRole()] }}
                  >
                    {roleMap[getUserRole()]}
                  </Typography.Text>
                </div>
              </div>
            )}
          </Space>
          {!collapsed && <EllipsisOutlined style={{ color: 'rgba(255, 255, 255, 0.76)' }} />}
        </div>
      </Dropdown>
    )
  }

  return (
    <ProLayout
      className={styles.layout}
      headerRender={false}
      onPageChange={({ pathname }) => {
        const Role = getUserRole()
        if (Role === 'SuperAdmin') return
        const allowPaths = PermissionMap[Role] || []
        if (!allowPaths.includes(pathname)) return history.push('/404')
      }}
      logo={logo}
      title={''}
      {...props}
      {...settings}
      iconfontUrl={require('@/assets/iconfont/iconfont-svg')}
      collapsed={collapsed}
      onCollapse={onCollapse}
      menuExtraRender={menuExtraContent}
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (
          menuItemProps.isUrl ||
          !menuItemProps.path ||
          location.pathname === menuItemProps.path
        ) {
          return defaultDom
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>
      }}
      breadcrumbRender={(routers = []) => {
        return [
          // {
          //   path: '/',
          //   breadcrumbName: intl.formatMessage({ id: 'menu.breadcrumb.home' }),
          // },
          ...routers,
        ]
      }}
      breadcrumbProps={{
        separator: '|',
      }}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0
        const last = routes.indexOf(route) === routes.length - 1

        return first || last ? (
          <span>{route.breadcrumbName}</span>
        ) : (
          <span
            className={styles.breadcrumbLink}
            onClick={() => {
              history.push(route.path)
            }}
          >
            {route.breadcrumbName}
          </span>
        )
      }}
      footerRender={() => {
        if (settings.footerRender || settings.footerRender === undefined) {
          return <DefaultFooterDom />
        }

        return null
      }}
      menuDataRender={menuDataRender}
      postMenuData={(menuData) => {
        menuDataRef.current = menuData || []
        return menuData || []
      }}
      contentStyle={{ paddingTop: 24 }}
      siderWidth={232}
      collapsedButtonRender={false}
      menuFooterRender={menuFooterRender}
    >
      {children}
    </ProLayout>
  )
}

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout)
