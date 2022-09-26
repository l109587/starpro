import React from 'react'
import ProCard from '@ant-design/pro-card'
import { Column } from '@ant-design/charts'
import { Row, Col } from 'antd'
import { connect, history } from 'umi'
import styles from './TrafficTrends.less'
import TopIPs from '@/components/Common/topHost.jsx'
import { getTimeDistance } from '@/utils/utils'
import numeral from 'numeral'
import moment from 'moment'

const TrendColumn = ({ data = [] }) => {
  const config = {
    data,
    maxColumnWidth: 120,
    appendPadding: [0, 20, 0, 0],
    yField: 'Count',
    xField: 'Time',
    seriesField: 'Time',
    label: {
      position: 'middle',
    },
    legend: false,
    xAxis: {
      label: {
        style: {
          fontSize: 12,
        },
      },
    },
    yAxis: {
      label: {
        formatter: (v) => numeral(v).format('0,0'),
      },
      grid: {
        line: {
          style: {
            lineWidth: 1,
            stroke: '#555',
            lineDash: [4, 5],
            strokeOpacity: 0.5,
          },
        },
      },
    },
    tooltip: {
      formatter: ({ Count }) => {
        return {
          name: '请求量',
          value: Count,
        }
      },
    },
  }
  return <Column {...config} />
}

@connect(({ apiPortrait }) => ({
  trends: apiPortrait.trends,
  topList: apiPortrait.topList,
}))
export default class TrafficTrends extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabKey: 'trend',
      currentDate: 'week',
    }
  }

  componentDidMount() {
    const range = getTimeDistance('week')
    this.getTrends(
      moment(range[0]).format('YYYY-MM-DDTHH:mm:ss'),
      moment(range[1]).format('YYYY-MM-DDTHH:mm:ss'),
      7,
    )
    this.getTopList(10)
  }

  // 获取访问趋势
  getTrends = (from, to, count) => {
    const { dispatch } = this.props
    const { Api } = history.location.query

    if (dispatch) {
      dispatch({
        type: 'apiPortrait/getTrends',
        payload: {
          Api,
          StartTime: from,
          EndTime: to,
          Count: count,
        },
      })
    }
  }

  // 获取Top访问IP
  getTopList = (count = 10) => {
    const { dispatch } = this.props
    const { Api } = history.location.query

    if (dispatch) {
      dispatch({
        type: 'apiPortrait/getTopList',
        payload: {
          Api,
          Count: count,
        },
      })
    }
  }

  // 切换时间段
  selectDate = (currentDate) => {
    if (currentDate === this.state.currentDate) return
    this.setState({
      currentDate,
    })

    let count = 7
    if (currentDate === 'month') count = 10

    const range = getTimeDistance(currentDate)
    this.getTrends(
      moment(range[0]).format('YYYY-MM-DDTHH:mm:ss'),
      moment(range[1]).format('YYYY-MM-DDTHH:mm:ss'),
      count,
    )
    this.getTopList(10)
  }

  // render Tab右上角切换时间段部分
  renderRightOperation = () => {
    const { currentDate } = this.state

    return (
      <div className={styles.trendExtraWrap}>
        <div className={styles.trendExtra}>
          <span
            className={currentDate === 'week' ? styles.currentDate : ''}
            onClick={() => this.selectDate('week')}
          >
            7天
          </span>
          <span
            className={currentDate === 'month' ? styles.currentDate : ''}
            onClick={() => this.selectDate('month')}
          >
            30天
          </span>
        </div>
      </div>
    )
  }

  render() {
    const { trends = [], topList = [] } = this.props
    const { tabKey } = this.state

    return (
      <ProCard
        tabs={{
          activeKey: tabKey,
          onChange: (key) => {
            this.setState({
              tabKey: key,
            })
          },
          tabBarExtraContent: this.renderRightOperation(),
        }}
        className={styles.trendCard}
      >
        <ProCard.TabPane key="trend" tab="访问趋势">
          <Row>
            <Col xl={16} lg={16} md={12} sm={24} xs={24}>
              <div className={styles.trendBar}>
                <TrendColumn data={trends} />
              </div>
            </Col>
            <Col xl={8} lg={8} md={12} sm={24} xs={24}>
              <TopIPs title="TOP 访问 IP" topListData={topList} hostName="Key" value="Count" />
            </Col>
          </Row>
        </ProCard.TabPane>
      </ProCard>
    )
  }
}
