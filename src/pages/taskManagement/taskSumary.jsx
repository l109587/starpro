import React from 'react'
import { Area } from '@ant-design/charts'
import { ClockCircleOutlined, FundOutlined } from '@ant-design/icons'
import { getTaskRunTrends, getTasksStat, getTaskRunsStat } from '@/services/task'
import moment from 'moment'
import styles from './index.less'
import { injectIntl } from 'umi'

class TaskSumary extends React.Component {
  state = {
    taskRunState: {},
    taskState: {},
    taskChartData: [],
  }

  get taskConfig() {
    return {
      data: this.state.taskChartData,
      xField: 'Time',
      yField: 'Value',
      xAxis: { tickCount: 5 },
      areaStyle: function areaStyle() {
        return { fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff' }
      },
    }
  }

  componentDidMount() {
    this.getSumaryData()
  }

  getSumaryData = () => {
    const requestList = [
      getTaskRunTrends({
        StartTime: moment().subtract(10, 'day').format('YYYY-MM-DDTHH:mm:ss'),
        EndTime: moment().format('YYYY-MM-DDTHH:mm:ss'),
        Count: 10,
      }),
      getTasksStat(),
      getTaskRunsStat(),
    ]

    Promise.all(requestList)
      .then((res) => {
        const taskRunStateMap = (res && res[2] && res[2].Data) || {}
        const taskStateMap = (res && res[1] && res[1].Data) || {}
        const { Trends: taskChartData = [], Total } = (res && res[0] && res[0].Data) || {}
        taskChartData.forEach((e) => {
          e.Time = moment(e.Time).format('YYYY-MM-DD')
        })

        const taskRunStateCopy = {
          ...taskRunStateMap,
          total:
            taskRunStateMap.Running +
            taskRunStateMap.Stopped +
            taskRunStateMap.Finished +
            taskRunStateMap.Pending,
        }
        const taskStateCopy = {
          ...taskStateMap,
          total: taskStateMap.Adhoc + taskStateMap.Periodic,
        }
        this.setState({
          taskRunState: taskRunStateCopy,
          taskState: taskStateCopy,
          taskChartData: taskChartData,
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }

  render() {
    const { taskRunState, taskState } = this.state
    const { intl } = this.props

    return (
      <>
        <div className={styles.taskSumary}>
          <div style={{ flex: 1 }}>
            <div className={styles.tabTitle}>
              {intl.formatMessage({ id: 'pages.task.management.instance.trend' })}
            </div>
            <Area {...this.taskConfig} />
          </div>
          <div className={styles.taskTotal}>
            <div className={styles.taskItemWrap}>
              <div className={styles.taskTotalHead}>
                {intl.formatMessage({ id: 'pages.task.management.task' })}
              </div>
              <div className={styles.taskTotalItem}>
                <div>
                  <FundOutlined />
                  <label className={styles.taskTotalLabel}>
                    {intl.formatMessage({ id: 'pages.task.management.trigger.mode' })}
                  </label>
                </div>
                <span>{taskState.Adhoc}</span>
              </div>
              <div className={styles.taskTotalItem}>
                <div>
                  <ClockCircleOutlined />
                  <label className={styles.taskTotalLabel}>
                    {intl.formatMessage({ id: 'pages.task.management.periodic' })}
                  </label>
                </div>
                <span>{taskState.Periodic}</span>
              </div>
              <div className={styles.totalNumItem}>
                <span>{intl.formatMessage({ id: 'pages.task.management.total' })}</span>
                <span>{taskState.total}</span>
              </div>
            </div>
            <div className={styles.taskItemWrap}>
              <div className={styles.taskTotalHead}>
                {intl.formatMessage({ id: 'pages.task.management.task.instance' })}
              </div>
              <div className={styles.taskTotalItem}>
                <div>
                  <span className={styles.dot} style={{ backgroundColor: 'green' }}></span>
                  <span>{intl.formatMessage({ id: 'pages.task.management.task.running' })}</span>
                </div>
                <span style={{ color: 'green' }}>{taskRunState.Running}</span>
              </div>
              <div className={styles.taskTotalItem}>
                <div>
                  <span className={styles.dot} style={{ backgroundColor: 'red' }}></span>
                  <span>{intl.formatMessage({ id: 'pages.task.management.task.stopped' })}</span>
                </div>
                <span style={{ color: 'red' }}>{taskRunState.Stopped}</span>
              </div>
              <div className={styles.taskTotalItem}>
                <div>
                  <span className={styles.dot} style={{ backgroundColor: 'orange' }}></span>
                  <span>{intl.formatMessage({ id: 'pages.task.management.task.pending' })}</span>
                </div>
                <span style={{ color: 'orange' }}>{taskRunState.Pending}</span>
              </div>
              <div className={styles.taskTotalItem}>
                <div>
                  <span className={styles.dot} style={{ backgroundColor: 'grey' }}></span>
                  <span>{intl.formatMessage({ id: 'pages.task.management.task.completed' })}</span>
                </div>
                <span style={{ color: 'grey' }}>{taskRunState.Finished}</span>
              </div>
              <div className={styles.totalNumItem}>
                <span>{intl.formatMessage({ id: 'pages.task.management.total' })}</span>
                <span style={{ color: '#1890ff', fontWeight: 500 }}>{taskRunState.total}</span>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default injectIntl(TaskSumary)
