import React from 'react'
import {
  Tag,
  Button,
  Table,
  Pagination,
  message,
  Popover,
  Space,
  Modal,
  Tooltip,
  Typography,
  Popconfirm,
  Badge,
} from 'antd'
import ProList from '@ant-design/pro-list'
import { getListApiEvents } from '@/services/assets'
import { GetEventDetails, modifyStatus } from '@/services/secureEvents.js'
import { modifyApiEventStatus } from '@/services/apiPortrait'
import { modifyApiRiskStatus } from '@/services/apiPortrait'
import { SeverityMap, StatusMap, ConfidenceMap } from '@/constant/content.js'
import { injectIntl, Link, connect } from 'umi'
import moment from 'moment'
import { getLocaleForAPI } from '@/utils/utils'
import Details from '@/components/secureEvents/detailDraw'
import styles from './apiList.less'
import { RightOutlined } from '@ant-design/icons'
import Applications from '@/components/Common/Applications'

@connect(({ secure_events, global, loading }) => ({
  tableData: secure_events.tableData,
  currentQuery: secure_events.currentQuery,
  eventDetails: secure_events.eventDetails,
  tableLoading: loading.effects['secure_events/getTableData'],
  theme: global.theme,
}))
class ApiTableList extends React.Component {
  state = {
    dataSource: [],
    totalNum: 0,
    selectedRowKeys: [],
    loading: false,
    pageNum: 1,
    pageSize: 6,
    // eventDetails: {},
    detailsId: null,
    detailsDrawerVisible: false,
  }

  componentDidMount() {
    this.getTableData()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.getTableData()
    }
  }

  getTableData = () => {
    const { name, data = {}, intl } = this.props
    const { Api } = data
    const { pageNum, pageSize } = this.state

    if (!Api) return

    const params = {
      Api: Api.includes('http://') ? Api : `http://${Api}`,
      PageNum: pageNum,
      PageSize: pageSize,
      Lang: getLocaleForAPI(),
    }
    this.setState({ loading: true })

    getListApiEvents(params)
      .then(({ Data }) => {
        this.setState({
          dataSource: Data.Events || Data.Risks || [],
          totalNum: Data.Total,
          loading: false,
        })
      })
      .catch((err) => console.log(err))
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }

  // showDetails = async (id) => {
  //   const { Code, Data } = await GetEventDetails({ EventId: id, Lang: getLocaleForAPI() })
  //   if (Code !== 'Succeed') return
  //   console.log(Data)

  //   this.setState({
  //     eventDetails: Data,
  //     detailsId: id,
  //     detailsDrawerVisible: true,
  //   })
  // }

  getColumns = () => {
    const columnsRisk = [
      {
        title: '风险名称',
        dataIndex: 'RiskName',
        render: (RiskName, { RiskId }) => {
          return (
            <div
              style={{ cursor: 'pointer', color: '#1890ff' }}
              onClick={() => this.showDetails(RiskId)}
            >
              {RiskName}
            </div>
          )
        },
      },
      {
        title: '事件等级',
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
        title: '攻击源',
        dataIndex: 'SrcHost',
      },
      {
        title: '状态',
        dataIndex: 'Status',
        render: (Status) => {
          return <div>{StatusMap[Status]}</div>
        },
      },
      {
        title: '最新时间',
        dataIndex: 'UpdatedAt',
        render: (UpdatedAt) => moment(UpdatedAt).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: 'URL',
        dataIndex: 'Url',
        ellipsis: true,
      },
      {
        title: '影响应用',
        dataIndex: 'Apps',
        render: (_, row) => {
          const { Apps = [] } = row
          const length = Apps.length
          const appList = () => {
            return (
              <div>
                {Apps.map((item) => {
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
            <Popover title="应用列表" content={length === 0 ? '无' : appList} trigger="click">
              <Button>{`${length} Apps`}</Button>
            </Popover>
          )
        },
      },
    ]

    const columnsEvents = [
      {
        title: '事件名称',
        dataIndex: 'EventName',
        render: (EventName, { EventId }) => {
          return (
            <div
              style={{ cursor: 'pointer', color: '#1890ff' }}
              onClick={() => this.showDetails(EventId)}
            >
              {EventName}
            </div>
          )
        },
      },
      {
        title: '事件等级',
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
        title: '攻击源',
        dataIndex: 'SrcHost',
      },
      {
        title: '状态',
        dataIndex: 'Status',
        render: (Status) => {
          return <div>{StatusMap[Status]}</div>
        },
      },
      {
        title: '最新时间',
        dataIndex: 'UpdatedAt',
        render: (UpdatedAt) => moment(UpdatedAt).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: 'URL',
        dataIndex: 'Url',
        ellipsis: true,
      },
      {
        title: '影响应用',
        dataIndex: 'Apps',
        render: (_, row) => {
          const { Apps = [] } = row
          const length = Apps.length
          const appList = () => {
            return (
              <div>
                {Apps.map((item) => {
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
            <Popover title="应用列表" content={length === 0 ? '无' : appList} trigger="click">
              <Button>{`${length} Apps`}</Button>
            </Popover>
          )
        },
      },
    ]

    return this.props.name === 'risk' ? columnsRisk : columnsEvents
  }

  closeDetailsDarwer = () => this.setState({ detailsDrawerVisible: false })

  modifyEventsStatus = async (ids, status, callback) => {
    const { Code } = await modifyStatus({ EventIds: ids, Status: status })
    if (Code !== 'Succeed') return

    message.success('修改成功！')
    this.getTableData()
    callback && callback()
  }
  // 切换table页面或者显示个数
  changeSizeOrPage = (page, pageSize) => {
    this.setState(
      {
        pageNum: page,
        pageSize: pageSize,
      },
      () => {
        this.getTableData()
      },
    )
  }
  // 展示事件详情Drawer
  showDetails = (eventId) => {
    this.setState({
      detailsDrawerVisible: true,
      detailsId: eventId,
    })
    const { dispatch } = this.props
    if (dispatch) {
      dispatch({
        type: 'secure_events/GetEventDetails',
        payload: {
          EventId: eventId,
          Lang: getLocaleForAPI(),
        },
      })
    }
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
      SrcHost,
      RiskName,
    } = record

    return (
      <div className={styles.proListContent}>
        <Tooltip title="风险等级">{this.severityTagRender(Severity)}</Tooltip>
        <div className={styles.contentMain}>
          <div className={styles.mainTop}>
            <Space size="middle">
              <div className={styles.eventName}>
                <Typography.Text
                  style={{
                    width: '100%',
                  }}
                  ellipsis={{ tooltip: RiskName || EventName }}
                >
                  {RiskName || EventName}
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
            </Space>
          </div>
          <div className={styles.mainBottom}>
            <Space size="middle">
              <Tooltip title="攻击源">
                <span>攻击源: {SrcHost}</span>
              </Tooltip>
              <Tooltip title="最新发现时间">
                <span>最新: {moment(UpdatedAt).format('YYYY-MM-DD HH:mm:ss')}</span>
              </Tooltip>
            </Space>
          </div>
        </div>
        <Applications apps={Apps} count={3} />
      </div>
    )
  }

  onModifyStatus = (targetStatus) => {
    const { selectedRowKeys } = this.state
    const len = selectedRowKeys.length
    if (!len) return

    const title = (
      <div>
        确认将
        <span style={{ color: '#1890FF', margin: '0 4px' }}>{len}</span>
        条数据的状态修改为
        <span style={{ color: '#1890FF', margin: '0 4px' }}>{StatusMap[targetStatus]}</span>
        吗？
      </div>
    )
    const { name } = this.props

    Modal.confirm({
      title,
      width: 480,
      closable: true,
      onOk: async () => {
        let req = modifyApiEventStatus
        let IdsKey = 'EventIds'
        if (name === 'risk') {
          req = modifyApiRiskStatus
          IdsKey = 'RiskIds'
        }

        const { Code } = await req({
          [IdsKey]: selectedRowKeys,
          Status: targetStatus,
        })
        if (Code !== 'Succeed') return

        message.success(`成功将 ${len} 条数据状态修改为 ${StatusMap[targetStatus]}`)
        this.getTableData()
      },
    })
  }

  render() {
    const {
      selectedRowKeys,
      dataSource = [],
      pageNum,
      totalNum,
      // eventDetails,
      detailsDrawerVisible,
      detailsId,
      loading,
    } = this.state
    const { intl, name, currentQuery, theme, eventDetails } = this.props
    const { Events = [], Total, APITotal, Counts } = dataSource

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }

    return (
      <div>
        <ProList
          options={false}
          rowSelection
          search={false}
          rowKey={name === 'risk' ? 'RiskId' : 'EventId'}
          dataSource={dataSource}
          className={styles.eventsProList}
          rowClassName={theme === 'dark' ? styles.listRowDark : styles.listRowLight}
          onRow={({ RiskId, EventId }) => {
            return {
              onClick: this.showDetails.bind(this, RiskId || EventId),
            }
          }}
          metas={{
            content: {
              render: this.listContentRender,
            },
            extra: {
              render: () => <RightOutlined />,
            },
          }}
          pagination={{
            defaultPageSize: 6,
            // hideOnSinglePage: true,
            pageSizeOptions: [6],
            current: currentQuery.PageNum || 1,
            total: totalNum,
            showTotal: false,
            showQuickJumper: false,
            showSizeChanger: false,
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
          title={name === 'risk' ? '风险详情' : '事件详情'}
        />
      </div>
    )
  }
}

export default injectIntl(ApiTableList)
