import { useState, useEffect } from 'react'
import { Button, message, Empty, Typography } from 'antd'
import Copy from 'copy-to-clipboard'
import styles from './index.less'
import { useIntl, useSelector, getIntl } from 'umi'

export default function ApiReqDetail({ data, name }) {
  const theme = useSelector(({ global }) => global.theme)
  const { RequestRaw, ResponseRaw } = data
  const [detailRaw, setDetailRaw] = useState('')
  const intl = useIntl()
  useEffect(() => {
    const raw = name === 'req' ? RequestRaw : ResponseRaw
    setDetailRaw(raw || '')
  }, [RequestRaw, ResponseRaw, name])

  const renderCopyItem = (content) => {
    const intl = getIntl()

    return (
      <Button
        size="small"
        className={styles.copyBtn}
        onClick={() => {
          Copy(content)
          message.success(intl.formatMessage({ id: 'pages.events.details.copy.success' }))
        }}
      >
        复制
      </Button>
    )
  }
  const darkStyle = {
    wrapper: {
      border: '2px solid rgba(186, 208, 241, 0.1)',
      backgroundColor: '#26264E',
    },
  }
  const lightStyle = {
    wrapper: {
      background: '#F7F7FF',
      border: '1px solid rgba(82, 78, 238, 0.16)',
    },
  }
  const styleSheet = theme === 'dark' ? darkStyle : lightStyle
  return (
    <div className={styles.reqDetail}>
      {/* <div className={styles.copyItem}>
        <Button
          type="primary"
          onClick={() => {
            Copy(detailRaw)
            message.success(intl.formatMessage({ id: 'component.api.detail.copy.success' }))
          }}
        >
          {intl.formatMessage({ id: 'component.api.detail.button.copy' })}
        </Button>
      </div> */}
      {/* <pre className={styles.apiDetailStr} style={{ ...styleSheet.wrapper }}>
        {detailRaw?.replace(/\\r/g, '\r')?.replace(/\\n/g, '\n')}
      </pre> */}
      <div className={styles.rawContentWrap} style={{ ...styleSheet.wrapper }}>
        {renderCopyItem(detailRaw)}
        <pre className={styles.xhr}>
          <Typography.Paragraph ellipsis={{ rows: 6, expandable: true, symbol: '更多' }}>
            {detailRaw?.replace(/\\r/g, '\r')?.replace(/\\n/g, '\n') || (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className={styles.emptyWrapper} />
            )}
          </Typography.Paragraph>
        </pre>
      </div>
    </div>
  )
}
