import { useState } from 'react'
import { Button, Modal, Form, Input, message } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import styles from './index.less'
import { postModifyPassword } from '@/services/settings'
import { getUserId } from '@/utils/user'
import { getIntl, useIntl } from 'umi'

function EditPasswordModal({ visible, onSave, onCancel }) {
  const intl = getIntl()
  const [form] = Form.useForm()
  const newPasswordValidator = (_, value) => {
    const passwordReg = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}/

    if (!value)
      return Promise.reject(
        new Error(intl.formatMessage({ id: 'pages.settings.new.pwd.required' })),
      )
    if (!passwordReg.test(value))
      return Promise.reject(
        new Error(intl.formatMessage({ id: 'pages.settings.new.pwd.invalid' })),
      )
    return Promise.resolve()
  }

  return (
    <Modal
      visible={visible}
      width={450}
      title={intl.formatMessage({ id: 'pages.settings.edit.pwd' })}
      okText={intl.formatMessage({ id: 'component.button.save' })}
      cancelText={intl.formatMessage({ id: 'component.button.cancel' })}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      onOk={() => {
        form
          .validateFields()
          .then(async (values) => {
            const isOk = await onSave(values)
            if (isOk) form.resetFields()
          })
          .catch((info) => {
            console.log('Form validation failed:', info)
          })
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name="CurrentPassword"
          label={intl.formatMessage({ id: 'pages.settings.current.pwd' })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'pages.settings.current.pwd.required' }),
            },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>
        <Form.Item
          name="NewPassword"
          label={intl.formatMessage({ id: 'pages.settings.new.pwd' })}
          rules={[
            {
              required: true,
              message: '',
            },
            {
              validator: newPasswordValidator,
            },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>
        <Form.Item
          name="RepeatNewPassword"
          label={intl.formatMessage({ id: 'pages.settings.new.pwd.repeat' })}
          dependencies={['NewPassword']}
          rules={[
            {
              required: true,
              message: '',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value)
                  return Promise.reject(
                    new Error(intl.formatMessage({ id: 'pages.settings.new.pwd.repeat.required' })),
                  )
                if (getFieldValue('NewPassword') === value) return Promise.resolve()
                return Promise.reject(
                  new Error(intl.formatMessage({ id: 'pages.settings.twice.pwd.not.match' })),
                )
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default function SecurityPart({ mySettings, onEditSettingsSuccess }) {
  const [visible, setVisible] = useState(false)
  const intl = useIntl()

  const onSave = async ({ CurrentPassword, NewPassword }) => {
    const body = {
      CurrentPassword,
      NewPassword,
      UserId: getUserId(),
    }
    const { Code, status } = await postModifyPassword(body)

    if (status === 403)
      return !message.error(intl.formatMessage({ id: 'pages.settings.current.pwd.left' }))

    if (Code !== 'Succeed') return

    setVisible(false)
    message.success(intl.formatMessage({ id: 'pages.settings.edit.pwd.success' }))
    onEditSettingsSuccess()
    return true
  }
  const textFormat = (time) => {
    if (!time) return '-'

    const fullYear = new Date(time).getFullYear()
    if (fullYear === 1970) return '-'

    const text = intl.formatMessage({ id: 'pages.settings.pwd.changed.on' })
    const date = intl.formatDate(time, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const msg = `${text} ${date}`

    return msg
  }

  return (
    <div className={styles.securityPart}>
      <div className={styles.settingPartTittle}>
        {intl.formatMessage({ id: 'pages.settings.security' })}
      </div>
      <div className={styles.securityMessage}>{textFormat(mySettings.UpdatePasswordAt)}</div>
      <Button size="middle" icon={<LockOutlined />} onClick={() => setVisible(true)}>
        {intl.formatMessage({ id: 'pages.settings.button.edit.pwd' })}
      </Button>
      <EditPasswordModal
        visible={visible}
        onSave={onSave}
        onCancel={() => {
          setVisible(false)
        }}
      />
    </div>
  )
}
