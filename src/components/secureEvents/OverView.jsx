/* eslint-disable no-restricted-properties */
import { useState, useEffect } from 'react'
import ProCard from '@ant-design/pro-card'
import { Line, Pie, measureTextWidth } from '@ant-design/plots'
import styles from './OverView.less'
import numeral from 'numeral'
import { connect, useSelector } from 'umi'
import { Row, Col } from 'antd'
import { numFormat } from '@/utils/utils'
import { getEventsTotal, getEventIncrement } from '@/services/statistics'
import { SeverityMap } from '@/constant/content'

const RingChart = connect(({ global }) => ({ theme: global.theme }))(
  ({ data = [], sumText = '', theme }) => {
    const textColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)'
    function renderStatistic(containerWidth, text, style) {
      const { width: textWidth, height: textHeight } = measureTextWidth(text, style)
      const R = containerWidth / 2 // r^2 = (w / 2)^2 + (h - offsetY)^2

      let scale = 1

      if (containerWidth < textWidth) {
        scale = Math.min(
          Math.sqrt(
            Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2))),
          ),
          1,
        )
      }

      const textStyleStr = `width:${containerWidth}px;color:${textColor};`
      return `<div style="${textStyleStr};font-size:${scale * 0.5}em;line-height:${
        scale < 1 ? 1 : 'inherit'
      };">${text}</div>`
    }

    const config = {
      appendPadding: 10,
      data,
      angleField: 'Count',
      colorField: 'Key',
      color: ['#ff244c', '#ff6b00', '#6FCF97', '#524EEE'],
      radius: 1,
      innerRadius: 0.7,
      label: false,
      legend: {
        itemName: {
          style: {
            fill: textColor,
          },
        },
      },
      pieStyle: {
        stroke: theme === 'dark' ? 'black' : 'white',
      },
      state: {
        active: {
          style: {
            stroke: theme === 'dark' ? 'white' : 'black',
          },
        },
      },
      statistic: {
        title: {
          offsetY: -4,
          customHtml: (container, view, datum) => {
            const { width, height } = container.getBoundingClientRect()
            const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2)) * 1.36
            const text = datum ? datum.Key : sumText
            return renderStatistic(d, text, {
              fontSize: 12,
            })
          },
        },
        content: {
          offsetY: 4,
          style: {
            fontSize: '24px',
          },
          customHtml: (container, view, datum, value) => {
            const { width } = container.getBoundingClientRect()
            const text = datum ? datum.Count : value.reduce((r, d) => r + d.Count, 0)
            return renderStatistic(width, numeral(text).format('0,0'), {
              fontSize: 12,
            })
          },
        },
      },
      // 添加 中心统计文本 交互
      interactions: [
        {
          type: 'element-selected',
        },
        {
          type: 'element-active',
        },
        {
          type: 'pie-statistic-active',
        },
      ],
    }
    return !!data.length && <Pie {...config} style={{ width: '100%', height: '100%' }} />
  },
)

const AffectedCountPane = ({ eventAPI }) => {
  const theme = useSelector(({ global }) => global.theme)
  const darkStyle = {
    wrapper: {
      border: '2px solid rgba(186, 208, 241, 0.1)',
      backgroundColor: '#26264E',
    },
    count: {
      color: '#524eee',
    },
  }
  const lightStyle = {
    wrapper: {
      background: 'linear-gradient(135deg, #868CFF 0%, #4318FF 100%)',
    },
    count: {
      color: '#fff',
    },
  }
  const styleSheet = theme === 'dark' ? darkStyle : lightStyle

  return (
    <div className={styles.affectedWrapper} style={{ ...styleSheet.wrapper }}>
      <div className={styles.count} style={{ ...styleSheet.count }}>
        {numFormat(eventAPI)}
      </div>
      <div className={styles.title}>受影响API数</div>
    </div>
  )
}

const IncreasedLine = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchEventIncrement = async () => {
      try {
        const { Code, Data } = await getEventIncrement()
        if (Code !== 'Succeed') return

        setData(Data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchEventIncrement()
  }, [])

  const config = {
    data,
    color: '#ff244c',
    padding: 'auto',
    xField: 'TimeQuantum',
    yField: 'EventCount',
    meta: {
      EventCount: {
        alias: '数量',
      },
      TimeQuantum: {
        alias: '时间',
      },
    },
    tooltip: {
      title: '新增',
      fields: ['EventCount', 'TimeQuantum'],
    },
    xAxis: {
      line: null,
      tickLine: null,
      tickCount: 12,
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
  }

  return <Line {...config} />
}

const OverView = () => {
  const [eventAPI, setEventAPI] = useState([])
  const [custerEvents, setClusterEvents] = useState([])
  const [fullEvents, setFullEvents] = useState([])

  const fetchEventsTotal = async () => {
    const {
      Code,
      Data: { EventAPI, ClusterEvents, FullEvents },
    } = await getEventsTotal()
    if (Code !== 'Succeed') return
    setEventAPI(EventAPI[0].Count)

    const ClusterEvent = ClusterEvents.filter((i) => i.Key !== 'Total')
    setClusterEvents(ClusterEvent.map(({ Key, ...rest }) => ({ Key: SeverityMap[Key], ...rest })))

    const FullEvent = FullEvents.filter((i) => i.Key !== 'Total')
    setFullEvents(FullEvent.map(({ Key, ...rest }) => ({ Key: SeverityMap[Key], ...rest })))
  }
  useEffect(() => {
    fetchEventsTotal()
  }, [])
  return (
    <Row gutter={24} className={styles.overViewWrapper}>
      <Col span={16}>
        <ProCard gutter={8} title="概览信息">
          <ProCard colSpan={8} layout="center" bodyStyle={{ height: 140, padding: 0 }}>
            <RingChart data={fullEvents} sumText="全部事件" />
          </ProCard>
          <ProCard colSpan={8} layout="center" bodyStyle={{ height: 140, padding: 0 }}>
            <RingChart data={custerEvents} sumText="聚合后事件" />
          </ProCard>
          <ProCard colSpan={8} layout="center" bodyStyle={{ height: 140, padding: 0 }}>
            <AffectedCountPane eventAPI={eventAPI} />
          </ProCard>
        </ProCard>
      </Col>
      <Col span={8}>
        <ProCard title="本日分时段新增事件数">
          <div style={{ height: 140 }}>
            <IncreasedLine />
          </div>
        </ProCard>
      </Col>
    </Row>
  )
}

export default OverView
