import React from 'react'
import {
  Table,
  Pagination,
  Progress,
  message,
  Tag,
  Space,
  Select,
  Input,
  Spin,
  Typography,
} from 'antd'
import moment from 'moment'
import { getListTaskRuns, startTaskRuns, stopTaskRuns, deleteTaskRuns } from '@/services/task'
import { injectIntl } from 'umi'
import styles from './index.less'

const { Option } = Select
const { Search } = Input

function transTime(s) {
  let t
  if (s > -1) {
    const hour = Math.floor(s / 3600)
    const min = Math.floor(s / 60) % 60
    const sec = s % 60
    if (hour < 10) {
      t = `0${hour}h `
    } else {
      t = `${hour}h `
    }

    if (min < 10) {
      t += '0'
    }
    t += `${min}m `
    if (sec < 10) {
      t += '0'
    }
    t += `${Math.floor(sec)}s`
  }

  return t
}
class TableTaskInstance extends React.Component {
  state = {
    pageNum: 1,
    pageSize: 20,
    totalNum: 0,
    searchVal: '',
    taskRunType: 'all',

    loading: false,

    taskRunList: [],
    selectedRowKeys: [],
  };

  componentDidMount() {
    this.getTableData()
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  };

  getTableData = () => {
    const { searchVal, pageSize, pageNum, taskRunType } = this.state

    this.setState({
      loading: true,
    })

    const queryData = {
      PageSize: pageSize,
      PageNum: pageNum,
      Search: searchVal,
      Status: taskRunType,
    }

    if (taskRunType === 'all') {
      delete queryData.Status
    }

    getListTaskRuns(queryData)
      .then((res) => {
        this.setState({
          loading: false,
        })
        if (res.Code === 'Succeed') {
          const { TaskRuns = [], Total } = res.Data || {}
          this.setState({
            taskRunList: TaskRuns,
            totalNum: Total,
          })
        } else {
          const { intl } = this.props
          message.error(intl.formatMessage({ id: 'pages.task.management.get.data.fail' }))
        }
      })
      .catch((e) => {
        this.setState({
          loading: false,
        })
        console.log(e)
      })
  };

  handleTableAction = (type, taskId) => {
    // 有taskId表示单个操作
    const { selectedRowKeys } = this.state
    const { intl } = this.props
    const TaskRunIds = taskId ? [taskId] : selectedRowKeys

    if (!TaskRunIds.length) {
      message.warning(intl.formatMessage({ id: 'pages.task.management.task.instance.required' }))
      return
    }

    let fetchApi
    if (type === 'del') {
      fetchApi = deleteTaskRuns
      console.log(selectedRowKeys)
    } else if (type === 'run') {
      fetchApi = startTaskRuns
    } else if (type === 'stop') {
      fetchApi = stopTaskRuns
    }

    fetchApi({
      TaskRunIds,
    })
      .then((res) => {
        console.log(res)
        if (res.Code === 'Succeed') {
          message.success(intl.formatMessage({ id: 'pages.task.management.action.success' }))
          this.getTableData()
        } else {
          message.error(intl.formatMessage({ id: 'pages.task.management.action.fail' }))
        }
      })
      .catch((e) => {
        console.log(e)
      })
  };

  getColumns = () => {
    const { intl } = this.props
    const taskStatusMap = {
      Running: intl.formatMessage({ id: 'pages.task.management.task.running' }),
      Finished: intl.formatMessage({ id: 'pages.task.management.task.completed' }),
      Stopped: intl.formatMessage({ id: 'pages.task.management.task.stopped' }),
      Pending: intl.formatMessage({ id: 'pages.task.management.task.pending' }),
    }
    const columns = [
      {
        title: intl.formatMessage({ id: 'pages.task.management.column.instancename' }),
        dataIndex: 'Name',
      },
      {
        title: intl.formatMessage({ id: 'pages.task.management.column.policy' }),
        dataIndex: 'Policy',
        render: (policy) => {
          return <>{policy.PolicyName}</>
        },
      },
      {
        title: intl.formatMessage({ id: 'pages.task.management.column.status' }),
        dataIndex: 'Status',
        render: (status) => {
          let dotColor
          if (status === 'Finished') {
            dotColor = 'green'
          } else {
            dotColor = status === 'Stopped' ? 'red' : 'grey'
          }

          return (
            <>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  className={styles.dot}
                  style={{ background: dotColor, marginRight: 5 }}
                ></span>
                <span>{taskStatusMap[status]}</span>
              </div>
            </>
          )
        },
      },
      {
        title: intl.formatMessage({ id: 'pages.task.management.column.progress' }),
        dataIndex: 'Progress',
        render: (progress, item) => {
          let dom
          if (item.Status === 'Finished') {
            dom = <Progress type="circle" percent={100} width={40} />
          } else if (item.Status === 'Stopped') {
            dom = (
              <Progress
                type="circle"
                strokeColor={'rgb(255, 77, 79)'}
                percent={progress * 100}
                width={40}
              />
            )
          } else {
            dom = <Progress type="circle" percent={progress * 100} width={40} />
          }

          return <>{dom}</>
        },
      },
      {
        title: intl.formatMessage({ id: 'pages.task.management.column.elapsed' }),
        dataIndex: 'Elapsed',
        render: (time) => {
          return <>{transTime(time)}</>
        },
      },
      {
        title: intl.formatMessage({ id: 'pages.task.management.column.updatedat' }),
        dataIndex: 'UpdatedAt',
        render: (UpdatedAt) => moment(UpdatedAt).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: intl.formatMessage({ id: 'pages.task.management.column.issuesstat' }),
        dataIndex: 'IssuesStat',
        render: (state = {}) => {
          const tagStyle = {
            padding: '0',
            width: 34,
            textAlign: 'center',
          }

          return (
            <>
              <Tag color="#f50" style={tagStyle}>
                <Typography.Text
                  style={{ width: '100%', color: '#fff' }}
                  ellipsis={{ tooltip: state.High }}
                >
                  {state.High}
                </Typography.Text>
              </Tag>
              <Tag color="#f1b211" style={tagStyle}>
                <Typography.Text
                  style={{ width: '100%', color: '#fff' }}
                  ellipsis={{ tooltip: state.Medium }}
                >
                  {state.Medium}
                </Typography.Text>
              </Tag>
              <Tag color="#108ee9" style={tagStyle}>
                <Typography.Text
                  style={{ width: '100%', color: '#fff' }}
                  ellipsis={{ tooltip: state.Low }}
                >
                  {state.Low}
                </Typography.Text>
              </Tag>
              <Tag color="#87d068" style={tagStyle}>
                <Typography.Text
                  style={{ width: '100%', color: '#fff' }}
                  ellipsis={{ tooltip: state.Info }}
                >
                  {state.Info}
                </Typography.Text>
              </Tag>
            </>
          )
        },
      },
      {
        title: intl.formatMessage({ id: 'pages.task.management.column.operations' }),
        dataIndex: 'TaskRunId',
        render: (taskId, item) => {
          return (
            <Space>
              {item.Status === 'Stopped' ? (
                <a
                  onClick={() => {
                    this.handleTableAction('run', taskId)
                  }}
                >
                  {intl.formatMessage({ id: 'pages.task.management.button.startup' })}
                </a>
              ) : null}
              {item.Status === 'Running' ? (
                <a
                  onClick={() => {
                    this.handleTableAction('stop', taskId)
                  }}
                >
                  {intl.formatMessage({ id: 'pages.task.management.button.stop' })}
                </a>
              ) : null}
              {item.Status !== 'Running' ? (
                <a
                  onClick={() => {
                    this.handleTableAction('del', taskId)
                  }}
                  style={{ color: 'red' }}
                >
                  {intl.formatMessage({ id: 'component.button.delete' })}
                </a>
              ) : null}
            </Space>
          )
        },
      },
    ]

    return columns
  };

  render() {
    const { pageNum, totalNum, selectedRowKeys, taskRunList: taskRunListData } = this.state
    const { intl } = this.props

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }

    return (
      <>
        <Spin spinning={this.state.loading} tip="Loading">
          <div className={styles.searchArea}>
            <Select
              value={this.state.taskRunType}
              style={{ width: 130, marginRight: 16 }}
              onChange={(val) => {
                console.log(val)
                this.setState(
                  {
                    taskRunType: val,
                  },
                  () => {
                    this.getTableData()
                  },
                )
              }}
            >
              <Option value="all">{intl.formatMessage({ id: 'pages.task.management.all' })}</Option>
              <Option value="Pending">
                {intl.formatMessage({ id: 'pages.task.management.task.pending' })}
              </Option>
              <Option value="Running">
                {intl.formatMessage({ id: 'pages.task.management.task.running' })}
              </Option>
              <Option value="Finished">
                {intl.formatMessage({ id: 'pages.task.management.task.completed' })}
              </Option>
              <Option value="Stopped">
                {intl.formatMessage({ id: 'pages.task.management.task.stopped' })}
              </Option>
            </Select>
            <Search
              placeholder={intl.formatMessage({ id: 'pages.task.management.instance.search' })}
              onChange={(e) => {
                this.setState({
                  searchVal: e.target.value,
                })
              }}
              onSearch={() => {
                this.getTableData()
              }}
              enterButton
            />
          </div>
          <Table
            rowSelection={rowSelection}
            columns={this.getColumns()}
            dataSource={taskRunListData}
            rowKey={(record) => record.TaskRunId}
            pagination={false}
          />
          <div className={styles.tableFooter}>
            <div>
              <a
                onClick={() => {
                  this.handleTableAction('run')
                }}
              >
                {intl.formatMessage({ id: 'pages.task.management.button.startup' })}
              </a>
              <a
                onClick={() => {
                  this.handleTableAction('stop')
                }}
                style={{ margin: '0 5px' }}
              >
                {intl.formatMessage({ id: 'pages.task.management.button.stop' })}
              </a>
              <a
                style={{ color: 'red' }}
                onClick={() => {
                  this.handleTableAction('del')
                }}
              >
                {intl.formatMessage({ id: 'component.button.delete' })}
              </a>
            </div>
            <Pagination
              showQuickJumper
              current={pageNum}
              pageSize={this.state.pageSize}
              total={totalNum}
              pageSizeOptions={[10, 20]}
              onChange={(page) => {
                this.setState(
                  {
                    pageNum: page,
                  },
                  () => {
                    this.getTableData()
                  },
                )
              }}
            />
          </div>
        </Spin>
      </>
    )
  }
}

export default injectIntl(TableTaskInstance)
