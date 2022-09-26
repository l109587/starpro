import React from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProList from '@ant-design/pro-list'
import ProTable from '@ant-design/pro-table'
import { QueryFilter, ProFormText, ProFormSelect, ProFormCheckbox } from '@ant-design/pro-form'
import {
  ExclamationCircleFilled,
  EllipsisOutlined,
  RightOutlined,
  UpOutlined,
  DownOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { Link, connect, injectIntl } from 'umi'
import EventsStateTrend from '@/components/secureEvents/eventsStateTrend.jsx'
import TrendTabs from '@/components/secureEvents/trendTabs.jsx'
import Details from '@/components/secureEvents/detailDraw.jsx'
import {
  Button,
  Tag,
  Space,
  Popconfirm,
  Popover,
  Typography,
  Tooltip,
  Badge,
  Modal,
  Tabs,
  Select,
  Input,
  Checkbox,
  Form,
  Radio,
  Row,
  Col,
  message,
  Pagination,
  Empty,
} from 'antd'
import moment from 'moment'
import styles from './index.less'
import {
  SeverityOptions,
  ConfidenceMap,
  ConfidencesOptions,
  StatusOptions,
  SeverityMap,
  StatusMap,
} from '@/constant/content.js'
import { getLocaleForAPI } from '@/utils/utils'
import numeral from 'numeral'
import OverView from '@/components/secureEvents/OverView'
import Applications from '@/components/Common/Applications'
import {
  deleteWhiteStrategys,
  updateWhiteStrategys,
  getWhiteDetails,
} from '@/services/secureEvents'

const { TabPane } = Tabs

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

@connect(({ secure_events, global, loading }) => ({
  tableData: secure_events.tableData,
  currentQuery: secure_events.currentQuery,
  eventDetails: secure_events.eventDetails,
  statusEventData: secure_events.statusEventData,
  regularData: secure_events.regularData,
  tableLoading: loading.effects['secure_events/getTableData'],
  theme: global.theme,
  feedbackDetails: secure_events.feedbackDetails,
}))
class AttackEvents extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      detailsDrawerVisible: false,
      collapsed: true,
      handleModalVisible: false,
      expandable: true,
      status: '',
      formData: {},
      type: '',
      category: '',
      handleEventIds: [],
      EventId: '',
      EventName: '',
      isRuleModalVisible: false,
      selectedRecords: [],
      isEditRegularVisible: false,
      regularRecord: {},
      editFormData: {},
      regularPageNum: 1,
      regularPageSize: 10,
      expandEventIds: [],
      feedbackModalVisible: false,
    }
  }
  formRef = React.createRef()
  editFormRef = React.createRef()
  componentDidMount() {
    this.getTableData({ PageSize: 10, PageNum: 1, Status: 'Undisposed' })
  }

  getWhiteDetails = async () => {
    const {
      Code,
      Data: { Strategy },
    } = await getWhiteDetails({ Type: this.state.type })
    if (Code !== 'Succeed') return
    const arr = Object.entries(Strategy).map(([Key, Value]) => ({ Key, Value }))
    if (arr.length > 0) {
      this.formRef.current.setFieldsValue({ config: arr })
    }
  }
  getTableData(params = { PageSize: 10, PageNum: 1 }) {
    const { dispatch } = this.props
    if (dispatch) {
      dispatch({
        type: 'secure_events/getTableData',
        payload: { ...params, ...{ Lang: getLocaleForAPI() } },
      })
    }
  }

  getStatusEvents() {
    const { dispatch } = this.props
    if (dispatch) {
      dispatch({
        type: 'secure_events/getStatusEvents',
        payload: { Status: this.state.status, Type: this.state.type },
      })
    }
  }
  getWhiteStrategys() {
    const { dispatch } = this.props
    if (dispatch) {
      dispatch({
        type: 'secure_events/getWhiteStrategys',
        payload: { PageNum: this.state.regularPageNum, PageSize: this.state.regularPageSize },
      })
    }
  }
  updateWhiteStrategys = () => {
    this.editFormRef.current
      .validateFields()
      .then(async (values) => {
        const objValue = {}
        const arr = values?.editRegulars || []
        arr.forEach(({ Field, Regular }) => {
          objValue[Field] = Regular
        })
        const Keys = config.map(({ value }) => value)
        Keys.forEach((key) => {
          if (!objValue[key]) objValue[key] = ''
        })
        const res = await updateWhiteStrategys({ ...objValue, Type: this.state.regularRecord.Type })
        const { Code } = res
        if (Code !== 'Succeed') return
        message.success('编辑成功')
        this.setState({
          isEditRegularVisible: false,
        })
        this.getWhiteStrategys()
      })
      .catch((errorInfo) => {})
  }
  deleteWhiteStrategys = async (types) => {
    const res = await deleteWhiteStrategys({ Types: types })
    const { Code } = res
    if (Code !== 'Succeed') return
    this.getWhiteStrategys()
    this.setState({ selectedRecords: [] })
    Modal.success({
      content: (
        <span>
          您已成功移除
          <span style={{ color: '#6FCF97', fontWeight: 500 }}>
            {this.state.selectedRecords.length || 1}
          </span>
          条白名单
        </span>
      ),
    })
  }

  createWhiteStrategys(cb) {
    const { dispatch } = this.props
    const { formData, type, category } = this.state
    if (dispatch) {
      dispatch({
        type: 'secure_events/createWhiteStrategys',
        payload: { ...formData, Type: type, Category: category },
        callback: (code) => {
          cb && cb(code)
        },
      })
    }
  }
  closeDetailsDarwer = () => {
    this.setState({
      detailsDrawerVisible: false,
    })
  }
  closeHandleModal = () => {
    this.setState({
      handleModalVisible: false,
      status: '',
      expandEventIds: [],
    })
  }
  showHandleModal = (e, Type, Category, EventId, EventName) => {
    e.stopPropagation()
    this.setState({
      handleModalVisible: true,
      type: Type,
      category: Category,
      EventId: EventId,
      EventName: EventName,
    })
  }
  expandList = () => {
    this.setState({
      expandable: !this.state.expandable,
    })
  }

  handleRisk = () => {
    const { handleEventIds, EventId, status } = this.state
    if (!status) {
      return message.error('请选择处理方式')
    }
    if (status === 'Whited') {
      this.formRef.current
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

          this.setState(
            {
              formData: objValue,
            },
            () => {
              this.createWhiteStrategys((statusCode) => {
                if (statusCode === 423) return
                handleEventIds.push(EventId)
                this.modifyEventsStatus(handleEventIds, status)
                this.closeHandleModal()
                this.setState({
                  handleEventIds: [],
                  feedbackModalVisible: true,
                })
              })
            },
          )
        })
        .catch((errorInfo) => {})
    } else {
      handleEventIds.push(EventId)
      this.modifyEventsStatus(handleEventIds, status)
      this.closeHandleModal()
      this.setState({
        handleEventIds: [],
        feedbackModalVisible: true,
      })
    }
  }
  changeChecked = (e) => {
    const EventIds = this.props.statusEventData.Events?.map(({ EventId }) => EventId)
    this.setState({
      handleEventIds: e.target.checked ? EventIds : [],
    })
  }
  closeRuleModal = () => {
    this.setState({
      isRuleModalVisible: false,
    })
  }
  // 展示事件详情Drawer
  showDetails = (E) => {
    this.setState({
      detailsDrawerVisible: true,
      detailsId: E,
    })

    const { dispatch } = this.props
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
  //
  showHandleDetails = (E) => {
    const { dispatch } = this.props
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
  // Table的列定义
  getColumns() {
    const { intl } = this.props
    const categoryMap = {
      web_attack: 'Web攻击',
      data_risk: '数据风险',
      custom: '自定义',
    }
    const colorMap = {
      web_attack: 'processing',
      data_risk: 'warning',
      custom: 'success',
    }

    return [
      {
        title: '#',
        dataIndex: 'Index',
        width: 50,
        align: 'left',
        fixed: 'left',
      },
      {
        title: intl.formatMessage({ id: 'pages.events.column.EventName' }),
        width: 100,
        dataIndex: 'EventName',
        fixed: 'left',
        render: (EventName, item) => {
          return (
            <div
              style={{ cursor: 'pointer', color: '#1890ff' }}
              onClick={this.showDetails.bind(this, item.EventId)}
            >
              {EventName}
            </div>
          )
        },
      },
      {
        title: intl.formatMessage({ id: 'pages.events.column.Severity' }),
        width: 70,
        dataIndex: 'Severity',
        render: (Severity) => {
          let color = 'green'
          switch (Severity) {
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
          return (
            <Tag style={{ border: 0 }} color={color}>
              {SeverityMap[Severity]}
            </Tag>
          )
        },
      },
      {
        title: '风险类别',
        width: 70,
        dataIndex: 'Category',
        render: (cate) => <Tag color={colorMap[cate]}>{categoryMap[cate]}</Tag>,
      },
      {
        title: intl.formatMessage({ id: 'pages.events.column.AttackerSrcHost' }),
        width: 60,
        dataIndex: 'AttackerSrcHost',
      },
      {
        title: intl.formatMessage({ id: 'pages.events.column.Status' }),
        width: 60,
        dataIndex: 'Status',
        render: (Status) => {
          return <div>{StatusMap[Status]}</div>
        },
      },
      {
        title: intl.formatMessage({ id: 'pages.events.column.Confidence' }),
        width: 60,
        dataIndex: 'Confidence',
        render: (Confidence) => {
          return <div>{ConfidenceMap[Confidence]}</div>
        },
      },
      {
        title: '首次发现',
        width: 110,
        dataIndex: 'CreatedAt',
        sorter: (a, b) => Date.parse(a.CreatedAt) - Date.parse(b.CreatedAt),
        render: (CreatedAt) => moment(CreatedAt).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: intl.formatMessage({ id: 'pages.events.column.UpdatedAt' }),
        width: 110,
        dataIndex: 'UpdatedAt',
        sorter: (a, b) => Date.parse(a.UpdatedAt) - Date.parse(b.UpdatedAt),
        render: (UpdatedAt) => moment(UpdatedAt).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: intl.formatMessage({ id: 'pages.events.column.API' }),
        dataIndex: 'API',
        width: 100,
        copyable: true,
        ellipsis: true,
      },
      {
        title: '产品',
        dataIndex: 'AppName',
        width: 100,
        ellipsis: true,
      },
      {
        title: 'Action',
        dataIndex: 'AppAction',
        width: 100,
        ellipsis: true,
      },
      {
        title: (
          <span style={{ paddingRight: 24 }}>
            {intl.formatMessage({ id: 'pages.events.column.Apps' })}
          </span>
        ),
        width: 180,
        dataIndex: 'Apps',
        align: 'right',
        render: (Apps = []) => {
          const top2 = Apps.slice(0, 2)
          const rest = Apps.slice(2)
          const restApps = () => {
            return (
              <div>
                {rest.map((item) => {
                  return (
                    <Link
                      key={item.AppId}
                      className={styles.applist}
                      to={`/assets/api/app?appId=${item.AppId}`}
                    >
                      {item.Name}
                    </Link>
                  )
                })}
              </div>
            )
          }

          return (
            <Space style={{ paddingRight: 24 }}>
              {top2.map((item) => {
                return (
                  <Link
                    key={item.AppId}
                    style={{
                      padding: '3px 7px',
                      background: '#e6f7ff',
                      border: '1px solid #91d5ff',
                      borderRadius: 2,
                    }}
                    to={`/assets/api/app?appId=${item.AppId}`}
                  >
                    <Typography.Text
                      style={{
                        maxWidth: 40,
                        color: '#1890ff',
                      }}
                      ellipsis={{ tooltip: item.Name }}
                    >
                      {item.Name}
                    </Typography.Text>
                  </Link>
                )
              })}
              {!!rest.length && (
                <Popover title="应用列表" content={restApps} trigger="hover">
                  <Button
                    icon={<EllipsisOutlined />}
                    style={{ height: 25, width: 27, borderRadius: 2 }}
                  />
                </Popover>
              )}
            </Space>
          )
        },
      },
    ]
  }

  severityTagRender = (Severity) => {
    let color = 'green'
    switch (Severity) {
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
    return (
      <Tag
        style={{
          backgroundColor: 'transparent',
          color: color,
          borderColor: color,
          height: 28,
          paddingTop: 2,
        }}
        color={color}
      >
        {SeverityMap[Severity]}
      </Tag>
    )
  }
  listRender = (dataSource) => {
    return (
      <ProList
        bordered={false}
        options={false}
        search={false}
        className={
          this.props.theme === 'dark'
            ? styles.handleEventsProListDark
            : styles.handleEventsProListLight
        }
        rowClassName={this.props.theme === 'dark' ? styles.listRowDark : styles.listRowLight}
        dataSource={dataSource?.slice(0, 50)}
        style={{ padding: 0 }}
        metas={{
          content: {
            render: this.listHandleContentRender,
          },
        }}
      />
    )
  }

  listContentRender = (_, record) => {
    const { intl } = this.props
    const categoryMap = {
      web_attack: 'Web攻击',
      data_risk: '数据风险',
      custom: '自定义',
    }
    const colorMap = {
      web_attack: '#1890ff',
      data_risk: '#faad14',
      custom: '#13c2c2',
    }
    const {
      Severity,
      EventName,
      CreatedAt,
      UpdatedAt,
      AttackerSrcHost,
      Status,
      Category,
      Confidence,
      Apps,
      API,
      AppAction,
      AppName,
    } = record

    return (
      <div className={styles.proListContent}>
        <Tooltip title="风险等级">{this.severityTagRender(Severity)}</Tooltip>
        <div className={styles.contentMain}>
          <div className={styles.mainTop}>
            <Space size="middle">
              <div className={styles.handleDetailsName}>
                <Typography.Text
                  style={{
                    width: '100%',
                  }}
                  ellipsis={{ tooltip: EventName }}
                >
                  {EventName}
                </Typography.Text>
              </div>
              <Tooltip title={intl.formatMessage({ id: 'pages.events.column.Status' })}>
                <div className={styles.status}>{StatusMap[Status]}</div>
              </Tooltip>
              <Tooltip title="风险类别">
                <div style={{ color: colorMap[Category] }}>
                  <Badge color={colorMap[Category]} />
                  {categoryMap[Category]}
                </div>
              </Tooltip>
              <Tooltip title="准确度">
                <div>准确度: {ConfidenceMap[Confidence]}</div>
              </Tooltip>
              <Tooltip title="首次发现时间">
                <span>首次: {moment(CreatedAt).format('YYYY-MM-DD HH:mm:ss')}</span>
              </Tooltip>
              <Tooltip title="最新发现时间">
                <span>最新: {moment(UpdatedAt).format('YYYY-MM-DD HH:mm:ss')}</span>
              </Tooltip>
            </Space>
          </div>
          <div className={styles.mainBottom}>
            <Space size="middle">
              <Typography.Text
                style={{
                  width: '200px',
                }}
                ellipsis={{ tooltip: API }}
              >
                <span>API: {API}</span>
              </Typography.Text>
              <Tooltip title="攻击源">
                <span>攻击源: {AttackerSrcHost}</span>
              </Tooltip>
              <Tooltip title="Action">
                <span>Action: {AppAction}</span>
              </Tooltip>
              <Tooltip title="产品">
                <span>产品: {AppName}</span>
              </Tooltip>
            </Space>
          </div>
        </div>
        <Applications apps={Apps} count={3} />
      </div>
    )
  }
  listHandleContentRender = (_, record) => {
    const {
      Severity,
      EventName,
      CreatedAt,
      UpdatedAt,
      Status,
      Category,
      Confidence,
      Apps,
      API,
      AppAction,
      AppName,
      SrcHost,
      EventId,
    } = record
    const { eventDetails, theme } = this.props

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
                    visibility: this.state.expandEventIds.includes(EventId) ? 'hidden' : '',
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
                    const index = this.state.expandEventIds.findIndex((id) => id === EventId)
                    if (index === -1) {
                      this.showHandleDetails(EventId)
                      this.setState(({ expandEventIds }) => {
                        expandEventIds.push(EventId)
                        return { expandEventIds }
                      })
                    } else {
                      this.setState(({ expandEventIds }) => {
                        expandEventIds.splice(index, 1)
                        return { expandEventIds }
                      })
                    }
                  }}
                >
                  <span>详情</span>
                  <RightOutlined style={{ paddingTop: 4 }} />
                </Button>
              </Space>
            </div>
          </div>
        </div>
        {this.state.expandEventIds.includes(EventId) && (
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
                    const index = this.state.expandEventIds.findIndex((id) => id === EventId)
                    this.setState(({ expandEventIds }) => {
                      expandEventIds.splice(index, 1)
                      return { expandEventIds }
                    })
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

  listExpandable = {
    expandedRowRender: (record) => {
      console.log(record, '展开行kkkkkkk')
    },
  }
  // 查询区域 收起/折叠 的回调
  onCollapse = (collapsed) => this.setState({ collapsed })

  // render查询panel
  renderSearcPanel = (Total = 0, APITotal = 0, Counts = 0) => {
    const { intl } = this.props
    const categoryMap = [
      { value: 'web_attack', label: 'Web攻击' },
      { value: 'data_risk', label: '数据风险' },
      { value: 'custom', label: '自定义' },
    ]

    return (
      <React.Fragment>
        <QueryFilter
          onFinish={this.onSearch}
          defaultColsNumber={3}
          onCollapse={this.onCollapse}
          labelWidth={80}
          labelAlign="left"
          size="middle"
          autoFocusFirstInput={false}
          initialValues={{ Status: ['Undisposed'] }}
        >
          <ProFormSelect
            name="Status"
            label={intl.formatMessage({ id: 'pages.events.search.Status' })}
            valueEnum={{ ...StatusMap, Processed: '已处理' }}
            fieldProps={{
              mode: 'multiple',
            }}
            placeholder="可多选"
          />
          <ProFormText
            label="事件名称"
            name="Search"
            placeholder={intl.formatMessage({ id: 'pages.events.input.event.name' })}
          />
          <ProFormText label="IP筛选" name="DstIp" placeholder="输入IP" />
          <ProFormText label="攻击源" name="SrcIp" placeholder="输入攻击源IP" />
          <ProFormText label="事件路径" name="Path" placeholder="输入路径" />
          <ProFormText label="报文筛选" placeholder="输入报文" />
          <ProFormText label="产品" name="AppName" placeholder="输入产品" />
          <ProFormText label="Action" name="AppAction" placeholder="输入Action" />
          <ProFormCheckbox.Group name="Severities" label="事件等级" options={SeverityOptions} />
          <ProFormCheckbox.Group name="Category" label="事件类别" options={categoryMap} />
          <ProFormCheckbox.Group
            name="Confidences"
            label={intl.formatMessage({ id: 'pages.events.search.Confidence' })}
            options={ConfidencesOptions}
          />
        </QueryFilter>
      </React.Fragment>
    )
  }

  // 切换table页面或者显示个数
  changeSizeOrPage = (page, pageSize) => {
    const { currentQuery } = this.props
    const params = {
      ...currentQuery,
      PageNum: page,
      PageSize: pageSize,
    }
    this.getTableData(params)
  }

  // 修改事件状态
  modifyEventsStatus = (ids, status, callback) => {
    const { dispatch } = this.props
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

  // 查询
  onSearch = (query) => {
    const aa = Object.keys(query).forEach((key) => {
      const val = query[key]
      if (Array.isArray(val)) {
        query[key] = val.join(',').replace('Processed', 'Whited,Ignored,FalsePositive,Disposed')
      }
    })
    const params = {
      ...query,
      PageSize: 10,
      PageNum: 1,
    }
    this.getTableData(params)
  }

  render() {
    const { detailsDrawerVisible, detailsId, handleModalVisible, expandable } = this.state
    const {
      tableData = {},
      currentQuery = {},
      eventDetails = {},
      tableLoading,
      intl,
      theme,
      regularData = {},
    } = this.props
    const { Events = [], Total, APITotal, Counts } = tableData
    const { Whites = [] } = regularData
    const tableTitle = (
      <div style={{ fontSize: '16px' }}>
        {intl.formatMessage({ id: 'pages.events.event.list' })}
      </div>
    )
    const categoryMap = {
      web_attack: 'Web攻击',
      data_risk: '数据风险',
      custom: '自定义',
    }
    const colorMap = {
      web_attack: '#1890ff',
      data_risk: '#faad14',
      custom: '#13c2c2',
    }
    const radioOptions = [
      { label: '加白名单', value: 'Whited' },
      { label: '忽略', value: 'Ignored' },
      { label: '误报', value: 'FalsePositive' },
      { label: '手动处理', value: 'Disposed' },
    ]
    const regularColumns = [
      {
        title: '告警名称',
        dataIndex: 'EventName',
      },
      {
        title: '加白字段',
        dataIndex: 'Strategys',
        render: (arr) => {
          return (
            <Space direction="vertical">
              {arr.map(({ Field }, i) => (
                <span key={i}>{Field}</span>
              ))}
            </Space>
          )
        },
      },
      {
        title: '告警规则',
        dataIndex: 'Strategys',
        render: (arr) => {
          return (
            <Space direction="vertical">
              {arr.map(({ Regular }, i) => (
                <span key={i}>{Regular}</span>
              ))}
            </Space>
          )
        },
      },
      {
        title: <span style={{ paddingRight: 24 }}>操作</span>,
        dataIndex: '',
        align: 'right',
        render: (_, record) => {
          return (
            <div style={{ paddingRight: 7 }}>
              <Button
                type="link"
                onClick={() => {
                  this.setState(
                    {
                      regularRecord: record,
                      isEditRegularVisible: true,
                    },
                    () => {
                      const fieldMap = {
                        src_host: 'SrcHost',
                        dst_host: 'DstHost',
                        url: 'Url',
                        req_headers: 'ReqHeaders',
                        req_body: 'ReqBody',
                        resp_headers: 'RespHeaders',
                        resp_body: 'RespBody',
                      }
                      const strategys = this.state.regularRecord.Strategys.map(
                        ({ Field, Regular }) => ({ Field: fieldMap[Field], Regular }),
                      )
                      this.editFormRef.current.setFieldsValue({
                        editRegulars: strategys,
                      })
                    },
                  )
                }}
              >
                编辑
              </Button>
              <span style={{ color: '#ccc' }}>|</span>
              <Button
                type="link"
                onClick={() => {
                  Modal.confirm({
                    title: '是否确认删除？',
                    okText: '删除',
                    okButtonProps: {
                      danger: true,
                    },
                    onOk: () => {
                      this.deleteWhiteStrategys([record.Type])
                    },
                  })
                }}
              >
                删除
              </Button>
            </div>
          )
        },
      },
    ]
    return (
      <PageContainer
        className={styles.pageWrapper}
        header={{
          title: null,
          style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
          extra: (
            <Button
              type="primary"
              onClick={() => {
                this.setState({
                  isRuleModalVisible: true,
                })
                this.getWhiteStrategys()
              }}
            >
              白名单规则查看
            </Button>
          ),
        }}
      >
        <OverView />
        <EventsStateTrend />
        <TrendTabs />
        <ProList
          loading={tableLoading}
          className={styles.eventsProList}
          rowClassName={theme === 'dark' ? styles.listRowDark : styles.listRowLight}
          options={false}
          rowSelection
          search={false}
          rowKey="EventId"
          dataSource={Events}
          onRow={({ EventId }) => {
            return {
              onClick: this.showDetails.bind(this, EventId),
            }
          }}
          toolbar={{
            title: tableTitle,
            multipleLine: true,
            filter: this.renderSearcPanel(Total, APITotal, Counts),
          }}
          metas={{
            content: {
              render: this.listContentRender,
            },
            extra: {
              render: (_, { Status, Type, Category, EventId, EventName }) => (
                <Space>
                  {Status === 'Undisposed' && (
                    <Button
                      type="primary"
                      onClick={(e) => this.showHandleModal(e, Type, Category, EventId, EventName)}
                    >
                      处置
                    </Button>
                  )}
                  {Status === 'Whited' && (
                    <Popconfirm
                      title={
                        Status === 'Whited' ? '确定取消加入白名单吗？' : '确定标记为加入白名单吗？'
                      }
                      onConfirm={(e) => {
                        e.stopPropagation()
                        this.modifyEventsStatus(
                          [EventId],
                          Status === 'Whited' ? 'Undisposed' : 'Whited',
                        )
                      }}
                      onCancel={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      <Button
                        type="primary"
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                      >
                        {Status === 'Whited' ? '取消加白' : '加白名单'}
                      </Button>
                    </Popconfirm>
                  )}
                  {(Status === 'FalsePositive' ||
                    Status === 'Ignored' ||
                    Status === 'Disposed') && <Button type="primary">详情</Button>}

                  <RightOutlined />
                </Space>
              ),
            },
          }}
          pagination={{
            defaultPageSize: 10,
            pageSizeOptions: [10, 20],
            showQuickJumper: true,
            current: currentQuery.PageNum || 1,
            total: Total,
            showTotal: (total, range) => {
              return intl.formatMessage(
                { id: 'pages.events.pagination.showtotal' },
                {
                  total,
                  scope: `${range[0]}-${range[1]}`,
                },
              )
            },
            onChange: this.changeSizeOrPage,
          }}
          tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
            <span>
              <span style={{ color: theme === 'dark' ? '#fff' : '#000' }}>
                {intl.formatMessage(
                  { id: 'pages.events.selected.items' },
                  { count: selectedRowKeys.length },
                )}
              </span>
              <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                {intl.formatMessage({ id: 'pages.events.button.deselect' })}
              </a>
            </span>
          )}
          tableAlertOptionRender={({ selectedRowKeys, _, onCleanSelected }) => {
            return (
              <Space>
                <Popconfirm
                  title="确定标记为加入白名单吗？"
                  onConfirm={this.modifyEventsStatus.bind(
                    this,
                    selectedRowKeys,
                    'Whited',
                    onCleanSelected,
                  )}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button>加白名单</Button>
                </Popconfirm>
                <Popconfirm
                  title={intl.formatMessage({ id: 'pages.events.mark.as.ignored' })}
                  onConfirm={this.modifyEventsStatus.bind(
                    this,
                    selectedRowKeys,
                    'Ignored',
                    onCleanSelected,
                  )}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button>{intl.formatMessage({ id: 'pages.events.button.ignore' })}</Button>
                </Popconfirm>
                <Popconfirm
                  title={intl.formatMessage({ id: 'pages.events.mark.as.falsealarm' })}
                  onConfirm={this.modifyEventsStatus.bind(
                    this,
                    selectedRowKeys,
                    'FalsePositive',
                    onCleanSelected,
                  )}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button>{intl.formatMessage({ id: 'pages.events.button.falsealarm' })}</Button>
                </Popconfirm>
                <Popconfirm
                  title="确定标记为手动处理吗？"
                  onConfirm={this.modifyEventsStatus.bind(
                    this,
                    selectedRowKeys,
                    'Disposed',
                    onCleanSelected,
                  )}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button>手动处理</Button>
                </Popconfirm>
              </Space>
            )
          }}
        />
        <Details
          details={eventDetails}
          visible={detailsDrawerVisible}
          onClose={this.closeDetailsDarwer}
          onModifyStatus={this.modifyEventsStatus}
          id={detailsId}
          title="事件详情"
          showHandleModal={this.showHandleModal}
          showDetails={this.showDetails}
        />
        <Modal
          title={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography.Text
                style={{
                  maxWidth: '60%',
                }}
                ellipsis={{ tooltip: this.state.EventName }}
              >
                {this.state.EventName}
              </Typography.Text>
              <Tooltip title="风险类别">
                <div style={{ color: colorMap[this.state.category], marginLeft: 20, fontSize: 14 }}>
                  <Badge color={colorMap[this.state.category]} />
                  {categoryMap[this.state.category]}
                </div>
              </Tooltip>
            </div>
          }
          visible={handleModalVisible}
          onCancel={this.closeHandleModal}
          okText="立即处理"
          width={600}
          onOk={this.handleRisk}
        >
          <div>
            <div style={{ fontSize: 16, marginBottom: 8, fontWeight: 500 }}>处理方式</div>
            <Radio.Group
              options={radioOptions}
              value={this.state.status}
              optionType="button"
              buttonStyle="solid"
              onChange={({ target: { value } }) => {
                this.setState({ status: value }, () => {
                  this.getStatusEvents()
                  if (value === 'Whited') {
                    this.getWhiteDetails()
                  }
                })
              }}
            />

            {this.state.status === 'Whited' && (
              <div>
                <div className={styles.handleTips}>
                  将选择加白名单操作后，当再次发生相同告警时将自动进入已处理列表中，不再进行告警通知，请谨慎操作
                </div>
                <div style={{ paddingBottom: 8 }}>加白规则设定</div>
                <Form
                  name="dynamic_form_nest_item"
                  autoComplete="off"
                  className={styles.configForm}
                  ref={this.formRef}
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
                                <Select
                                  style={{ width: 180 }}
                                  allowClear
                                  placeholder="选择规则类型"
                                >
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
            {this.state.status === 'Ignored' && (
              <div className={styles.handleTips}>
                选择忽略本告警后，该告警状态将更新为已处理。当相同告警再次发生时，本平台将会再次告警
              </div>
            )}
            {this.state.status === 'FalsePositive' && (
              <div className={styles.handleTips}>
                将本告警设置为误报后，系统将触发对误报事件的学习，以优化减少误报比例
              </div>
            )}
            {this.state.status === 'Disposed' && (
              <div className={styles.handleTips}>
                请在排查并优化处理风险漏洞后，将该告警事件标记为手工处理完成
              </div>
            )}
            {this.state.status === 'Whited' && (
              <div>
                {this.state.status === 'Whited' && (
                  <div>
                    <div style={{ fontSize: 16, margin: '24px 0 8px', fontWeight: 500 }}>
                      批量处理
                    </div>
                    <div>
                      <Checkbox onChange={this.changeChecked}>
                        按已配置规则批量处理同类型告警
                      </Checkbox>
                    </div>
                  </div>
                )}

                <div style={{ margin: '13.5px 0' }}>
                  <span style={{ marginRight: 16, color: '#8E8EA0' }}>
                    <span>相同的告警问题共</span>
                    <span style={{ margin: '0 5px', color: 'red' }}>
                      {this.props.statusEventData.Total || 0}
                    </span>
                    个
                  </span>
                  {expandable ? (
                    <Button type="link" onClick={this.expandList.bind(this)}>
                      收起
                      <UpOutlined />
                    </Button>
                  ) : (
                    <Button type="link" onClick={this.expandList.bind(this)}>
                      展开
                      <DownOutlined />
                    </Button>
                  )}
                </div>
                {expandable && this.listRender(this.props.statusEventData.Events)}
              </div>
            )}
          </div>
        </Modal>
        <Modal
          footer={null}
          width={900}
          title={
            <div>
              <div>加白规则</div>
              <div style={{ fontSize: 12, color: '#8E8EA0' }}>
                *删除白名单规则后，未来再发生同类事件系统会正常告警，但之前已经加白的告警事件状态仍会为‘已加白’
              </div>
            </div>
          }
          visible={this.state.isRuleModalVisible}
          onCancel={this.closeRuleModal}
        >
          <ProTable
            rowKey="Type"
            toolBarRender={false}
            search={false}
            // loading={loading}
            style={{ margin: '16px 0' }}
            pagination={false}
            columns={regularColumns}
            dataSource={Whites}
            rowSelection={{
              selectedRowKeys: this.state.selectedRecords?.map((e) => e.Type),
              onChange: (_, selectedRows) => {
                this.setState({
                  selectedRecords: selectedRows,
                })
              },
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Tooltip title={!this.state.selectedRecords.length ? '请选择' : ''}>
              <Button
                disabled={!this.state.selectedRecords.length}
                onClick={() => {
                  this.deleteWhiteStrategys(this.state.selectedRecords?.map((e) => e.Type))
                  this.getWhiteStrategys()
                }}
              >
                批量删除
              </Button>
            </Tooltip>
            <Pagination
              current={this.state.regularPageNum}
              pageSize={this.state.regularPageSize}
              showSizeChanger
              pageSizeOptions={[10, 20]}
              total={this.props.regularData.Total}
              onChange={(page, pageSize) => {
                this.setState({
                  regularPageNum: page,
                  regularPageSize: pageSize,
                })
              }}
            />
          </div>
        </Modal>
        <Modal
          width={650}
          title="加白规则编辑"
          visible={this.state.isEditRegularVisible}
          onCancel={() => {
            this.setState({
              isEditRegularVisible: false,
            })
          }}
          onOk={() => {
            this.updateWhiteStrategys()
          }}
        >
          <div>
            <Form
              name="editRegular"
              autoComplete="off"
              className={styles.configForm}
              ref={this.editFormRef}
            >
              <Form.List name="editRegulars">
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
                            name={[name, 'Field']}
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
                            name={[name, 'Regular']}
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
        </Modal>
        <Modal
          width={600}
          title="告警处理"
          visible={this.state.feedbackModalVisible}
          footer={null}
          onCancel={() => {
            this.setState({
              feedbackModalVisible: false,
            })
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 13.5 }}>
              <div>
                已为您处理
                <span style={{ color: '#6FCF97', margin: '0 4px' }}>
                  {this.props.feedbackDetails.Total}
                </span>
                个告警问题
              </div>
              <div>
                <CheckCircleOutlined style={{ fontSize: 16, color: '#6FCF97' }} />
              </div>
            </div>
            {this.listRender(this.props.feedbackDetails.Events)}
          </div>
        </Modal>
      </PageContainer>
    )
  }
}

export default injectIntl(AttackEvents)
