import React from 'react'
import ProCard from '@ant-design/pro-card'
import { Column } from '@ant-design/charts'
import { Row, Col } from 'antd'
import { connect, useIntl, injectIntl } from 'umi'
import styles from './trendTabs.less'
import TopHosts from '@/components/Common/topHost.jsx'
import { getTimeDistance } from '@/utils/utils'
import moment from 'moment'

const TrendColumn = (props) => {
  const { data = [] } = props
  const intl = useIntl()

  const config = {
    height: 220,
    data,
    isGroup: true,
    yField: 'Value',
    seriesField: 'Key',
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
    xField: 'Time',
    legend: {
      position: 'top',
      itemName: {
        formatter: function formatter(text, item) {
          return item.value === 'Total'
            ? intl.formatMessage({ id: 'pages.issues.chart.total' })
            : intl.formatMessage({ id: 'pages.issues.chart.disposal.trend' })
        },
      },
    },
    xAxis: {
      label: {
        style: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      },
    },
    color: function color(_ref) {
      const type = _ref.Key
      if (type === 'Total') {
        return '#5B8FF9'
      }
      return 'rgb(97, 221, 170)'
    },
    tooltip: {
      formatter: (value) => {
        const name =
          value.Key === 'Total'
            ? intl.formatMessage({ id: 'pages.issues.chart.total' })
            : intl.formatMessage({ id: 'pages.issues.chart.disposal.trend' })
        return {
          name: name,
          value: value.Value,
        }
      },
    },
  }
  return <Column {...config} />
}

@connect(({ issues }) => ({
  trendData: issues.trendData,
  topListData: issues.topListData,
}))
class TrendTabs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabKey: 'trend',
      currentDate: 'week',
    }
  }

  componentDidMount() {
    const range = getTimeDistance('week')
    this.getTrendsData(
      moment(range[0]).format('YYYY-MM-DDTHH:mm:ss'),
      moment(range[1]).format('YYYY-MM-DDTHH:mm:ss'),
      7,
    )
    this.getTopListData(
      moment(range[0]).format('YYYY-MM-DDTHH:mm:ss'),
      moment(range[1]).format('YYYY-MM-DDTHH:mm:ss'),
      10,
    )
  }

  // 获取处置趋势、威胁趋势图表Data
  getTrendsData = (from, to, count) => {
    const { dispatch } = this.props
    if (dispatch) {
      dispatch({
        type: 'issues/getTrendsData',
        payload: {
          StartTime: from,
          EndTime: to,
          Count: count,
        },
      })
    }
  }

  // 获取Top资产Data
  getTopListData = (from, to, count = 10) => {
    const { dispatch } = this.props
    if (dispatch) {
      dispatch({
        type: 'issues/getTopListData',
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
          <a
            className={currentDate === 'week' ? styles.currentDate : ''}
            onClick={() => this.selectDate('week')}
          >
            {intl.formatMessage({ id: 'pages.issues.this.week' })}
          </a>
          <a
            className={currentDate === 'month' ? styles.currentDate : ''}
            onClick={() => this.selectDate('month')}
          >
            {intl.formatMessage({ id: 'pages.issues.this.month' })}
          </a>
        </div>
      </div>
    )
  }

  render() {
    const { trendData = [], topListData = [], intl } = this.props
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
          key="trend"
          tab={tabTitle(intl.formatMessage({ id: 'pages.issues.risk.trends' }))}
        >
          <Row>
            <Col xl={18} lg={16} md={12} sm={24} xs={24}>
              <h4 className={styles.trendTitle}>
                {intl.formatMessage({ id: 'pages.issues.risk.trending' })}
              </h4>
              <div className={styles.trendBar}>
                <TrendColumn data={trendData} />
              </div>
            </Col>
            <Col xl={6} lg={8} md={12} sm={24} xs={24}>
              <TopHosts
                title={intl.formatMessage({ id: 'pages.issues.assets.ranking' })}
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
