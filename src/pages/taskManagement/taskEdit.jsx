import React from 'react'
import { Button, Drawer, Input, Radio, Select, Slider, message } from 'antd'
import { createTask, getTaskDetails, modifyTask } from '@/services/task'
import { getApps } from '@/services/assets'
import styles from './index.less'
import { injectIntl } from 'umi'

const { TextArea } = Input

const TASK_POLICY_OPTION = [
  {
    name: 'OWASP Top 10',
    value: 1,
  },
]

class TaskEdit extends React.Component {
  state = {
    taskName: '',
    taskDesc: '',
    taskPolicy: 1,
    taskType: 'Adhoc',
    taskSchedue: 'Cron',
    scheduleValue: '',
    taskAppList: [],
    taskQps: 0,
    taskRunQps: 0,
    apps: [],
    hasMore: true,
    pageNum: 1,
    pageSize: 10,
    total: 0,
  }

  get isPeriodic() {
    return this.state.taskType === 'Periodic'
  }

  componentDidMount() {
    this.fetchData(({ Data: { Apps, Total } }) => this.setState({ apps: Apps, total: Total }))
    if (this.props.taskId) {
      this.getTaskDetail()
    }
  }

  getTaskDetail = () => {
    getTaskDetails({
      TaskId: this.props.taskId,
    }).then((res) => {
      console.log(res)
      if (res.Code === 'Succeed') {
        const { Name, Description, Type, Policy = {}, Apps = [], Settings = {} } = res.Data || {}
        const { QPSTask, QPSTaskRun, ScheduleType, ScheduleValue } = Settings

        this.setState({
          taskName: Name,
          taskDesc: Description,
          taskPolicy: Policy.PolicyId,
          taskType: Type,
          taskAppList: Apps.map((i) => i.AppId),
          taskQps: QPSTask,
          taskRunQps: QPSTaskRun,

          taskSchedue: ScheduleType,
          scheduleValue: ScheduleValue,
        })
      }
    })
  }

  fetchData = async (cb) => {
    const { pageNum, pageSize } = this.state
    const res = await getApps({
      PageNum: pageNum,
      PageSize: pageSize,
    })

    cb(res)
  }

  saveTask = () => {
    let saveApi = createTask
    const {
      taskName,
      taskDesc,
      taskPolicy,
      taskSchedue,
      scheduleValue,
      taskType,
      taskAppList,
      taskQps,
      taskRunQps,
    } = this.state
    const { intl } = this.props

    const policy = TASK_POLICY_OPTION.filter((i) => i.value === taskPolicy).map((j) => {
      return {
        PolicyId: Number(j.value),
        PolicyName: j.name,
      }
    })

    const chooseApps = this.state.apps
      .filter((i) => taskAppList.includes(i.AppId))
      .map((j) => {
        return {
          AppId: j.AppId,
          AppName: j.Name,
        }
      })

    let postData = {
      Name: taskName,
      Description: taskDesc,
      Policy: policy[0] || {},
      Type: taskType,
      Apps: chooseApps,
      Settings: {
        QPSTaskRun: taskRunQps,
        QPSTask: taskQps,
        ScheduleType: taskSchedue,
        ScheduleValue: scheduleValue,
      },
    }

    if (this.props.taskId) {
      // 编辑保存
      saveApi = modifyTask
      postData = {
        TaskId: this.props.taskId,
        ...postData,
      }
    }

    saveApi(postData)
      .then((res) => {
        console.log(res)
        if (res.Code === 'Succeed') {
          message.success(
            this.props.taskId
              ? intl.formatMessage({ id: 'pages.task.management.save.success' })
              : intl.formatMessage({ id: 'pages.task.management.create.success' }),
          )
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        } else {
          message.error(
            this.props.taskId
              ? intl.formatMessage({ id: 'pages.task.management.save.fail' })
              : intl.formatMessage({ id: 'pages.task.management.create.fail' }),
          )
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }

  loadMore = () => {
    const { apps, total } = this.state

    if (apps.length >= total) {
      return this.setState({
        hasMore: false,
      })
    }
    this.fetchData(({ Data: { Apps, Total } }) => {
      this.setState({
        apps: apps.concat(Apps),
        total: Total,
      })
    })
  }

  // 滚动加载
  onOptionsScroll = (e) => {
    const { hasMore, pageNum } = this.state
    if (!hasMore) return

    const { scrollHeight, scrollTop, clientHeight } = e.target
    const condition = scrollHeight - scrollTop <= clientHeight

    if (condition) {
      this.setState(
        {
          pageNum: pageNum + 1,
        },
        () => this.loadMore(),
      )
    }
  }

  render() {
    const { intl } = this.props
    const TASK_TYPE_OPTION = [
      {
        name: intl.formatMessage({ id: 'pages.task.management.trigger.task' }),
        value: 'Adhoc',
      },
      {
        name: intl.formatMessage({ id: 'pages.task.management.periodic.task' }),
        value: 'Periodic',
      },
    ]
    const planningTask = intl.formatMessage({ id: 'pages.task.management.planning.task' })
    const TASK_SCHEDUE_OPTION = [
      {
        name: `${planningTask} (CRON)`,
        value: 'Cron',
      },
    ]

    return (
      <>
        <Drawer
          title={
            this.props.taskId
              ? intl.formatMessage({ id: 'pages.task.management.edit.task' })
              : intl.formatMessage({ id: 'pages.task.management.create.task' })
          }
          placement="right"
          closable={false}
          onClose={() => {
            this.props.onClose()
          }}
          visible={true}
          width={400}
          bodyStyle={{ padding: '24px 32px' }}
          headerStyle={{ padding: '24px 32px' }}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button
                onClick={() => {
                  this.saveTask()
                }}
                type="primary"
                style={{ marginRight: 8 }}
              >
                {this.props.taskId
                  ? intl.formatMessage({ id: 'component.button.save' })
                  : intl.formatMessage({ id: 'component.button.create' })}
              </Button>
              <Button
                onClick={() => {
                  this.props.onClose()
                }}
              >
                {intl.formatMessage({ id: 'component.button.cancel' })}
              </Button>
            </div>
          }
        >
          <div className={styles.appCreateItem}>
            <label>{intl.formatMessage({ id: 'pages.task.management.task.name' })}</label>
            <br />
            <Input
              value={this.state.taskName}
              onChange={(e) => {
                this.setState({
                  taskName: e.target.value,
                })
              }}
            />
          </div>
          <div className={styles.appCreateItem}>
            <label>{intl.formatMessage({ id: 'pages.task.management.task.description' })}</label>
            <br />
            <TextArea
              rows={4}
              value={this.state.taskDesc}
              onChange={(e) => {
                this.setState({
                  taskDesc: e.target.value,
                })
              }}
            />
          </div>
          <div className={styles.appCreateItem}>
            <label>{intl.formatMessage({ id: 'pages.task.management.test.strategy' })}</label>
            <br />
            <Select
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
              value={this.state.taskPolicy}
              onChange={(val) => {
                this.setState({
                  taskPolicy: val,
                })
              }}
            >
              {TASK_POLICY_OPTION.map((i) => (
                <Select.Option key={i.value} value={i.value}>
                  {i.name}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className={styles.appCreateItem}>
            <label>{intl.formatMessage({ id: 'pages.task.management.task.type' })}</label>
            <br />
            <Radio.Group
              value={this.state.taskType}
              onChange={(e) => {
                this.setState({
                  taskType: e.target.value,
                })
              }}
              style={{ marginBottom: 16 }}
            >
              {TASK_TYPE_OPTION.map((i) => (
                <Radio.Button key={i.value} value={i.value}>
                  {i.name}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>
          {this.isPeriodic ? (
            <>
              <div className={styles.appCreateItem}>
                <label>
                  {intl.formatMessage({ id: 'pages.task.management.schedule.strategy' })}
                </label>
                <br />
                <Select
                  allowClear
                  style={{ width: '100%' }}
                  placeholder={intl.formatMessage({
                    id: 'pages.task.management.select.schedule.strategy',
                  })}
                  defaultValue={this.state.taskSchedue}
                  onChange={(val) => {
                    this.setState({
                      taskSchedue: val,
                    })
                  }}
                >
                  {TASK_SCHEDUE_OPTION.map((i) => (
                    <Select.Option key={i.value}>{i.name}</Select.Option>
                  ))}
                </Select>
              </div>

              <div className={styles.appCreateItem}>
                <label>
                  {intl.formatMessage({ id: 'pages.task.management.schedule.expression' })}
                </label>
                <br />
                <Input
                  value={this.state.scheduleValue}
                  placeholder={intl.formatMessage({
                    id: 'pages.task.management.input.schedule.expression',
                  })}
                  onChange={(e) => {
                    this.setState({
                      scheduleValue: e.target.value,
                    })
                  }}
                />
              </div>
            </>
          ) : null}
          <div className={styles.appCreateItem}>
            <label>
              {intl.formatMessage({ id: 'pages.task.management.detection.application' })}
            </label>
            <br />
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
              value={this.state.taskAppList}
              onPopupScroll={this.onOptionsScroll}
              onChange={(val) => {
                this.setState({
                  taskAppList: val,
                })
              }}
            >
              {this.state.apps.map((i) => (
                <Select.Option key={i.AppId} value={i.AppId}>
                  {i.Name}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className={styles.appCreateItem}>
            <label>{intl.formatMessage({ id: 'pages.task.management.advanced.options' })}</label>
            <br />
            <div>
              <div>{intl.formatMessage({ id: 'pages.task.management.QPS.limit.test.case' })}</div>
              <Slider
                value={this.state.taskRunQps}
                onChange={(val) => {
                  this.setState({
                    taskRunQps: val,
                  })
                }}
              />
            </div>
            <div>
              <div>{intl.formatMessage({ id: 'pages.task.management.QPS.limit.test.app' })}</div>
              <Slider
                value={this.state.taskQps}
                onChange={(val) => {
                  this.setState({
                    taskQps: val,
                  })
                }}
              />
            </div>
          </div>
        </Drawer>
      </>
    )
  }
}

export default injectIntl(TaskEdit)
