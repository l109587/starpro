import React from 'react'
import { PageLoading } from '@ant-design/pro-layout'
import { Redirect, connect } from 'umi'
import { stringify } from 'querystring'
import { getToken } from '@/utils/user'

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    })
  }

  render() {
    const { isReady } = this.state
    const { children, loading } = this.props // You can replace it to your authentication rule (such as check token exists)
    // You can replace it with your own login authentication rules (such as judging whether the token exists)
    // 判断是否登录过
    const token = getToken()
    const isLogin = !!token
    const queryString = stringify({
      redirect: window.location.href,
    })

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />
    }

    if (!isLogin && window.location.pathname !== '/user/login') {
      return <Redirect to={`/user/login?${queryString}`} />
    }

    return children
  }
}

export default connect(({ user, loading }) => ({
  loading: loading.models.user,
}))(SecurityLayout)
