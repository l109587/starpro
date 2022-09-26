import React from 'react'
import { SecurityScanOutlined, FieldTimeOutlined } from '@ant-design/icons'
import ProCard from '@ant-design/pro-card'
import { Tabs, Row, Col, Tooltip, Typography } from 'antd'
import { Line } from '@ant-design/charts'
import numeral from 'numeral'
import {
  getAppBriefInfo,
  getListAppSecurityTrends,
  getListAppSecurityTopHosts,
} from '@/services/assets'
import { getTimeDistance } from '@/utils/utils'
import moment from 'moment'
import { injectIntl, history, connect } from 'umi'
import styles from './index.less'
import IconFont from '@/components/Common/IconFont'
import Overview from './view.jsx'

const { TabPane } = Tabs
const CHART_MAP_KEY = {
  High: 1,
  Medium: 2,
  Low: 3,
  Info: 4,
}

@connect(({ global }) => ({ theme: global.theme }))
class AppDetailCard extends React.Component {
  state = {
    appDetail: {},
    eventTrends: [],
    riskTrends: [],

    activeTimeType: 'month',
    tabVal: 'risk',

    issueRankingListData: [],
    eventRankingListData: [],
  }

  get eventChartConfig() {
    const { theme } = this.props
    const textColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)'
    return {
      data: this.state.eventTrends,
      xField: 'Time',
      yField: 'Value',
      seriesField: 'Type',
      xAxis: {
        tickCount: 5,
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
      color: ['#FF4D4F', '#FAAD14', '#1890FF', '#61DDAA'],
      startOnZero: false,
      autoFit: true,
      legend: {
        position: 'top',
        itemName: {
          style: {
            fill: textColor,
          },
        },
      },
    }
  }

  get riskChartConfig() {
    return {
      data: this.state.riskTrends,
      xField: 'Time',
      yField: 'Value',
      seriesField: 'Type',
      yAxis: {
        label: {
          formatter: (v) => v,
        },
      },
      color: ['#FF4D4F', '#FAAD14', '#1890FF', '#61DDAA'],
      autoFit: true,
    }
  }

  componentDidMount() {
    this.getAppDetail()
  }

  getAppDetail() {
    this.getBaseInfo()
    this.getEventTrends()
    this.getEventTops()
  }

  async getBaseInfo() {
    try {
      const { appId } = this.props
      const { Data } = await getAppBriefInfo({
        AppId: appId,
      })

      this.setState({ appDetail: Data })
    } catch (err) {
      console.log(err)
    }
  }

  async getEventTrends() {
    try {
      const { appId } = this.props
      const time = getTimeDistance(this.state.activeTimeType)
      let startTime = time[0]
      let endTime = time[1]
      startTime = moment(+startTime).format('YYYY-MM-DDTHH:mm:ss')
      endTime = moment(+endTime).format('YYYY-MM-DDTHH:mm:ss')

      const { Data } = await getListAppSecurityTrends({
        AppId: appId,
        StartTime: startTime,
        EndTime: endTime,
        Type: 'Event',
        Count: this.state.activeTimeType === 'month' ? 10 : 7,
      })

      this.setState({
        eventTrends: Data.sort((a, b) => CHART_MAP_KEY[a.Key] - CHART_MAP_KEY[b.Key]).map(
          (i, idx) => {
            return {
              ...i,
              Index: idx,
              Type: this.getTypeByKey(i.Key),
              Time: moment(i.Time).format('YYYY-MM-DD'),
            }
          },
        ),
      })
    } catch (err) {
      console.log(err)
    }
  }

  async getEventTops() {
    try {
      const { appId } = this.props
      const {
        Data: { Stat: eventTopList = [] },
      } = await getListAppSecurityTopHosts({
        Count: 10,
        AppId: appId,
        Type: 'Event',
      })

      this.setState({ eventRankingListData: eventTopList })
    } catch (err) {
      console.log(err)
    }
  }

  getTypeByKey(key) {
    const { intl } = this.props
    let Type = ''

    if (key === 'High') {
      Type = intl.formatMessage({ id: 'component.appDetailCard.risk.high' })
    } else if (key === 'Medium') {
      Type = intl.formatMessage({ id: 'component.appDetailCard.risk.medium' })
    } else if (key === 'Low') {
      Type = intl.formatMessage({ id: 'component.appDetailCard.risk.low' })
    } else if (key === 'Info') {
      Type = intl.formatMessage({ id: 'component.appDetailCard.risk.info' })
    }

    return Type
  }

  handleTimeChange(type) {
    const timeArr = getTimeDistance(type)
    this.getAppDetail()
  }

  getTopRank(type) {
    const { intl } = this.props
    const dataList =
      type === 'event' ? this.state.eventRankingListData : this.state.issueRankingListData
    return (
      <Col xl={8} lg={12} md={12} sm={24} xs={24}>
        <div className={styles.salesRank}>
          <div className={styles.rankingTitle}>
            {type === 'event'
              ? intl.formatMessage({ id: 'component.appDetailCard.event.assets.ranking' })
              : intl.formatMessage({ id: 'component.appDetailCard.risk.assets.ranking' })}
          </div>
          <ul className={styles.rankingList}>
            {dataList.map((item, i) => (
              <li key={item.Host}>
                <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
                  {i + 1}
                </span>
                <span className={styles.rankingItemTitle} title={item.Host}>
                  {item.Host}
                </span>
                <span>{numeral(item.Count).format('0,0')}</span>
              </li>
            ))}
          </ul>
        </div>
      </Col>
    )
  }

  render() {
    const { appDetail, activeTimeType } = this.state
    const { intl } = this.props
    const { appId } = history.location.query
    const TIME_OPTIONS = [
      {
        name: intl.formatMessage({ id: 'component.appDetailCard.this.week' }),
        value: 'week',
      },
      {
        name: intl.formatMessage({ id: 'component.appDetailCard.this.month' }),
        value: 'month',
      },
    ]

    return (
      <>
        {/* <ProCard
          title={appDetail.Name}
          wrap
          className={styles.proCardContainer}
          bodyStyle={{ padding: '16px 32px' }}
          headerBordered
          extra={
            <Row gutter={10} style={{ width: 248 }}>
              <Col span={7} style={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title="事件总数" mouseLeaveDelay={0}>
                  <IconFont
                    type="icon-icon_event_16"
                    className={styles.appIcon}
                    style={{ marginRight: 2, fontSize: 16 }}
                  />
                </Tooltip>
                <span className={styles.appNum}>
                  {numeral(appDetail.EventsCount).format('0,0')}
                </span>
              </Col>
              <Col
                span={17}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
              >
                <Tooltip title="创建时间" mouseLeaveDelay={0}>
                  <IconFont
                    type="icon-icon_time_16"
                    className={styles.appIcon}
                    style={{ marginRight: 2, fontSize: 16 }}
                  />
                </Tooltip>
                <Typography.Text
                  className={styles.appNum}
                  style={{ width: 152 }}
                  ellipsis={{ tooltip: moment(appDetail.CreatedAt).format('YYYY-MM-DD HH:mm:ss') }}
                >
                  {moment(appDetail.CreatedAt).format('YYYY-MM-DD HH:mm:ss')}
                </Typography.Text>
              </Col>
            </Row>
          }
        >
          <div className={styles.flexSpace}>
            <span>
              {appId === 'UnclassifiedAssets' ? '这里是所有未分类资产' : appDetail.Description}
            </span>
            <Row gutter={10} style={{ width: 248 }}>
              <Col span={7} style={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title="API 总数" mouseLeaveDelay={0}>
                  <IconFont
                    type="icon-icon_api_24"
                    className={styles.appIcon}
                    style={{ marginRight: 2, fontSize: 16 }}
                  />
                </Tooltip>
                <span className={styles.appNum}>{appDetail.ApiCount}</span>
              </Col>
              <Col
                span={17}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
              >
                <Tooltip title="资产范围" mouseLeaveDelay={0}>
                  <IconFont
                    type="icon-icon_zichan_16"
                    className={styles.appIcon}
                    style={{ marginRight: 2, fontSize: 16 }}
                  />
                </Tooltip>
                <Typography.Text
                  className={styles.appNum}
                  style={{ width: 152 }}
                  ellipsis={{ tooltip: appDetail.Range }}
                >
                  {appDetail.Range}
                </Typography.Text>
              </Col>
            </Row>
          </div>
        </ProCard> */}
        <ProCard bodyStyle={{ overflow: 'hidden' }}>
          <Row>
            <Col span={12}>
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 600 }}>{appDetail.Name}</div>
                <div>{appDetail.Description}</div>
              </div>
            </Col>
            <Col span={12}>
              <Overview appId={this.props.appId} />
            </Col>
          </Row>
        </ProCard>
        <ProCard style={{ marginTop: 24 }} bodyStyle={{ padding: 0 }}>
          <Tabs
            value={this.state.tabVal}
            tabBarExtraContent={
              <div>
                {TIME_OPTIONS.map((i) => {
                  return (
                    <span
                      className={
                        i.value === activeTimeType ? styles.timeActive : styles.timeUnActive
                      }
                      style={{ cursor: 'pointer' }}
                      key={i.value}
                      onClick={() => {
                        this.setState(
                          {
                            activeTimeType: i.value,
                          },
                          () => {
                            this.handleTimeChange(i.value)
                          },
                        )
                      }}
                    >
                      {i.name}
                    </span>
                  )
                })}
              </div>
            }
            size="large"
            tabBarStyle={{
              marginBottom: 32,
              paddingLeft: 32,
              paddingRight: 32,
            }}
          >
            {/* <TabPane
              tab={intl.formatMessage({ id: 'component.appDetailCard.risk.trend' })}
              key="risk"
            >
              <Row>
                <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                  <div className={styles.salesBar}>
                    <Area {...this.riskChartConfig} />
                  </div>
                </Col>
                {this.getTopRank('issue')}
              </Row>
            </TabPane> */}
            <TabPane
              tab={
                <span style={{ padding: '0 12px' }}>
                  {intl.formatMessage({ id: 'component.appDetailCard.event.trend' })}
                </span>
              }
              key="event"
            >
              <Row style={{ padding: '0 32px' }}>
                <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                  <div className={styles.salesBar}>
                    <Line {...this.eventChartConfig} />
                  </div>
                </Col>
                {this.getTopRank('event')}
              </Row>
            </TabPane>
          </Tabs>
        </ProCard>
      </>
    )
  }
}

export default injectIntl(AppDetailCard)
