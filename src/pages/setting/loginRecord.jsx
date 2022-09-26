import { Divider, Button } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import styles from './index.less'
import { logout } from '@/utils/utils'
import { useIntl } from 'umi'

export default function LoginRecord(props) {
  const intl = useIntl()
  const { mySettings = {} } = props
  const onLogout = () => {
    logout()
  }

  return (
    <div className={styles.loginRecordPart}>
      <div className={styles.settingPartTittle}>
        {intl.formatMessage({ id: 'pages.settings.login.records' })}
      </div>
      <div className={styles.loginRecordText}>
        {mySettings.LoginedAt
          ? intl.formatDate(mySettings.LoginedAt, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : '-'}
      </div>
      <Divider />
      <Button size="middle" icon={<LogoutOutlined />} onClick={onLogout}>
        {intl.formatMessage({ id: 'pages.settings.button.logout' })}
      </Button>
    </div>
  )
}
