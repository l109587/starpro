import { Drawer, Space, Tag, Popconfirm, Divider, Tabs, message } from 'antd'
import { Link, getIntl, useIntl } from 'umi'
import moment from 'moment'
import styles from './detailDraw.less'
import Copy from 'copy-to-clipboard'
import { ConfidenceMap, SeverityMap, CategoryMap } from '@/constant/content.js'

const { TabPane } = Tabs

const getSeverityColor = (severity) => {
  let color = 'green'
  switch (severity) {
    case 'High':
      color = 'red'
      break
    case 'Medium':
      color = 'yellow'
      break
    case 'Low':
      color = 'blue'
      break
  }
  return color
}

const renderCopyItem = (content) => {
  const intl = getIntl()

  return (
    <div className={styles.copyItem}>
      <div
        className={styles.btn}
        onClick={() => {
          Copy(content)
          message.success(intl.formatMessage({ id: 'pages.issues.details.copy.success' }))
        }}
      >
        Copy
      </div>
    </div>
  )
}

const DetailDrawer = (props) => {
  const { visible, onClose, details = {}, onModifyStatus, id } = props
  const { Severity, Apps = [] } = details
  const intl = useIntl()
  const severityColor = getSeverityColor(Severity)

  return (
    <Drawer
      destroyOnClose={true}
      visible={visible}
      title={intl.formatMessage({ id: 'pages.issues.details.vul.detail' })}
      onClose={onClose}
      width={570}
      className={styles.detailsDrawer}
    >
      <h2>{details.IssueName}</h2>
      <div>
        <Space>
          <Tag color={severityColor}>{SeverityMap[Severity]}</Tag>
          <Tag color="#FAFAFA" style={{ color: 'gray' }}>
            {ConfidenceMap[details.Confidence]}
          </Tag>
          <Popconfirm
            title={intl.formatMessage({ id: 'pages.issues.mark.as.ignored' })}
            onConfirm={() => onModifyStatus([id], 'Ignored')}
            okText="Yes"
            cancelText="No"
          >
            <div className={styles.operaBtn}>
              {intl.formatMessage({ id: 'pages.issues.button.ignore' })}
            </div>
          </Popconfirm>
          <Popconfirm
            title={intl.formatMessage({ id: 'pages.issues.mark.as.falsealarm' })}
            onConfirm={() => onModifyStatus([id], 'FalsePositive')}
            okText="Yes"
            cancelText="No"
          >
            <div className={styles.operaBtn}>
              {intl.formatMessage({ id: 'pages.issues.button.falsealarm' })}
            </div>
          </Popconfirm>
          <Popconfirm
            title={intl.formatMessage({ id: 'pages.issues.mark.as.processed' })}
            onConfirm={() => onModifyStatus([id], 'Disposed')}
            okText="Yes"
            cancelText="No"
          >
            <div className={styles.operaBtn}>
              {intl.formatMessage({ id: 'pages.issues.button.process' })}
            </div>
          </Popconfirm>
        </Space>
      </div>
      <Divider style={{ margin: '10px 0 0 0' }} />
      <div>
        <div className={styles.baseinfo}>
          <span className={styles.title}>
            {intl.formatMessage({ id: 'pages.issues.details.vul.category' })}
          </span>
          <span className={styles.content}>{CategoryMap[details.IssueCategory]}</span>
        </div>
        <div className={styles.baseinfo}>
          <span className={styles.title}>
            {intl.formatMessage({ id: 'pages.issues.details.vul.scheme' })}
          </span>
          <span className={styles.content}>{details.Scheme}</span>
        </div>
        <div className={styles.baseinfo}>
          <span className={styles.title}>
            {intl.formatMessage({ id: 'pages.issues.details.vul.method' })}
          </span>
          <span className={styles.content}>{details.Method}</span>
        </div>
        <div className={styles.baseinfo}>
          <span className={styles.title}>
            {intl.formatMessage({ id: 'pages.issues.details.vul.host' })}
          </span>
          <span className={styles.content}>{details.Host}</span>
        </div>
        <div className={styles.baseinfo}>
          <span className={styles.title}>
            {intl.formatMessage({ id: 'pages.issues.details.vul.path' })}
          </span>
          <span className={styles.content}>{details.Path}</span>
        </div>
        <div className={styles.baseinfo}>
          <span className={styles.title}>
            {intl.formatMessage({ id: 'pages.issues.details.vul.createAt' })}
          </span>
          <span className={styles.content}>
            {moment(details.CreatedAt).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        </div>
        <div className={styles.baseinfo}>
          <span className={styles.title}>
            {intl.formatMessage({ id: 'pages.issues.details.vul.updateAt' })}
          </span>
          <span className={styles.content}>
            {moment(details.UpdatedAt).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        </div>
        <div className={styles.baseinfo}>
          <span className={styles.title}>
            {intl.formatMessage({ id: 'pages.issues.details.vul.apps' })}
          </span>
          <span className={styles.content}>
            {Apps.map((item) => {
              return (
                <Link
                  style={{ display: 'inline-block', marginBottom: '4px ' }}
                  key={item.AppId}
                  to={`/assets/api/app?appId=${item.AppId}`}
                >
                  <Tag color="blue">{item.AppName}</Tag>
                </Link>
              )
            })}
          </span>
        </div>
      </div>
      <Divider style={{ margin: '10px 0 0 0' }} />
      <div className={styles.description}>
        <div>{intl.formatMessage({ id: 'pages.issues.details.vul.description' })}</div>
        <div className={styles.content}>{details.Description}</div>
      </div>
      <Divider style={{ margin: '10px 0 0 0' }} />
      <div className={styles.details}>
        <div>{intl.formatMessage({ id: 'pages.issues.details.vul.details' })}</div>
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: details.Details }} />
      </div>
      <Divider style={{ margin: '10px 0 0 0' }} />
      <div className={styles.remediation}>
        <div>{intl.formatMessage({ id: 'pages.issues.details.vul.remediation' })}</div>
        <div className={styles.content} dangerouslySetInnerHTML={{ __html: details.Remediation }} />
      </div>
      <Divider style={{ margin: '10px 0 0 0' }} />
      <Tabs defaultActiveKey="request">
        <TabPane tab={intl.formatMessage({ id: 'pages.issues.details.req' })} key="request">
          {renderCopyItem(details.RequestDetails && details.RequestDetails.RawAscii)}
          <div className={styles.xhr}>
            {details.RequestDetails && details.RequestDetails.RawAscii}
          </div>
        </TabPane>
        <TabPane tab={intl.formatMessage({ id: 'pages.issues.details.res' })} key="response">
          {renderCopyItem(details.ResponseDetails && details.ResponseDetails.RawAscii)}
          <div className={styles.xhr}>
            {details.ResponseDetails && details.ResponseDetails.RawAscii}
          </div>
        </TabPane>
      </Tabs>
    </Drawer>
  )
}

export default DetailDrawer
