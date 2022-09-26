import { useState, useRef } from 'react'
import { Button, Input, Space, Form, message } from 'antd'
import styles from './index.less'
import { postEditEmail } from '@/services/settings'
import { getUserId } from '@/utils/user'
import { useIntl } from 'umi'

export default function AccountPart(props) {
  // states
  const { mySettings, onEditSettingsSuccess } = props
  const intl = useIntl()
  const inputRef = useRef(null)
  const [editable, setEditable] = useState(false)
  const [form] = Form.useForm()
  const roleMap = {
    Auditor: intl.formatMessage({ id: 'pages.settings.role.auditor' }),
    Guest: intl.formatMessage({ id: 'pages.settings.role.guest' }),
    Admin: intl.formatMessage({ id: 'pages.settings.role.admin' }),
    SuperAdmin: '超级管理员',
  }

  // event handlers
  const onCancel = () => {
    setEditable(false)
  }
  const onShowEdit = () => {
    form.resetFields()
    setEditable(true)
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus({ cursor: 'end' })
    }, 100)
  }
  const onSubmit = () => {
    form
      .validateFields()
      .then(async ({ Email }) => {
        const body = {
          UserId: getUserId(),
          Email,
        }
        const { Code, Message } = await postEditEmail(body)

        // failed
        if (Code !== 'Succeed') return

        // successed
        onEditSettingsSuccess()
        setEditable(false)
        message.success(intl.formatMessage({ id: 'pages.settings.email.modify.success' }))
      })
      .catch((err) => console.log(err))
  }

  // components
  const EmailRead = () => {
    return (
      <>
        <span className="accountInfoLeft">{mySettings.Email}</span>
        <Button type="link" style={{ padding: '0' }} onClick={onShowEdit}>
          {intl.formatMessage({ id: 'component.button.edit' })}
        </Button>
      </>
    )
  }
  const EmailEdit = () => {
    return (
      <>
        <Form form={form} initialValues={{ Email: mySettings.Email }}>
          <Form.Item
            name="Email"
            className={styles.emailEditFormItem}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'pages.settings.email.required' }),
              },
              {
                pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                message: intl.formatMessage({ id: 'pages.settings.email.invalid' }),
              },
              { max: 50, message: intl.formatMessage({ id: 'pages.settings.email.max' }) },
            ]}
          >
            <Input
              ref={inputRef}
              placeholder={intl.formatMessage({ id: 'pages.settings.email.placeholder' })}
              style={{ width: '250px' }}
            />
          </Form.Item>
        </Form>
        <Space size="small">
          <Button type="link" size="small" style={{ padding: '0' }} onClick={onSubmit}>
            {intl.formatMessage({ id: 'component.button.save' })}
          </Button>
          <Button type="link" size="small" style={{ padding: '0' }} danger onClick={onCancel}>
            {intl.formatMessage({ id: 'component.button.cancel' })}
          </Button>
        </Space>
      </>
    )
  }

  return (
    <div className={styles.settingPart}>
      <div className={styles.settingPartTittle}>
        {intl.formatMessage({ id: 'pages.settings.account' })}
      </div>
      <div className={styles.settingAccount}>
        <div className={styles.accountInfoItem}>
          <span className="accountInfoLeft">{mySettings.Accounts}</span>
          <span className="accountInfoRight">{roleMap[mySettings.Role]}</span>
        </div>
        <div className={styles.accountInfoItem}>{editable ? <EmailEdit /> : <EmailRead />}</div>
      </div>
    </div>
  )
}
