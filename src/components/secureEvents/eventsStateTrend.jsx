import React from 'react'
import ProCard from '@ant-design/pro-card'
import { TinyLine } from '@ant-design/charts'
import { ArrowUpOutlined } from '@ant-design/icons'
import { connect, injectIntl } from 'umi'
import styles from './eventsStateTrend.less'
import { getTimeDistance, fillStart } from '@/utils/utils'
import numeral from 'numeral'
import { Tooltip } from 'antd'
import moment from 'moment'

const TinyChart = ({ data, color }) => {
  const config = {
    data: fillStart(data),
    color,
    height: 50,
    autoFit: true,
    smooth: false,
    padding: [0, 0, 0, 0],
  }
  return <TinyLine {...config} />
}

@connect(({ secure_events }) => ({
  eventsStateData: secure_events.eventsStateData,
}))
class EventsStateTrend extends React.Component {
  componentDidMount() {
    const timeRange = getTimeDistance('month')
    const { dispatch } = this.props
    if (dispatch) {
      dispatch({
        type: 'secure_events/getEventsStateTrend',
        payload: {
          Count: 15,
          StartTime: moment(timeRange[0]).format('YYYY-MM-DDTHH:mm:ss'),
          EndTime: moment(timeRange[1]).format('YYYY-MM-DDTHH:mm:ss'),
        },
      })
    }
  }

  render() {
    const { eventsStateData = {}, intl } = this.props
    const { high = {}, unDisposed = {}, disposed = {}, medium = {} } = eventsStateData
    const statList = [
      {
        title: intl.formatMessage({ id: 'pages.events.chart.undisposed' }),
        total: unDisposed.Total,
        increased: unDisposed.Increased,
        chart: <TinyChart data={unDisposed.Trends} color="#A35CF1" />,
        color: '#A35CF1',
      },
      {
        title: intl.formatMessage({ id: 'pages.events.chart.high' }),
        total: high.Total,
        increased: high.Increased,
        chart: <TinyChart data={high.Trends} color="#FF244C" />,
        color: '#FF244C',
      },
      {
        title: intl.formatMessage({ id: 'pages.events.chart.medium' }),
        total: medium.Total,
        increased: medium.Increased,
        chart: <TinyChart data={medium.Trends} color="#FF862E" />,
        color: '#FF862E',
      },
      // {
      //   title: intl.formatMessage({ id: 'pages.events.chart.disposed' }),
      //   total: disposed.Total,
      //   increased: disposed.Increased,
      //   chart: <TinyChart data={disposed.Trends} color="#00CD00" />,
      //   color: '#00CD00',
      // },
    ]

    return (
      <ProCard gutter={24} ghost={true} style={{ width: '100%', marginBottom: '24px' }}>
        {statList.map(({ title, total, increased, chart, color }) => {
          return (
            <ProCard key={title} title={title} colSpan={8} bodyStyle={{ paddingTop: 12 }}>
              <div className={styles.increasedWrapper}>
                <Tooltip title="日新增">
                  <span>
                    +{numeral(increased).format('0,0')} <ArrowUpOutlined />
                  </span>
                </Tooltip>
              </div>
              <div className={styles.content}>
                <div className={styles.totalWrapper} style={{ color: color }}>
                  {numeral(total).format('0,0')}
                </div>
                <div className={styles.chartWrapper}>{chart}</div>
              </div>
            </ProCard>
          )
        })}
      </ProCard>
    )
  }
}

export default injectIntl(EventsStateTrend)
