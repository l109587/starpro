import React from 'react'
import ProCard from '@ant-design/pro-card'
import { Column, Line } from '@ant-design/charts'
import { Row, Col } from 'antd'
import { connect, getIntl, injectIntl, useSelector } from 'umi'
import styles from './trendTabs.less'
import TopHosts from '@/components/Common/topHost.jsx'
import { getTimeDistance } from '@/utils/utils'
import numeral from 'numeral'
import moment from 'moment'

const getThreatLevelName = (type) => {
  const intl = getIntl()
  let name = intl.formatMessage({ id: 'pages.events.risk.info' })

  switch (type) {
    case 'High':
      name = intl.formatMessage({ id: 'pages.events.risk.high' })
      break
    case 'Medium':
      name = intl.formatMessage({ id: 'pages.events.risk.medium' })
      break
    case 'Low':
      name = intl.formatMessage({ id: 'pages.events.risk.low' })
      break
  }
  return name
}

const DisposedTrendColumn = (props) => {
  const theme = useSelector(({ global }) => global.theme)
  const intl = getIntl()
  const { data = [] } = props
  const textColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)'
  const config = {
    data: data instanceof Array ? data : [],
    maxColumnWidth: 120,
    isGroup: true,
    xField: 'Time',
    yField: 'Value',
    seriesField: 'Key',
    xAxis: {
      line: null,
      tickLine: null,
      label: {
        style: {
          fontSize: 12,
          fontWeight: 'bold',
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
    label: {
      position: 'middle',
      layout: [
        { type: 'interval-adjust-position' },
        { type: 'interval-hide-overlap' },
        { type: 'adjust-color' },
      ],
      content: function content() {
        return ''
      },
    },
    legend: {
      position: 'top',
      itemName: {
        formatter: function formatter(text, item) {
          return item.value === 'Total'
            ? intl.formatMessage({ id: 'pages.events.chart.total' })
            : intl.formatMessage({ id: 'pages.events.chart.disposal.trend' })
        },
        style: {
          fill: textColor,
        },
      },
    },
    color: function color(_ref) {
      const type = _ref.Key
      if (type === 'Total') {
        return '#1890FF'
      }
      return '#C2E2FF'
    },
    tooltip: {
      formatter: (value) => {
        const name =
          value.Key === 'Total'
            ? intl.formatMessage({ id: 'pages.events.chart.total' })
            : intl.formatMessage({ id: 'pages.events.chart.disposal.trend' })
        return {
          name: name,
          value: value.Value,
        }
      },
    },
  }

  return <Column {...config} />
}

const ThreatTrendLine = (props) => {
  const theme = useSelector(({ global }) => global.theme)
  const { data = [] } = props
  const textColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)'
  const config = {
    data: data instanceof Array ? data : [],
    xField: 'Time',
    yField: 'Value',
    seriesField: 'Key',
    scrollbar: { type: 'horizontal' },
    xAxis: {
      line: null,
      tickLine: null,
      label: {
        style: {
          fontSize: 12,
          fontWeight: 'bold',
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
      formatter: function formatter(value) {
        const type = value.Key
        const name = getThreatLevelName(type)
        return {
          name,
          value: value.Value,
        }
      },
    },
    legend: {
      position: 'top',
      itemName: {
        formatter: function formatter(text, item) {
          const type = item.value
          const name = getThreatLevelName(type)
          return name
        },
        style: {
          fill: textColor,
        },
      },
    },
    color: function color(_ref) {
      const type = _ref.Key
      let colour = 'rgb(97, 221, 170)'

      switch (type) {
        case 'High':
          colour = 'red'
          break
        case 'Medium':
          colour = 'yellow'
          break
        case 'Low':
          colour = '#5B8FF9'
          break
      }
      return colour
    },
  }

  return <Line {...config} />
}

@connect(({ secure_events }) => ({
  threatTrendData: secure_events.threatTrendData,
  disposedTrendData: secure_events.disposedTrendData,
  topListData: secure_events.topListData,
}))
class TrendTabs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabKey: 'DisposedTrend',
      currentDate: 'week',
    }
  }

  componentDidMount() {
    const range = getTimeDistance('week')
    this.getTrendsData(
      moment(range[0]).format('YYYY-MM-DDTHH:mm:ss'),
      moment(range[1]).format('YYYY-MM-DDTHH:mm:ss'),
      7,
      'DisposedTrend',
    )
    this.getTrendsData(
      moment(range[0]).format('YYYY-MM-DDTHH:mm:ss'),
      moment(range[1]).format('YYYY-MM-DDTHH:mm:ss'),
      7,
      'ThreatTrend',
    )
    this.getTopListData(
      moment(range[0]).format('YYYY-MM-DDTHH:mm:ss'),
      moment(range[1]).format('YYYY-MM-DDTHH:mm:ss'),
      10,
    )
  }

  // 获取处置趋势、威胁趋势图表Data
  getTrendsData = (from, to, count, stat) => {
    const { dispatch } = this.props
    if (dispatch) {
      dispatch({
        type: 'secure_events/getTrendsData',
        payload: {
          StartTime: from,
          EndTime: to,
          Count: count,
          Stat: stat,
        },
      })
    }
  }

  // 获取Top资产Data
  getTopListData = (from, to, count = 10) => {
    const { dispatch } = this.props
    if (dispatch) {
      dispatch({
        type: 'secure_events/getTopListData',
        payload: {
          StartTime: from,
          EndTime: to,
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
    if (currentDate === 'month') {
      count = 10
    }
    const range = getTimeDistance(currentDate)
    this.getTrendsData(
      moment(range[0]).format('YYYY-MM-DDTHH:mm:ss'),
      moment(range[1]).format('YYYY-MM-DDTHH:mm:ss'),
      count,
      'DisposedTrend',
    )
    this.getTrendsData(
      moment(range[0]).format('YYYY-MM-DDTHH:mm:ss'),
      moment(range[1]).format('YYYY-MM-DDTHH:mm:ss'),
      count,
      'ThreatTrend',
    )
    this.getTopListData(
      moment(range[0]).format('YYYY-MM-DDTHH:mm:ss'),
      moment(range[1]).format('YYYY-MM-DDTHH:mm:ss'),
      10,
    )
  }

  // render Tab右上角切换时间段部分
  renderRightOperation = () => {
    const { currentDate } = this.state
    const { intl } = this.props

    return (
      <div className={styles.trendExtraWrap}>
        <div className={styles.trendExtra}>
          <span
            className={currentDate === 'week' ? styles.currentDate : ''}
            onClick={() => this.selectDate('week')}
          >
            {intl.formatMessage({ id: 'pages.events.this.week' })}
          </span>
          <span
            className={currentDate === 'month' ? styles.currentDate : ''}
            onClick={() => this.selectDate('month')}
          >
            {intl.formatMessage({ id: 'pages.events.this.month' })}
          </span>
        </div>
      </div>
    )
  }

  render() {
    const { threatTrendData = [], disposedTrendData = [], topListData = [], intl } = this.props
    const { tabKey } = this.state
    const tabTitle = (title) => <div style={{ fontSize: '16px' }}>{title}</div>

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
        <ProCard.TabPane
          key="DisposedTrend"
          tab={tabTitle(intl.formatMessage({ id: 'pages.events.tabs.disposal.processed' }))}
        >
          <Row gutter={24}>
            <Col span={17}>
              <div>
                <DisposedTrendColumn data={disposedTrendData} />
              </div>
            </Col>
            <Col span={7}>
              <TopHosts
                title={intl.formatMessage({ id: 'pages.events.assets.ranking' })}
                topListData={topListData}
              />
            </Col>
          </Row>
        </ProCard.TabPane>
        <ProCard.TabPane
          key="ThreatTrend"
          tab={tabTitle(intl.formatMessage({ id: 'pages.events.tabs.threat.trend' }))}
        >
          <Row>
            <Col span={17}>
              <div>
                <ThreatTrendLine data={threatTrendData} />
              </div>
            </Col>
            <Col span={7}>
              <TopHosts
                title={intl.formatMessage({ id: 'pages.events.assets.ranking' })}
                topListData={topListData}
              />
            </Col>
          </Row>
        </ProCard.TabPane>
      </ProCard>
    )
  }
}

export default injectIntl(TrendTabs)
