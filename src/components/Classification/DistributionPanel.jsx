import { useState, useEffect } from 'react'
import { Pie, measureTextWidth } from '@ant-design/charts'
import styles from './DistributionPanel.less'
import { getCategoryApisDistribution } from '@/services/categories'
import { useSelector } from 'umi'

export default function DistributionPanel({ CategoryIds }) {
  function renderStatistic(containerWidth, text, style) {
    const MeasureTextWidth = (0, measureTextWidth)(text, style)
    const textWidth = MeasureTextWidth.width
    const textHeight = MeasureTextWidth.height
    const R = containerWidth / 2
    let scale = 1

    if (containerWidth < textWidth) {
      scale = Math.min(
        Math.sqrt(
          // eslint-disable-next-line no-restricted-properties
          Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2))),
        ),
        1,
      )
    }
    const textStyleStr = `width:${containerWidth}px;color:${textColor};`

    return '<div style="'
      .concat(textStyleStr, ';font-size:')
      .concat(scale, 'em;line-height:')
      .concat(scale < 1 ? 1 : 'inherit', ';">')
      .concat(text, '</div>')
  }

  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const theme = useSelector(({ global }) => global.theme)
  const textColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)'
  const wrapperBorder =
    theme === 'dark' ? '1px solid rgba(186, 208, 241, 0.1)' : '0.6px solid #BAD0F1'

  useEffect(() => {
    const fetchData = async () => {
      if (!CategoryIds) return
      const {
        Code,
        Data: { Distributions },
      } = await getCategoryApisDistribution({ CategoryIds })
      if (Code !== 'Succeed') return

      setData(Distributions)
      setTotal(Distributions.reduce((prev, cur) => cur.Count + prev, 0))
    }

    fetchData()
  }, [CategoryIds])

  const config = {
    legend: {
      itemName: {
        style: {
          fill: textColor,
        },
      },
    },
    data,
    angleField: 'Count',
    colorField: 'Key',
    meta: {
      Key: { alias: '等级' },
      Count: { alias: '数量' },
      Proportion: { alias: '占比' },
    },
    color: ['#524EEE', '#A35CF1', '#6FCF97', '#FF862E', '#647798'],
    appendPadding: 16,
    radius: 1,
    innerRadius: 0.75,
    label: false,
    tooltip: {
      fields: ['Key', 'Count', 'Proportion'],
    },
    interactions: [
      { type: 'element-selected' },
      { type: 'element-active' },
      { type: 'pie-statistic-active' },
    ],
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
        style: { fontSize: '12px' },
        customHtml: function customHtml(container, view, datum) {
          const Container$getBoundin = container.getBoundingClientRect()
          const width = Container$getBoundin.width
          const height = Container$getBoundin.height
          // eslint-disable-next-line no-restricted-properties
          const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2))
          const text = datum ? datum.Key : '总计'
          return renderStatistic(d, text, { fontSize: 28 })
        },
      },
      content: {
        offsetY: 4,
        style: { fontSize: '16px' },
        customHtml: function customHtml(container, view, datum, value) {
          const Container$getBoundin2 = container.getBoundingClientRect()
          const width = Container$getBoundin2.width
          const text = datum
            ? ''.concat(datum.Count)
            : ''.concat(
                value.reduce((r, d) => {
                  return r + d.Count
                }, 0),
              )
          return renderStatistic(width, text, { fontSize: 32 })
        },
      },
    },
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 1000 * 1.3,
      },
    },
  }

  return (
    <div className={styles.panelItem} style={{ border: wrapperBorder }}>
      <div className={styles.title}>等级分布</div>
      {!!data.length && <Pie {...config} style={{ height: 200, paddingLeft: 20 }} />}
    </div>
  )
}
