import React from 'react'
import {
  Table,
  Pagination,
  Button,
  Tooltip,
  Tag,
  Input,
  Select,
  Spin,
  message,
  Progress,
  Space,
  Typography,
} from 'antd'
import {
  getListTasks,
  deleteTasks,
  getListTaskRuns,
  deleteTaskRuns,
  startTaskRuns,
  stopTaskRuns,
} from '@/services/task'
import { ClockCircleOutlined, FundOutlined, DownOutlined, RightOutlined } from '@ant-design/icons'
import TaskEdit from './taskEdit'
import moment from 'moment'
import { injectIntl, useSelector, connect } from 'umi'
import styles from './index.less'
import arrowRight from '@/assets/arrowRight.svg'
import arrowRightWhite from '@/assets/arrowRight_white.svg'
import arrowDown from '@/assets/arrowDown.svg'

const { Search } = Input
const { Option } = Select

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

@connect(({ global }) => ({ theme: global.theme }))
class TableTask extends React.Component {
  state = {
    pageNum: 1,
    pageSize: 10,
    totalNum: 0,

    loading: false,

    searchVal: '',
    taskType: 'all',

    taskList: [],
    selectedRowKeys: [],

    drawVisible: false,
    tasdId: null,

    taskMap: {},
  }

  componentDidMount() {
    this.getTableData()
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }

  getTableData = () => {
    const { pageNum, pageSize, searchVal, taskType } = this.state

    this.setState({
      loading: true,
    })

    const queryData = {
      Search: searchVal,
      Type: taskType,
      PageNum: pageNum,
      PageSize: pageSize,
    }

    if (queryData.Type === 'all') {
      delete queryData.Type
    }

    getListTasks(queryData)
      .then((res) => {
        this.setState({
          loading: false,
        })
        if (res.Code === 'Succeed') {
          const { Tasks = [], Total } = res.Data || {}
          this.setState({
            taskList: Tasks,
            totalNum: Total,
          })
        }
      })
      .catch((e) => {
        console.log(e)
        this.setState({
          loading: false,
        })
      })
  }

  handleEditTask = (item) => {
    const { TaskId } = item

    this.setState({
      taskId: TaskId,
      drawVisible: true,
    })
  }

  handleTableAction = (type, taskId) => {
    const { selectedRowKeys } = this.state
    let handleApi
    if (type === 'del') {
      handleApi = deleteTasks
    }

    handleApi({
      TaskIds: taskId ? [taskId] : selectedRowKeys,
    })
      .then((res) => {
        const { intl } = this.props
        console.log(res)
        if (res.Code === 'Succeed') {
          message.success(intl.formatMessage({ id: 'pages.task.management.action.success' }))

          this.setState(
            {
              pageNum: 1,
            },
            () => {
              this.getTableData()
            },
          )
        } else {
          message.error(intl.formatMessage({ id: 'pages.task.management.action.fail' }))
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }

  getColumns = () => {
    const { intl } = this.props
    const taskLabelMap = {
      Adhoc: intl.formatMessage({ id: 'pages.task.management.trigger.mode' }),
      Periodic: intl.formatMessage({ id: 'pages.task.management.periodic' }),
    }
    const columns = [
      {
        title: intl.formatMessage({ id: 'pages.task.management.column.taskname' }),
        dataIndex: 'Name',
      },
      {
        title: intl.formatMessage({ id: 'pages.task.management.column.type' }),
        dataIndex: 'Type',
        render: (type) => {
          return (
            <>
              {type === 'Adhoc' ? <FundOutlined /> : <ClockCircleOutlined />}
              <span style={{ marginLeft: 6 }}>{taskLabelMap[type]}</span>
            </>
          )
        },
      },
      {
        title: intl.formatMessage({ id: 'pages.task.management.column.policy' }),
        dataIndex: 'Policy',
        render: (policy) => {
          return <>{policy.PolicyName}</>
        },
      },
      {
        title: intl.formatMessage({ id: 'pages.task.management.column.updatedat' }),
        dataIndex: 'UpdatedAt',
        render: (UpdatedAt) => moment(UpdatedAt).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: intl.formatMessage({ id: 'pages.task.management.column.taskruns' }),
        dataIndex: 'TaskRuns',
        render: (task) => {
          return (
            <>
              <span style={{ color: 'green', marginRight: 6 }}>{task.Running || 0}</span>/
              <span style={{ color: 'red', margin: '0 6px' }}>{task.Stopped || 0}</span>/
              <span style={{ color: 'grey', marginLeft: 6 }}>{task.Finished || 0}</span>
            </>
          )
        },
      },
      {
        title: intl.formatMessage({ id: 'pages.task.management.column.apps' }),
        dataIndex: 'Apps',
        render: (apps = []) => {
          return (
            <>
              <Tooltip
                trigger={'click'}
                color={'#ffffff'}
                overlayStyle={{ width: 180 }}
                title={
                  <div>
                    <div className={styles.tipHeader}>
                      {intl.formatMessage({ id: 'pages.task.management.app.list' })}
                    </div>
                    <div className={styles.tipContent}>
                      {(apps || []).map((i) => {
                        return (
                          <div onClick={() => {}} className={styles.tipAppName} key={i.AppId}>
                            <Tag color="processing">{i.AppName}</Tag>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                }
              >
                <Button size="small">{apps.length}Apps...</Button>
              </Tooltip>
            </>
          )
        },
      },
      {
        title: intl.formatMessage({ id: 'pages.task.management.column.operations' }),
        dataIndex: 'TaskId',
        render: (taskId, item) => {
          return (
            <>
              {/* <a>运行</a> */}
              <a
                onClick={() => {
                  this.handleEditTask(item)
                }}
                style={{ margin: '0 10px' }}
              >
                {intl.formatMessage({ id: 'component.button.edit' })}
              </a>
              <a
                onClick={() => {
                  this.handleTableAction('del', taskId)
                }}
                style={{ color: 'red' }}
              >
                {intl.formatMessage({ id: 'component.button.delete' })}
              </a>
            </>
          )
        },
      },
    ]

    return columns
  }

  onExpand = (expand, record) => {
    const { TaskId } = record

    if (expand) {
      this.fetchTaskInstances(TaskId)
    }
  }

  getExpand = (record) => {
    const { TaskId } = record
    const { taskMap = {} } = this.state
    const { intl } = this.props

    const taskStatusMap = {
      Running: intl.formatMessage({ id: 'pages.task.management.task.running' }),
      Finished: intl.formatMessage({ id: 'pages.task.management.task.completed' }),
      Stopped: intl.formatMessage({ id: 'pages.task.management.task.stopped' }),
      Pending: intl.formatMessage({ id: 'pages.task.management.task.pending' }),
    }

    const rowSelection = {
      selectedRowKeys: (taskMap[TaskId] && taskMap[TaskId].selectedRowKeys) || [],
      onChange: (selectedRowKeys = []) => {
        taskMap[TaskId].selectedRowKeys = selectedRowKeys
        this.setState({
          taskMap,
        })
      },
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
        render: (taskRunId, item) => {
          return (
            <Space>
              {item.Status === 'Stopped' ? (
                <a
                  onClick={() => {
                    this.handleSubTableAction('run', taskRunId, item.TaskId)
                  }}
                >
                  {intl.formatMessage({ id: 'pages.task.management.button.startup' })}
                </a>
              ) : null}
              {item.Status === 'Running' ? (
                <a
                  onClick={() => {
                    this.handleSubTableAction('stop', taskRunId, item.TaskId)
                  }}
                >
                  {intl.formatMessage({ id: 'pages.task.management.button.stop' })}
                </a>
              ) : null}
              {item.Status !== 'Running' ? (
                <a
                  onClick={() => {
                    this.handleSubTableAction('del', taskRunId, item.TaskId)
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

    return (
      <div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={(taskMap[TaskId] && taskMap[TaskId].taskRunList) || []}
          rowKey={(row) => row.TaskRunId}
          pagination={false}
        />
        <div className={styles.tableFooter}>
          <div>
            <a
              onClick={() => {
                this.handleSubTableAction('run', null, TaskId)
              }}
            >
              {intl.formatMessage({ id: 'pages.task.management.button.startup' })}
            </a>
            <a
              onClick={() => {
                this.handleSubTableAction('stop', null, TaskId)
              }}
              style={{ margin: '0 5px' }}
            >
              {intl.formatMessage({ id: 'pages.task.management.button.stop' })}
            </a>
            <a
              style={{ color: 'red' }}
              onClick={() => {
                this.handleSubTableAction('del', null, TaskId)
              }}
            >
              {intl.formatMessage({ id: 'component.button.delete' })}
            </a>
          </div>
          <Pagination
            showQuickJumper
            current={taskMap[TaskId] && taskMap[TaskId].pageNum}
            pageSize={10}
            total={taskMap[TaskId] && taskMap[TaskId].totalNum}
            onChange={(page) => {
              taskMap[TaskId].pageNum = page
              this.setState(
                {
                  taskMap,
                },
                () => {
                  this.fetchTaskInstances(TaskId)
                },
              )
            }}
          />
        </div>
      </div>
    )
  }

  fetchTaskInstances = (taskId) => {
    const { taskMap = {} } = this.state
    const { intl } = this.props
    if (!taskMap[taskId]) {
      taskMap[taskId] = {} // 初始化
    }
    const { pageNum } = taskMap[taskId] || {}

    const queryData = {
      PageSize: 10,
      PageNum: pageNum,
      Search: '',
      TaskId: taskId,
    }

    return getListTaskRuns(queryData)
      .then((res) => {
        console.log(res)
        this.setState({
          loading: false,
        })
        if (res.Code === 'Succeed') {
          const { TaskRuns = [], Total } = res.Data || {}

          taskMap[taskId].taskRunList = TaskRuns
          taskMap[taskId].totalNum = Total

          this.setState({
            taskMap,
          })
        } else {
          message.error(intl.formatMessage({ id: 'pages.task.management.get.data.fail' }))
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }

  handleSubTableAction = (type, taskRunId, taskId) => {
    // 有taskId表示单个操作
    const { selectedRowKeys } = this.state.taskMap[taskId] || {}
    const TaskRunIds = taskRunId ? [taskRunId] : selectedRowKeys
    const { intl } = this.props

    if (!TaskRunIds.length) {
      message.warning(intl.formatMessage({ id: 'pages.task.management.task.instance.required' }))
      return
    }

    let fetchApi
    if (type === 'del') {
      fetchApi = deleteTaskRuns
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
          this.fetchTaskInstances(taskId)
        } else {
          message.error(intl.formatMessage({ id: 'pages.task.management.action.fail' }))
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }

  render() {
    const { pageNum, totalNum, selectedRowKeys, taskList: taskListData } = this.state
    const { intl, theme } = this.props

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }

    const expandable = {
      expandedRowRender: (record) => this.getExpand(record),
      onExpand: (expand, record) => this.onExpand(expand, record),
      expandIcon: ({ expanded, onExpand, record }) =>
        expanded ? (
          <img src={arrowDown} onClick={(e) => onExpand(record, e)} style={{ width: 14 }} />
        ) : (
          <img src={theme === 'dark' ? arrowRightWhite : arrowRight} onClick={(e) => onExpand(record, e)} style={{ width: 14 }} />
        ),
    }

    return (
      <>
        <Spin spinning={this.state.loading} tip="Loading">
          <div className={styles.searchArea}>
            <Select
              value={this.state.taskType}
              style={{ width: 130, marginRight: 16 }}
              onChange={(val) => {
                this.setState({
                  taskType: val,
                })
              }}
            >
              <Option value="all">{intl.formatMessage({ id: 'pages.task.management.all' })}</Option>
              <Option value="Adhoc">
                {intl.formatMessage({ id: 'pages.task.management.trigger.mode' })}
              </Option>
              <Option value="Periodic">
                {intl.formatMessage({ id: 'pages.task.management.periodic' })}
              </Option>
            </Select>
            <Search
              placeholder={intl.formatMessage({ id: 'pages.task.management.task.search' })}
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
            dataSource={taskListData}
            rowKey={(record) => record.TaskId}
            pagination={false}
            expandable={expandable}
          />
          <div className={styles.tableFooter}>
            <div>
              <Button
                onClick={() => {
                  this.handleTableAction('del')
                }}
              >
                {intl.formatMessage({ id: 'component.button.delete' })}
              </Button>
            </div>
            <Pagination
              showQuickJumper
              showSizeChanger
              current={pageNum}
              total={totalNum}
              pageSizeOptions={[10, 20]}
              onChange={(page, pageSize) => {
                this.setState(
                  {
                    pageNum: page,
                    pageSize,
                  },
                  () => {
                    this.getTableData()
                  },
                )
              }}
            />
          </div>
        </Spin>
        {this.state.drawVisible ? (
          <TaskEdit
            taskId={this.state.taskId}
            onClose={() => {
              this.setState({
                drawVisible: false,
              })
            }}
          />
        ) : null}
      </>
    )
  }
}

export default injectIntl(TableTask)
