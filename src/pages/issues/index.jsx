import React from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import { QueryFilter, ProFormText, ProFormSelect } from '@ant-design/pro-form'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { Link, connect, injectIntl } from 'umi'
import IssuesStat from '@/components/Issues/stat.jsx'
import TrendTabs from '@/components/Issues/trendTabs.jsx'
import Details from '@/components/Issues/detailDraw.jsx'
import { Button, Tag, Space, Popconfirm, Popover } from 'antd'
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

@connect(({ issues, loading }) => ({
  tableData: issues.tableData,
  currentQuery: issues.currentQuery,
  issuesDetails: issues.issuesDetails,
  tableLoading: loading.effects['issues/getTableData'],
}))
class Issuess extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      detailsDrawerVisible: false,
      collapsed: true,
    }
  }

  componentDidMount() {
    this.getTableData()
  }

  getTableData(params = { PageSize: 10, PageNum: 1 }) {
    const { dispatch } = this.props
    if (dispatch) {
      dispatch({
        type: 'issues/getTableData',
        payload: { ...params, ...{ Lang: getLocaleForAPI() } },
      })
    }
  }

  closeDetailsDarwer = () => {
    this.setState({
      detailsDrawerVisible: false,
    })
  }

  // 展示威胁详情Drawer
  showDetails = (IssueId) => {
    this.setState({
      detailsDrawerVisible: true,
      detailsId: IssueId,
    })
    const { dispatch } = this.props
    if (dispatch) {
      dispatch({
        type: 'issues/getIssuesDetails',
        payload: {
          IssueId: IssueId,
          Lang: getLocaleForAPI(),
        },
      })
    }
  }

  // Table的列定义
  getColumns() {
    const { intl } = this.props

    return [
      {
        title: '#',
        dataIndex: 'Index',
        width: 50,
        align: 'left',
      },
      {
        title: intl.formatMessage({ id: 'pages.issues.column.IssueName' }),
        dataIndex: 'IssueName',
        width: 150,
        render: (IssuesName, item) => {
          return (
            <div
              style={{ cursor: 'pointer' }}
              onClick={this.showDetails.bind(this, parseInt(item.IssueId))}
            >
              {IssuesName}
            </div>
          )
        },
      },
      {
        title: intl.formatMessage({ id: 'pages.issues.column.Severity' }),
        width: 80,
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
        title: intl.formatMessage({ id: 'pages.issues.column.Status' }),
        width: 60,
        dataIndex: 'Status',
        render: (Status) => {
          return <div>{StatusMap[Status]}</div>
        },
      },
      {
        title: intl.formatMessage({ id: 'pages.issues.column.Confidence' }),
        width: 60,
        dataIndex: 'Confidence',
        render: (Confidence) => {
          return <div>{ConfidenceMap[Confidence]}</div>
        },
      },
      {
        title: intl.formatMessage({ id: 'pages.issues.column.UpdatedAt' }),
        width: 110,
        dataIndex: 'UpdatedAt',
        sorter: (a, b) => Date.parse(a.UpdatedAt) - Date.parse(b.UpdatedAt),
        render: (UpdatedAt) => moment(UpdatedAt).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: intl.formatMessage({ id: 'pages.issues.column.API' }),
        dataIndex: 'API',
        width: 240,
        copyable: true,
        ellipsis: true,
      },
      {
        title: intl.formatMessage({ id: 'pages.issues.column.Apps' }),
        width: 80,
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
            <Popover
              title={intl.formatMessage({ id: 'pages.issues.popover.apps' })}
              content={
                length === 0 ? intl.formatMessage({ id: 'pages.issues.popover.none' }) : appList
              }
              trigger="click"
            >
              <Button>{`${length} Apps`}</Button>
            </Popover>
          )
        },
      },
    ]
  }

  // render查询panel
  renderSearcPanel = (Total = 0, APITotal = 0) => {
    const { intl } = this.props

    return (
      <React.Fragment>
        <Tag className={styles['table-tips']} color="blue">
          <ExclamationCircleFilled style={{ color: '#1890ff', marginRight: '4px' }} />
          {intl.formatMessage(
            { id: 'pages.issues.alarm.message' },
            {
              total: Total,
              apiTotal: APITotal,
              span: (str) => <span style={{ color: '#1890ff', margin: 0 }}>{str}</span>,
            },
          )}
        </Tag>
        <QueryFilter
          // labelWidth="auto"
          defaultColsNumber={1}
          onFinish={this.onSearch}
          onCollapse={this.onCollapse}
          labelWidth={'auto'}
        >
          <ProFormText
            colSize={this.state.collapsed ? 3 : 4}
            width="md"
            name="Search"
            placeholder={intl.formatMessage({ id: 'pages.issues.input.vulnerability.name' })}
          />
          <ProFormSelect
            mode="multiple"
            allowClear
            label={intl.formatMessage({ id: 'pages.issues.search.severities' })}
            width="xs"
            options={SeverityOptions}
            name="Severities"
          />
          <ProFormSelect
            allowClear
            label={intl.formatMessage({ id: 'pages.issues.search.status' })}
            width="xs"
            options={StatusOptions}
            name="Status"
          />
          <ProFormSelect
            mode="multiple"
            label={intl.formatMessage({ id: 'pages.issues.search.confidences' })}
            width="xs"
            options={ConfidencesOptions}
            name="Confidences"
          />
        </QueryFilter>
      </React.Fragment>
    )
  }

  // 切换table页面或者显示个数
  changeSizeOrPage = (paging) => {
    const { currentQuery } = this.props
    const { pageSize, current } = paging
    const params = {
      ...currentQuery,
      PageSize: pageSize,
      PageNum: current,
    }
    this.getTableData(params)
  }

  // 修改威胁状态
  modifyIssuesStatus = (ids, status, callback) => {
    const { dispatch } = this.props
    if (dispatch) {
      dispatch({
        type: 'issues/modifyStatus',
        payload: {
          IssueIds: ids,
          Status: status,
        },
      })
      callback && callback()
    }
  }

  // 查询
  onSearch = (query) => {
    const params = {
      ...query,
      PageSize: 10,
      PageNum: 1,
    }
    this.getTableData(params)
  }

  // 查询区域 收起/折叠 的回调
  onCollapse = (collapsed) => this.setState({ collapsed })

  render() {
    const { detailsDrawerVisible, detailsId } = this.state
    const { tableData = {}, currentQuery = {}, issuesDetails = {}, tableLoading, intl } = this.props
    const { Issues = [], Total, APITotal } = tableData

    return (
      <PageContainer header={{ title: null }}>
        <IssuesStat />
        <TrendTabs />
        <ProTable
          loading={tableLoading}
          className={styles.issuesTable}
          options={{
            fullScreen: true,
          }}
          rowSelection
          search={false}
          rowKey="IssueId"
          dataSource={Issues}
          columns={this.getColumns()}
          toolbar={{
            title: intl.formatMessage({ id: 'pages.issues.vulnerability.list' }),
            multipleLine: true,
            filter: this.renderSearcPanel(Total, APITotal),
          }}
          pagination={{
            defaultPageSize: 10,
            pageSizeOptions: [10, 20],
            showQuickJumper: true,
            current: currentQuery.PageNum || 1,
            total: Total,
            showTotal: (total, range) => {
              return intl.formatMessage(
                { id: 'pages.issues.pagination.showtotal' },
                {
                  total: total,
                  scope: `${range[0]}-${range[1]}`,
                },
              )
            },
          }}
          onChange={this.changeSizeOrPage}
          tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
            <span>
              {intl.formatMessage(
                { id: 'pages.issues.selected.items' },
                { count: selectedRowKeys.length },
              )}
              <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                {intl.formatMessage({ id: 'pages.issues.button.deselect' })}
              </a>
            </span>
          )}
          tableAlertOptionRender={({ selectedRowKeys, _, onCleanSelected }) => {
            return (
              <Space>
                <Popconfirm
                  title={intl.formatMessage({ id: 'pages.issues.mark.as.ignored' })}
                  onConfirm={this.modifyIssuesStatus.bind(
                    this,
                    selectedRowKeys,
                    'Ignored',
                    onCleanSelected,
                  )}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button>{intl.formatMessage({ id: 'pages.issues.button.ignore' })}</Button>
                </Popconfirm>
                <Popconfirm
                  title={intl.formatMessage({ id: 'pages.issues.mark.as.falsealarm' })}
                  onConfirm={this.modifyIssuesStatus.bind(
                    this,
                    selectedRowKeys,
                    'FalsePositive',
                    onCleanSelected,
                  )}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button>{intl.formatMessage({ id: 'pages.issues.button.falsealarm' })}</Button>
                </Popconfirm>
                <Popconfirm
                  title={intl.formatMessage({ id: 'pages.issues.mark.as.processed' })}
                  onConfirm={this.modifyIssuesStatus.bind(
                    this,
                    selectedRowKeys,
                    'Disposed',
                    onCleanSelected,
                  )}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button>{intl.formatMessage({ id: 'pages.issues.button.process' })}</Button>
                </Popconfirm>
              </Space>
            )
          }}
        />
        <Details
          details={issuesDetails}
          visible={detailsDrawerVisible}
          onClose={this.closeDetailsDarwer}
          onModifyStatus={this.modifyIssuesStatus}
          id={detailsId}
        />
      </PageContainer>
    )
  }
}

export default injectIntl(Issuess)
