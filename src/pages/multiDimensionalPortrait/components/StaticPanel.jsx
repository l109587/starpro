import { useState, useEffect } from 'react'
import ProCard from '@ant-design/pro-card'
import { Line } from '@ant-design/plots'
import numeral from 'numeral'
import { requestQuantity, requestQuantityMax5 } from '@/services/multiDimensionalPortrait'
import Applications from '@/components/Common/Applications'
import styles from './StaticPanel.less'
import hot from '@/assets/hot.svg'
import phone from '@/assets/phone.svg'
import { Tooltip, Typography, Row, Col } from 'antd'
import { useSelector, history } from 'umi'
import classNames from 'classnames'

const StaticChart = ({ Type }) => {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { Code, Data } = await requestQuantity({ Type })
        if (Code !== 'Succeed') return

        setData(Data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Type])

  const config = {
    data,
    color: '#6FCF97',
    padding: 'auto',
    xField: 'TimeQuantum',
    yField: 'Count',
    xAxis: {
      line: null,
      tickLine: null,
      tickCount: 12,
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
    meta: {
      Count: {
        alias: '数量',
      },
      TimeQuantum: {
        alias: '时间',
      },
    },
    tooltip: {
      title: '请求量',
      fields: ['Count', 'TimeQuantum'],
    },
    smooth: true,
    lineStyle: {
      lineWidth: 4,
      shadowColor: '#6FCF97',
      shadowBlur: 12,
      opacity: 0.86,
    },
  }

  return <Line {...config} style={{ width: '100%', height: '100%' }} />
}

const StaticList = ({ Type }) => {
  const theme = useSelector(({ global }) => global.theme)
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { Code, Data } = await requestQuantityMax5({ Type })
        if (Code !== 'Succeed') return

        setData(Data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Type])

  return (
    <>
      {data.map(({ Apps, EventCount, Name, SumCount }) => (
        <div
          key={Name}
          className={classNames([
            styles.listItem,
            theme === 'dark' ? styles.listItemDark : styles.listItemLight,
          ])}
        >
          <Row gutter={8}>
            <Col span={9}>
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  history.push({
                    pathname: `/assets/portraits/${Type}`,
                    query: {
                      [Type === 'ip' ? 'Ip' : 'Api']: Name,
                    },
                  })
                }}
              >
                <Typography.Text
                  style={{
                    maxWidth: '100%',
                    color: '#524eee',
                  }}
                  ellipsis={{ tooltip: Name }}
                >
                  {Name}
                </Typography.Text>
              </div>
            </Col>
            <Col span={4}>
              <Tooltip title="请求量">
                <div>
                  <img src={phone} style={{ width: '14px', marginRight: '7px' }} />
                  {SumCount}
                </div>
              </Tooltip>
            </Col>
            <Col span={4}>
              <Tooltip title="事件量">
                <div>
                  <img src={hot} style={{ width: '16px', marginRight: '7px' }} />
                  {EventCount}
                </div>
              </Tooltip>
            </Col>
            <Col span={7} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Applications apps={Apps} count={1} />
            </Col>
          </Row>
        </div>
      ))}
    </>
  )
}

// Type: 'ip' | 'api'
const StaticPanel = ({ Type }) => {
  return (
    <ProCard gutter={[24, 16]} style={{ marginBottom: 24 }} ghost wrap>
      <ProCard
        title="请求量"
        colSpan={{ xs: 24, sm: 24, md: 24, lg: 24, xl: 12 }}
        bodyStyle={{ height: 360 }}
        bordered
      >
        <StaticChart Type={Type} />
      </ProCard>
      <ProCard
        title={`请求量最大的5个${Type.toUpperCase()}`}
        colSpan={{ xs: 24, sm: 24, md: 24, lg: 24, xl: 12 }}
        bodyStyle={{
          height: 360,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        bordered
      >
        <StaticList Type={Type} />
      </ProCard>
    </ProCard>
  )
}

export default StaticPanel
