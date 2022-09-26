import { connect, useSelector } from 'umi'
import { Pie, measureTextWidth } from '@ant-design/plots'
import numeral from 'numeral'

export default function RingChart({ data = [], sumText = '', color = [] }) {
  const theme = useSelector(({ global }) => global.theme)
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
    return `<div style="${textStyleStr};font-size:${scale * 0.6}em;line-height:${
      scale < 1 ? 1 : 'inherit'
    };">${text}</div>`
  }

  const config = {
    autoFit: true,
    appendPadding: [0, 0, 0, 10],
    data,
    angleField: 'Count',
    colorField: 'Key',
    color: color,
    radius: 0.8,
    innerRadius: 0.7,
    label: false,
    legend: {
      itemName: {
        style: {
          fill: textColor,
        },
      },
      offsetX: -5,
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
        // offsetX: -4,
        customHtml: (container, view, datum) => {
          const { width, height } = container.getBoundingClientRect()
          const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2)) * 2.0
          const text = datum ? datum.Key : sumText
          return renderStatistic(d, text, {
            fontSize: 12,
          })
        },
      },
      content: {
        offsetY: -4,
        // offsetX: -4,
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
}
