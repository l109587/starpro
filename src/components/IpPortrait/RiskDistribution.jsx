import { useState, useEffect } from 'react'
import { Pie, measureTextWidth } from '@ant-design/plots'
import { getIpEventsDistribution } from '@/services/ipPortrait'
import { connect } from 'umi'
import numeral from 'numeral'
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
      color: ['#ff244c', '#ff6b00', '#6fcf97', ' #524EEE'],
      radius: 1,
      innerRadius: 0.7,
      label: false,
      legend: {
        itemName: {
          style: {
            fill: textColor,
          },
        },
        offsetX: -50,
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
    return !!data.length && <Pie {...config} />
  },
)

export default function RiskDistribution({ Ip }) {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const {
        Code,
        Data: { Stat },
      } = await getIpEventsDistribution({ Ip })
      if (Code !== 'Succeed') return

      setData(Stat.map(({ Key, ...rest }) => ({ Key: SeverityMap[Key], ...rest })))
    }

    fetchData()
  }, [Ip])

  return <RingChart data={data} sumText="全部事件" />
}
