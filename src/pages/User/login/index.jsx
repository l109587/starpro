import { LockOutlined, UserOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import { Alert, Row, Col } from 'antd'
import React, { useState, useEffect } from 'react'
import ProForm, { ProFormText } from '@ant-design/pro-form'
import { connect, Link, useIntl, getIntl, useModel } from 'umi'
import styles from './index.less'
import logo from '@/assets/logo_full.png'
import { getCode } from '@/services/login'

const LoginMessage = ({ status }) => {
  const intl = getIntl()
  const msgMap = {
    error: intl.formatMessage({ id: 'pages.login.login.incorrect' }),
    codeError: '验证码错误',
    ipError: '登录IP未在白名单范围，请联系管理员处理',
  }
  const msg = msgMap[status]
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={msg}
      type="error"
      showIcon
    />
  )
}

const Login = (props) => {
  const { userLogin = {}, submitting } = props
  const { status, type: loginType, Role } = userLogin
  const [type, setType] = useState('account')
  const intl = useIntl()
  const { setInitialState } = useModel('@@initialState')
  const [captcha, setCaptcha] = useState('')

  useEffect(() => {
    if (!Role) return

    setInitialState({ Role })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Role])

  const fetchCode = async () => {
    const {
      Data: { Code },
    } = await getCode()

    setCaptcha(Code)
  }

  useEffect(() => {
    fetchCode()
  }, [])

  useEffect(() => {
    if (!submitting && status === 'codeError') {
      fetchCode()
    }
  }, [submitting, status])

  const handleSubmit = async (values) => {
    const { dispatch } = props

    dispatch({
      type: 'login/login',
      payload: { ...values, type },
    })
  }

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <Link to="/">
          <img alt="logo" className={styles.logo} src={logo} />
        </Link>
      </div>
      <ProForm
        isKeyPressSubmit={true}
        submitter={{
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            loading: submitting,
            size: 'large',
            style: {
              width: '100%',
            },
          },
          searchConfig: {
            submitText: intl.formatMessage({ id: 'pages.login.login.button' }),
          },
        }}
        onFinish={(values) => {
          handleSubmit(values)
          return Promise.resolve()
        }}
      >
        {status && status !== 'ok' && !submitting && <LoginMessage status={status} />}

        <ProFormText
          name="Username"
          placeholder={intl.formatMessage({ id: 'pages.login.username.placeholder' })}
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined className={styles.prefixIcon} />,
          }}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'pages.login.account.required' }),
            },
          ]}
        />
        <ProFormText.Password
          name="Password"
          placeholder={intl.formatMessage({ id: 'pages.login.password.placeholder' })}
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={styles.prefixIcon} />,
          }}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'pages.login.password.required' }),
            },
          ]}
        />
        <Row gutter={10}>
          <Col flex="auto" className={styles.captchaInputCol}>
            <ProFormText
              name="Code"
              placeholder="验证码"
              fieldProps={{
                size: 'large',
                prefix: <SafetyCertificateOutlined className={styles.prefixIcon} />,
              }}
              rules={[
                {
                  required: true,
                  message: '请输入验证码',
                },
              ]}
            />
          </Col>
          <Col flex="100px">
            <img src={captcha} className={styles.captchaImg} onClick={() => fetchCode()} />
          </Col>
        </Row>
      </ProForm>
    </div>
  )
}

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login)
