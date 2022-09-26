import React from 'react'
import ProCard from '@ant-design/pro-card'
import { Heatmap } from '@ant-design/charts'
import { Row, Col } from 'antd'
import { connect, history, useSelector } from 'umi'
import styles from './RequestTrends.less'
import TopIPs from '@/components/Common/topHost.jsx'
import { getTimeDistance } from '@/utils/utils'
import moment from 'moment'

const ActionHeat = ({ data = [] }) => {
  const theme = useSelector(({ global }) => global.theme)
  const config = {
    data,
    appendPadding: [0, 20, 0, 0],
    xField: 'Hour',
    yField: 'Date',
    colorField: 'Count',
    meta: {
      Hour: {
        alias: '小时',
        type: 'cat',
      },
      Count: {
        sync: true,
        alias: '数量',
      },
      Date: {
        type: 'cat',
        alias: '日期',
      },
    },
    tooltip: {
      title: false,
      showMarkers: false,
      fields: ['Count', 'Hour', 'Date'],
      customContent: (_, payload) => {
        const params = payload[0] || {}
        const { color, data: value = {} } = params
        const { Count, Date: date, Hour } = value

        return (
          <div style={{ padding: '10px 8px' }}>
            <div style={{ marginBottom: 12 }}>
              <span style={{ marginRight: 16 }}>{date}</span>
              <span>{Hour}</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: color,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    marginRight: 10,
                  }}
                ></span>
                <span>数量：</span>
              </div>
              <span>{Count}</span>
            </div>
          </div>
        )
      },
    },
    heatmapStyle: (item = {}) => {
      const fill = theme === 'dark' ? '#1d1d42' : '#fff'
      const stroke = theme === 'dark' ? '#101023' : '#fff'
      const style =
        item.Count === 0
          ? {
              stroke: stroke,
              fill: fill,
            }
          : {
              stroke: stroke,
            }

      return style
    },
    interactions: [{ type: 'element-active' }],
    state: {
      active: {
        animate: { duration: 100, easing: 'easeLinear' },
        style: {
          lineWidth: 1,
          stroke: '#000',
        },
      },
    },
  }

  return <Heatmap {...config} />
}

@connect(({ ipPortrait }) => ({
  trends: ipPortrait.trends,
  topList: ipPortrait.topList,
}))
export default class RequestTrends extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabKey: 'trend',
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
    const { Ip } = history.location.query

    if (dispatch) {
      dispatch({
        type: 'ipPortrait/getTrends',
        payload: {
          Ip,
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
    const { Ip } = history.location.query

    if (dispatch) {
      dispatch({
        type: 'ipPortrait/getTopList',
        payload: {
          Ip,
          Count: count,
        },
      })
    }
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
        }}
        className={styles.trendCard}
      >
        <ProCard.TabPane key="trend" tab="行为日历">
          <Row gutter={24}>
            <Col xl={16} lg={16} md={12} sm={24} xs={24}>
              <div className={styles.trendBar}>
                <ActionHeat data={trends} />
              </div>
            </Col>
            <Col xl={8} lg={8} md={12} sm={24} xs={24}>
              <TopIPs title="TOP 受访资产" topListData={topList} hostName="Key" value="Count" />
            </Col>
          </Row>
        </ProCard.TabPane>
      </ProCard>
    )
  }
}
