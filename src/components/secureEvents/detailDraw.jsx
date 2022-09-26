import { useState, useEffect } from 'react'
import {
  Drawer,
  Space,
  Tag,
  Popconfirm,
  Tabs,
  message,
  Typography,
  Button,
  Empty,
  Row,
  Col,
  Tooltip,
  Badge,
  Modal,
  Select,
  Input,
  Checkbox,
  Form,
  Radio,
  Tab,
} from 'antd'
import { useIntl, getIntl, useSelector, useDispatch } from 'umi'
import moment from 'moment'
import styles from './detailDraw.less'
import Copy from 'copy-to-clipboard'
import { ConfidenceMap, SeverityMap, StatusMap } from '@/constant/content.js'
import TotalEventsButton from './TotalEventsButton'
import Applications from '../Common/Applications'
import { getLocaleForAPI } from '@/utils/utils'
import {
  CheckCircleOutlined,
  UpOutlined,
  DownOutlined,
  PlusCircleOutlined,
  RightOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons'
import { getWhiteDetails } from '@/services/secureEvents'
import ProList from '@ant-design/pro-list'

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

const InfoPanel = ({ children, style = {} }) => {
  const theme = useSelector(({ global }) => global.theme)
  const themeStyle = {
    dark: {
      backgroundColor: '#1D1D42',
      border: '1px solid rgba(186, 208, 241, 0.1)',
    },
    light: {
      backgroundColor: '',
      border: '',
    },
  }
  return (
    <div className={styles.infoPanel} style={{ ...style, ...themeStyle[theme] }}>
      {children}
    </div>
  )
}

function useForceUpdate() {
  const [value, setValue] = useState(0)
  return () => setValue((value) => value + 1)
}

const DetailDrawer = (props) => {
  const [handleModalVisible, setHandleModalVisible] = useState(false)
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false)
  const [expandable, setExpandable] = useState(true)
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')
  const [category, setCategory] = useState('')
  const [handleEventIds, setHandleEventIds] = useState([])
  const [EventId, setEventId] = useState('')
  const [EventName, setEventName] = useState('')
  const [expandEventIds, setExpandEventIds] = useState([])
  const [formRef] = Form.useForm()
  const dispatch = useDispatch()
  const statusEventData = useSelector(({ secure_events }) => secure_events.statusEventData)
  const theme = useSelector(({ global }) => global.theme)
  const eventDetails = useSelector(({ secure_events }) => secure_events.eventDetails)
  const feedbackDetails = useSelector(({ secure_events }) => secure_events.feedbackDetails)
  const forceUpdate = useForceUpdate()

  const { visible, onClose, details = {}, onModifyStatus, id, title, getTableData } = props
  const intl = useIntl()
  const { Severity, Apps = [], Status } = details
  const severityColor = getSeverityColor(Severity)
  useEffect(() => {
    getStatusEvents()
    if (status === 'Whited') {
      fetchWhiteDetails()
    }
  }, [status])
  const categoryMap = {
    web_attack: intl.formatMessage({ id: 'pages.events.details.category.web.attack' }),
    data_risk: intl.formatMessage({ id: 'pages.events.details.category.data.risk' }),
    custom: '自定义',
  }
  const colorMap = {
    web_attack: '#1890ff',
    data_risk: '#faad14',
    custom: '#13c2c2',
  }
  const tagColorMap = {
    web_attack: 'processing',
    data_risk: 'warning',
    custom: 'success',
  }
  const handleMap = {
    FalsePositive: '误报',
    Ignored: '忽略',
    Disposed: '手动处理',
    Undisposed: '未处理',
    Whited: '白名单',
  }
  const radioOptions = [
    { label: '加白名单', value: 'Whited' },
    { label: '忽略', value: 'Ignored' },
    { label: '误报', value: 'FalsePositive' },
    { label: '手动处理', value: 'Disposed' },
  ]
  // 封装list组件
  const listRender = (dataSource) => {
    return (
      <ProList
        options={false}
        search={false}
        className={
          theme === 'dark' ? styles.handleEventsProListDark : styles.handleEventsProListLight
        }
        rowClassName={theme === 'dark' ? styles.listRowDark : styles.listRowLight}
        dataSource={dataSource?.slice(0, 50)}
        style={{ padding: 0 }}
        metas={{
          content: {
            render: listHandleContentRender,
          },
        }}
      />
    )
  }
  const showHandleModal = (e, Type, Category, EventId, EventName) => {
    e.stopPropagation()
    setHandleModalVisible(true)
    setType(Type)
    setCategory(Category)
    setEventId(EventId)
    setEventName(EventName)
  }
  const getStatusEvents = () => {
    if (dispatch) {
      dispatch({
        type: 'secure_events/getStatusEvents',
        payload: { Status: status, Type: type },
      })
    }
  }
  const fetchWhiteDetails = async () => {
    const {
      Code,
      Data: { Strategy },
    } = await getWhiteDetails({ Type: type })
    if (Code !== 'Succeed') return
    const arr = Object.entries(Strategy).map(([Key, Value]) => ({ Key, Value }))
    if (arr.length > 0) {
      formRef.setFieldsValue({ config: arr })
    }
  }
  const closeHandleModal = () => {
    setHandleModalVisible(false)
    setStatus('')
    setExpandEventIds([])
  }
  const expandList = () => {
    setExpandable(!expandable)
  }
  const createWhiteStrategys = (cb, objValue) => {
    if (dispatch) {
      dispatch({
        type: 'secure_events/createWhiteStrategys',
        payload: { ...objValue, Type: type, Category: category },
        callback: (code) => {
          cb && cb(code)
        },
      })
    }
  }
  const fetchHandleDetails = (E) => {
    if (dispatch) {
      dispatch({
        type: 'secure_events/GetEventDetails',
        payload: {
          EventId: E,
          Lang: getLocaleForAPI(),
        },
      })
    }
  }
  const handleRisk = () => {
    if (!status) {
      return message.error('请选择处理方式')
    }
    if (status === 'Whited') {
      formRef
        .validateFields()
        .then((values) => {
          const objValue = {}
          const arr = values?.config || []
          arr.forEach(({ Key, Value }) => {
            objValue[Key] = Value
          })
          const Keys = [
            'SrcHost',
            'DstHost',
            'Url',
            'ReqHeaders',
            'ReqBody',
            'RespHeaders',
            'RespBody',
          ]
          Keys.forEach((key) => {
            if (!objValue[key]) objValue[key] = ''
          })
          createWhiteStrategys((statusCode) => {
            if (statusCode === 423) return
            handleEventIds.push(EventId)
            modifyEventsStatus(handleEventIds, status)
            closeHandleModal()
            setHandleEventIds([])
            setFeedbackModalVisible(true)
          }, objValue)
        })
        .catch((errorInfo) => {
          console.log(errorInfo)
        })
    } else {
      handleEventIds.push(EventId)
      modifyEventsStatus(handleEventIds, status)
      closeHandleModal()
      setHandleEventIds([])
      setFeedbackModalVisible(true)
    }
  }
  // 修改事件状态
  const modifyEventsStatus = (ids, status, callback) => {
    if (dispatch) {
      dispatch({
        type: 'secure_events/modifyStatus',
        payload: {
          EventIds: ids,
          Status: status,
        },
      })
      callback && callback()
    }
  }
  const changeChecked = (e) => {
    const EventIds = statusEventData.Events?.map(({ EventId }) => EventId)
    setHandleEventIds(e.target.checked ? EventIds : [])
  }
  const listHandleContentRender = (_, record) => {
    const { EventName, UpdatedAt, Status, Apps, API, SrcHost, EventId } = record
    const darkStyle = {
      wrapper: {
        backgroundColor: '#26264E',
        border: '1px solid rgba(186, 208, 241, 0.1)',
      },
    }
    const lightStyle = {
      wrapper: {
        backgroundColor: '#EFEFFF',
        border: '1px solid rgba(82, 78, 238, 0.16)',
      },
    }
    const styleSheet = theme === 'dark' ? darkStyle : lightStyle
    return (
      <>
        <div className={styles.proListContent}>
          <div className={styles.contentMain}>
            <div className={styles.handleMainTop}>
              <Space size="small">
                <div className={styles.eventName}>
                  <Typography.Text
                    style={{
                      width: '130px',
                    }}
                    ellipsis={{ tooltip: EventName }}
                  >
                    {EventName}
                  </Typography.Text>
                </div>
                {Apps.length !== 0 ? <Applications apps={Apps} count={3} /> : <span></span>}
                <Tooltip title="状态">
                  <div className={styles.status}>{StatusMap[Status]}</div>
                </Tooltip>
              </Space>
            </div>
            <div className={styles.handleMainBottom}>
              <Space size="large">
                <Tooltip title="攻击源">
                  <span>{SrcHost}</span>
                </Tooltip>
                <Tooltip title="API">
                  <Typography.Text
                    style={{
                      width: '160px',
                    }}
                    ellipsis={{ tooltip: API }}
                  >
                    {API}
                  </Typography.Text>
                </Tooltip>
                <div
                  style={{
                    visibility: expandEventIds?.includes(EventId) ? 'hidden' : '',
                  }}
                >
                  <Tooltip title="最新发现时间">
                    <span>{moment(UpdatedAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                  </Tooltip>
                </div>

                <Button
                  type="link"
                  className={styles.detailsBtn}
                  style={{ fontSize: 12, height: 15, padding: 0 }}
                  onClick={() => {
                    console.log(EventId, 'id')
                    const index = expandEventIds.findIndex((id) => id === EventId)
                    console.log(expandEventIds, 'id数组')
                    if (index === -1) {
                      // showHandleDetails(EventId)
                      fetchHandleDetails(EventId)
                      setExpandEventIds((ids) => {
                        ids.push(EventId)
                        return ids
                      })
                      // setExpandEventIds([])
                    } else {
                      setExpandEventIds((ids) => {
                        ids.splice(index, 1)
                        return ids
                      })
                    }
                    forceUpdate()
                  }}
                >
                  <span>详情</span>
                  <RightOutlined style={{ paddingTop: 4 }} />
                </Button>
              </Space>
            </div>
          </div>
        </div>
        {expandEventIds.includes(EventId) && (
          <div style={{ padding: 16 }}>
            <div className={styles.handleDetailsItem}>
              <span className={styles.handleDetailsName}>首次发现时间</span>
              <span style={{ marginLeft: 19 }}>
                {moment(eventDetails.CreatedAt).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            </div>
            <div className={styles.handleDetailsItem}>
              <span className={styles.handleDetailsName}>最新发现时间</span>
              <span style={{ marginLeft: 19 }}>
                {moment(eventDetails.UpdatedAt).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            </div>
            <div className={styles.handleDetailsItem}>
              <div className={styles.handleDetailsName}>事件描述</div>
              <div style={{ width: 500, ...styleSheet.wrapper }} className={styles.infoPanel}>
                <pre className={styles.content}>
                  {eventDetails.Description?.replace(/\\r/g, '\r')?.replace(/\\n/g, '\n') || (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className={styles.emptyWrapper} />
                  )}
                </pre>
              </div>
            </div>
            <div className={styles.handleDetailsItem}>
              <div className={styles.handleDetailsName}>事件详情</div>
              <div style={{ width: 500, ...styleSheet.wrapper }} className={styles.infoPanel}>
                <pre className={styles.content}>
                  {eventDetails.Details?.replace(/\\r/g, '\r')?.replace(/\\n/g, '\n') || (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className={styles.emptyWrapper} />
                  )}
                </pre>
              </div>
            </div>
            <div>
              <div className={styles.handleDetailsName}>安全建议</div>
              <div style={{ width: 500, ...styleSheet.wrapper }} className={styles.infoPanel}>
                <pre className={styles.content}>
                  {eventDetails.Remediation?.replace(/\\r/g, '\r')?.replace(/\\n/g, '\n') || (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className={styles.emptyWrapper} />
                  )}
                </pre>
              </div>
            </div>
            <div>
              <Tabs defaultActiveKey="request">
                <TabPane tab="请求" key="request">
                  <div style={{ width: 500, ...styleSheet.wrapper }} className={styles.infoPanel}>
                    <pre className={styles.xhr}>
                      <Typography.Paragraph
                        ellipsis={{ rows: 4, expandable: true, symbol: '更多' }}
                      >
                        {(eventDetails.RequestDetails &&
                          eventDetails.RequestDetails.RawAscii?.replace(/\\r/g, '\r')?.replace(
                            /\\n/g,
                            '\n',
                          )) || (
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            className={styles.emptyWrapper}
                          />
                        )}
                      </Typography.Paragraph>
                    </pre>
                  </div>
                </TabPane>
                <TabPane tab="响应" key="response">
                  <div style={{ width: 500, ...styleSheet.wrapper }} className={styles.infoPanel}>
                    <pre className={styles.xhr}>
                      <Typography.Paragraph
                        ellipsis={{ rows: 4, expandable: true, symbol: '更多' }}
                      >
                        {(eventDetails.ResponseDetails &&
                          eventDetails.ResponseDetails.RawAscii?.replace(/\\r/g, '\r')?.replace(
                            /\\n/g,
                            '\n',
                          )) || (
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            className={styles.emptyWrapper}
                          />
                        )}
                      </Typography.Paragraph>
                    </pre>
                  </div>
                </TabPane>
              </Tabs>
              <div
                style={{
                  marginTop: 16,
                  marginRight: 16,
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Button
                  type="link"
                  className={styles.detailsBtn}
                  style={{ fontSize: 12, height: 15, padding: 0 }}
                  onClick={() => {
                    const index = expandEventIds.findIndex((id) => id === EventId)
                    setExpandEventIds((ids) => {
                      ids.splice(index, 1)
                      return ids
                    })
                    forceUpdate()
                  }}
                >
                  <span>收起</span>
                  <UpOutlined style={{ paddingTop: 4 }} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }
  const config = [
    {
      value: 'SrcHost',
      name: '攻击源ip(src_host)',
    },
    {
      value: 'DstHost',
      name: '目标IP(dst_host)',
    },
    {
      value: 'Url',
      name: 'url(url)',
    },
    {
      value: 'ReqHeaders',
      name: '请求头(req_headers)',
    },
    {
      value: 'ReqBody',
      name: '请求体(req_body)',
    },
    {
      value: 'RespHeaders',
      name: '响应头(resp_headers)',
    },
    {
      value: 'RespBody',
      name: '响应体(resp_body)',
    },
  ]
  return (
    <>
      <Drawer
        destroyOnClose={true}
        visible={visible}
        title={title}
        onClose={onClose}
        width={'50%'}
        contentWrapperStyle={{ minWidth: 570 }}
        className={styles.detailsDrawer}
      >
        <div className={styles.detailHead}>
          <h2>{details.EventName}</h2>
          <TotalEventsButton details={details} />
        </div>
        <div>
          <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Tag color={severityColor}>{SeverityMap[Severity]}</Tag>
              <Tag>{ConfidenceMap[details.Confidence]}</Tag>
            </div>

            <div style={{ textAlign: 'right' }}>
              {Status === 'Undisposed' ? (
                <Button
                  type="primary"
                  onClick={(e) => {
                    showHandleModal(
                      e,
                      details.Type,
                      details.Category,
                      details.EventId,
                      details.EventName,
                    )
                  }}
                >
                  处置
                </Button>
              ) : (
                <div>
                  <Popconfirm
                    title={
                      Status === 'Whited' ? '确定取消加入白名单吗？' : '确定标记为加入白名单吗？'
                    }
                    onConfirm={() => {
                      onModifyStatus([id], Status === 'Whited' ? 'Undisposed' : 'Whited')
                      onClose()
                    }}
                  >
                    <Button type="primary">{Status === 'Whited' ? '取消加白' : '加白名单'}</Button>
                  </Popconfirm>
                  {Status === 'Whited' ? (
                    <div style={{ marginTop: 8 }}>
                      <CheckCircleOutlined style={{ color: '#6FCF97', paddingRight: 8 }} />
                      已完成处置，标记为{' '}
                      <span style={{ color: '#ee7700' }}>{handleMap[Status]}</span>
                    </div>
                  ) : (
                    <div style={{ marginTop: 8 }}>
                      <CheckCircleOutlined style={{ color: '#6FCF97', paddingRight: 8 }} />
                      已完成处置，标记为{' '}
                      <span style={{ color: '#ee7700' }}>{handleMap[Status]}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Space>
        </div>
        <Row gutter={24}>
          <Col span={12}>
            <InfoPanel
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                height: 315,
              }}
            >
              <div className={styles.baseinfo}>
                <span className={styles.title}>
                  {intl.formatMessage({ id: 'pages.events.details.event.category' })}
                </span>
                <span className={styles.content}>
                  <Tag color={tagColorMap[details.Category]}>{categoryMap[details.Category]}</Tag>
                </span>
              </div>
              <div className={styles.baseinfo}>
                <span className={styles.title}>
                  {intl.formatMessage({ id: 'pages.events.details.event.scheme' })}
                </span>
                <span className={styles.content}>{details.Scheme}</span>
              </div>
              <div className={styles.baseinfo}>
                <span className={styles.title}>
                  {intl.formatMessage({ id: 'pages.events.details.event.method' })}
                </span>
                <span className={styles.content}>{details.Method}</span>
              </div>
              <div className={styles.baseinfo}>
                <span className={styles.title}>
                  {intl.formatMessage({ id: 'pages.events.details.event.host' })}
                </span>
                <span className={styles.content}>{details.Host}</span>
              </div>
              <div className={styles.baseinfo}>
                <span className={styles.title}>
                  {intl.formatMessage({ id: 'pages.events.details.event.path' })}
                </span>
                <span className={styles.content} style={{ width: 'calc(100% - 128px)' }}>
                  <Typography.Text
                    style={{ width: '100%' }}
                    ellipsis={{
                      tooltip: details.Path,
                    }}
                  >
                    {details.Path}
                  </Typography.Text>
                </span>
              </div>
              <div className={styles.baseinfo}>
                <span className={styles.title}>
                  {intl.formatMessage({ id: 'pages.events.details.event.attackSource' })}
                </span>
                <span className={styles.content}>{details.AttackerSrcHost}</span>
              </div>
              <div className={styles.baseinfo}>
                <span className={styles.title}>
                  {intl.formatMessage({ id: 'pages.events.details.event.createAt' })}
                </span>
                <span className={styles.content}>
                  {moment(details.CreatedAt).format('YYYY-MM-DD HH:mm:ss')}
                </span>
              </div>
              <div className={styles.baseinfo}>
                <span className={styles.title}>
                  {intl.formatMessage({ id: 'pages.events.details.event.updateAt' })}
                </span>
                <span className={styles.content}>
                  {moment(details.UpdatedAt).format('YYYY-MM-DD HH:mm:ss')}
                </span>
              </div>
              <div className={styles.baseinfo}>
                <span className={styles.title}>
                  {intl.formatMessage({ id: 'pages.events.details.event.apps' })}
                </span>
                <span className={styles.content}>
                  <Applications apps={Apps} />
                </span>
              </div>
            </InfoPanel>
          </Col>
          <Col span={12}>
            <InfoPanel>
              <div
                className={styles.description}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  height: 285,
                }}
              >
                <div style={{ marginBottom: 14 }}>
                  {intl.formatMessage({ id: 'pages.events.details.event.description' })}
                </div>
                <pre className={styles.content} style={{ flex: 'auto' }}>
                  <Typography.Paragraph ellipsis={{ rows: 6, expandable: true, symbol: '更多' }}>
                    {details.Description?.replace(/\\r/g, '\r')?.replace(/\\n/g, '\n') || (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className={styles.emptyWrapper} />
                    )}
                  </Typography.Paragraph>
                </pre>
              </div>
            </InfoPanel>
          </Col>
        </Row>
        <div className={styles.details}>
          <div>{intl.formatMessage({ id: 'pages.events.details.event.detail' })}</div>
          <InfoPanel>
            <pre className={styles.content}>
              {details.Details?.replace(/\\r/g, '\r')?.replace(/\\n/g, '\n') || (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className={styles.emptyWrapper} />
              )}
            </pre>
          </InfoPanel>
        </div>
        <div className={styles.remediation}>
          <div>{intl.formatMessage({ id: 'pages.events.details.event.remediation' })}</div>
          <InfoPanel>
            <pre className={styles.content}>
              {details.Remediation?.replace(/\\r/g, '\r')?.replace(/\\n/g, '\n') || (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className={styles.emptyWrapper} />
              )}
            </pre>
          </InfoPanel>
        </div>
        <div className={styles.references}>
          <div>{intl.formatMessage({ id: 'pages.events.details.event.references' })}</div>
          <InfoPanel>
            <pre className={styles.content}>
              {details.References?.replace(/\\r/g, '\r')?.replace(/\\n/g, '\n') || (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className={styles.emptyWrapper} />
              )}
            </pre>
          </InfoPanel>
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'PingFangSC-Semibold' }}>
            原始报文
          </div>
          <InfoPanel>
            <Tabs defaultActiveKey="request">
              <TabPane tab={intl.formatMessage({ id: 'pages.events.details.req' })} key="request">
                <div className={styles.rawContentWrap}>
                  {renderCopyItem(details.RequestDetails && details.RequestDetails.RawAscii)}
                  <pre className={styles.xhr}>
                    <Typography.Paragraph ellipsis={{ rows: 6, expandable: true, symbol: '更多' }}>
                      {(details.RequestDetails &&
                        details.RequestDetails.RawAscii?.replace(/\\r/g, '\r')?.replace(
                          /\\n/g,
                          '\n',
                        )) || (
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          className={styles.emptyWrapper}
                        />
                      )}
                    </Typography.Paragraph>
                  </pre>
                </div>
              </TabPane>
              <TabPane tab={intl.formatMessage({ id: 'pages.events.details.res' })} key="response">
                <div className={styles.rawContentWrap}>
                  {renderCopyItem(details.ResponseDetails && details.ResponseDetails.RawAscii)}
                  <pre className={styles.xhr}>
                    <Typography.Paragraph ellipsis={{ rows: 6, expandable: true, symbol: '更多' }}>
                      {(details.ResponseDetails &&
                        details.ResponseDetails.RawAscii?.replace(/\\r/g, '\r')?.replace(
                          /\\n/g,
                          '\n',
                        )) || (
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          className={styles.emptyWrapper}
                        />
                      )}
                    </Typography.Paragraph>
                  </pre>
                </div>
              </TabPane>
            </Tabs>
          </InfoPanel>
        </div>
      </Drawer>
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography.Text
              style={{
                maxWidth: '60%',
              }}
              ellipsis={{ tooltip: EventName }}
            >
              {EventName}
            </Typography.Text>
            <Tooltip title="风险类别">
              <div style={{ color: colorMap[category], marginLeft: 20, fontSize: 14 }}>
                <Badge color={colorMap[category]} />
                {categoryMap[category]}
              </div>
            </Tooltip>
          </div>
        }
        visible={handleModalVisible}
        onCancel={closeHandleModal}
        okText="立即处理"
        width={600}
        onOk={handleRisk}
      >
        <div>
          <div style={{ fontSize: 16, marginBottom: 8, fontWeight: 500 }}>处理方式</div>
          <Radio.Group
            options={radioOptions}
            value={status}
            optionType="button"
            buttonStyle="solid"
            // style={{ marginBottom: 14 }}
            onChange={({ target: { value } }) => {
              setStatus(value)
            }}
          />

          {status === 'Whited' && (
            <div>
              <div className={styles.handleTips}>
                将选择加白名单操作后，当再次发生相同告警时将自动进入已处理列表中，不再进行告警通知，请谨慎操作
              </div>
              <div style={{ paddingBottom: 8 }}>加白规则设定</div>
              <Form
                name="dynamic_form_nest_item"
                autoComplete="off"
                className={styles.configForm}
                form={formRef}
              >
                <Form.List name="config" initialValue={[{ Key: undefined, Value: '' }]}>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }, index) => (
                        <Form.Item
                          {...(index === 0
                            ? {
                                labelCol: { span: 6 },
                                wrapperCol: { span: 18 },
                              }
                            : {
                                wrapperCol: {
                                  offset: 6,
                                  span: 18,
                                },
                              })}
                          key={key}
                          style={{ marginBottom: 0 }}
                        >
                          <Space style={{ display: 'flex' }} align="baseline">
                            <Form.Item
                              {...restField}
                              name={[name, 'Key']}
                              style={{ marginBottom: 8 }}
                              rules={[{ required: true, message: '请选择规则类型' }]}
                            >
                              <Select style={{ width: 180 }} allowClear placeholder="选择规则类型">
                                {config.map((item) => {
                                  return (
                                    <Select.Option value={item.value} key={item.value}>
                                      {item.name}
                                    </Select.Option>
                                  )
                                })}
                              </Select>
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, 'Value']}
                              style={{ marginBottom: 8 }}
                              rules={[{ required: true, message: '请输入加白规则' }]}
                            >
                              <Input style={{ width: 300 }} placeholder="输入加白规则" />
                            </Form.Item>
                            <Space style={{ marginLeft: 6 }}>
                              {fields.length - 1 === index && fields.length < 7 ? (
                                <PlusCircleOutlined
                                  className={styles.dynamicButton}
                                  style={{ color: 'green' }}
                                  onClick={() => add({ Key: undefined, Value: '' })}
                                />
                              ) : (
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 18,
                                    height: 18,
                                    color: '#feb808',
                                    border: '1px solid #feb808',
                                    borderRadius: '50%',
                                  }}
                                >
                                  &
                                </div>
                              )}
                              {fields.length > 1 ? (
                                <MinusCircleOutlined
                                  className={styles.dynamicButton}
                                  style={{ color: 'red' }}
                                  onClick={() => remove(name)}
                                />
                              ) : null}
                            </Space>
                          </Space>
                        </Form.Item>
                      ))}
                    </>
                  )}
                </Form.List>
              </Form>
            </div>
          )}
          {status === 'Ignored' && (
            <div className={styles.handleTips}>
              选择忽略本告警后，该告警状态将更新为已处理。当相同告警再次发生时，本平台将会再次告警
            </div>
          )}
          {status === 'FalsePositive' && (
            <div className={styles.handleTips}>
              将本告警设置为误报后，系统将触发对误报事件的学习，以优化减少误报比例
            </div>
          )}
          {status === 'Disposed' && (
            <div className={styles.handleTips}>
              请在排查并优化处理风险漏洞后，将该告警事件标记为手工处理完成
            </div>
          )}
          {status === 'Whited' && (
            <div>
              {status === 'Whited' && (
                <div>
                  <div style={{ fontSize: 16, margin: '24px 0 8px', fontWeight: 500 }}>
                    批量处理
                  </div>
                  <div>
                    <Checkbox onChange={changeChecked}>按已配置规则批量处理同类型告警</Checkbox>
                  </div>
                </div>
              )}

              <div style={{ margin: '13.5px 0' }}>
                <span style={{ marginRight: 16, color: '#8E8EA0' }}>
                  <span>相同的告警问题共</span>
                  <span style={{ margin: '0 5px', color: 'red' }}>
                    {statusEventData.Total || 0}
                  </span>
                  个
                </span>
                {expandable ? (
                  <Button type="link" onClick={expandList}>
                    收起
                    <UpOutlined />
                  </Button>
                ) : (
                  <Button type="link" onClick={expandList}>
                    展开
                    <DownOutlined />
                  </Button>
                )}
              </div>
              {expandable && listRender(statusEventData.Events)}
            </div>
          )}
        </div>
      </Modal>
      <Modal
        width={600}
        title="告警处理"
        visible={feedbackModalVisible}
        footer={null}
        onCancel={() => {
          setFeedbackModalVisible(false)
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 13.5 }}>
            <div>已为您处理{feedbackDetails.Total}个告警问题</div>
            <div>
              <CheckCircleOutlined style={{ fontSize: 16, color: '#6FCF97' }} />
            </div>
          </div>
          {listRender(feedbackDetails.Events)}
        </div>
      </Modal>
    </>
  )
}

export default DetailDrawer
