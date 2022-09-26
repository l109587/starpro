import { Button, Space, Popover, Typography, Tooltip } from 'antd'
import { EllipsisOutlined } from '@ant-design/icons'
import { history, useSelector } from 'umi'
import styles from './Applications.less'

const Applications = ({ apps = [], count = 2 }) => {
  const theme = useSelector(({ global }) => global.theme)
  const textColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)'
  const top = apps.slice(0, count)
  const rest = apps.slice(count)
  const toAppDetails = (e, appId) => {
    e.stopPropagation()
    history.push({
      pathname: '/assets/api/app',
      query: {
        appId,
      },
    })
  }
  const styleSheet = {
    dark: {
      backgroundColor: '#1D1D42',
      border: '1px solid #3C4254',
    },
    light: {
      backgroundColor: '#fff',
      border: '1px solid #A3AED0',
    },
  }
  const restApps = () => {
    return (
      <div>
        {rest.map((item) => {
          return (
            <div
              key={item.AppId}
              className={styles.application}
              style={{ ...styleSheet[theme], marginBottom: 6 }}
              onClick={(e) => toAppDetails(e, item.AppId)}
            >
              <Typography.Text
                style={{
                  fontSize: 12,
                  maxWidth: 80,
                  color: textColor,
                }}
                ellipsis={{ tooltip: item.Name || item.AppName }}
              >
                {item.Name || item.AppName}
              </Typography.Text>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Space style={{ paddingRight: 24 }}>
      {top.length ? (
        top.map((item) => {
          return (
            <div
              key={item.AppId}
              className={styles.application}
              style={{ ...styleSheet[theme] }}
              onClick={(e) => toAppDetails(e, item.AppId)}
            >
              <Typography.Text
                style={{
                  fontSize: 12,
                  maxWidth: 60,
                  color: textColor,
                }}
                ellipsis={{ tooltip: item.Name || item.AppName }}
              >
                {item.Name || item.AppName}
              </Typography.Text>
            </div>
          )
        })
      ) : (
        <Tooltip title="无相关应用">-</Tooltip>
      )}
      {!!rest.length && (
        <Popover title="应用列表" content={restApps} trigger="hover">
          <div key="more" className={styles.application} style={{ ...styleSheet[theme] }}>
            <EllipsisOutlined />
          </div>
        </Popover>
      )}
    </Space>
  )
}

export default Applications
