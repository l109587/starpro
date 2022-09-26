import React from 'react'
import { RingProgress } from '@ant-design/charts'
import { connect, injectIntl } from 'umi'
import { Row, Col, Card } from 'antd'
import numeral from 'numeral'
import styles from './stat.less'

@connect(({ issues }) => ({
  issuesStatData: issues.issuesStatData,
}))
class EventsStateTrend extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props
    if (dispatch) {
      dispatch({
        type: 'issues/getIssuesStat',
      })
    }
  }

  renderTitle = (item) => {
    const { intl } = this.props
    const { Severity, Increased } = item
    const isNagitive = Increased < 0
    const valueAbs = (Math.abs(Increased) * 100).toFixed(2)
    const percent = `${(isNagitive ? '-' : '+') + valueAbs}%`
    const severityMap = {
      High: intl.formatMessage({ id: 'pages.issues.risk.high' }),
      Medium: intl.formatMessage({ id: 'pages.issues.risk.medium' }),
      Low: intl.formatMessage({ id: 'pages.issues.risk.low' }),
      Info: intl.formatMessage({ id: 'pages.issues.risk.info' }),
    }

    return (
      <div className={styles.title}>
        <span>{severityMap[Severity]}</span>
        <span style={{ color: !isNagitive ? '#17E938' : 'red' }}>{percent}</span>
      </div>
    )
  };

  render() {
    const { issuesStatData = [] } = this.props
    const config = {
      height: 40,
      width: 40,
      autoFit: false,
    }
    const colorMap = {
      High: '#E87A7A',
      Medium: '#F7B500',
      Low: '#0091FF',
      Info: '#6DD400',
    }
    return (
      <Row
        className={styles.issuesStat}
        gutter={20}
        justify="space-around"
        style={{ overflow: 'auto', marginBottom: '24px' }}
      >
        {issuesStatData.map((item) => {
          return (
            <Col key={item.Severity} span={6}>
              <Card title={this.renderTitle(item)} bordered={false}>
                <div className={styles.ringProgress}>
                  <span className={styles.value}>{numeral(item.Count).format('0,0')}</span>
                  <RingProgress
                    className={styles.ring}
                    {...config}
                    statistic={{
                      content: '',
                      titlt: '',
                    }}
                    percent={item.Proportion}
                    color={[colorMap[item.Severity], '#f0f2f5']}
                  />
                </div>
              </Card>
            </Col>
          )
        })}
      </Row>
    )
  }
}

export default injectIntl(EventsStateTrend)
