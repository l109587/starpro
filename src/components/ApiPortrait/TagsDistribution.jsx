import { useState, useEffect } from 'react'
import { Pie, measureTextWidth } from '@ant-design/charts'
import { getApiTagsDistribution } from '@/services/apiPortrait'
import { useSelector } from 'umi'

export default function TagsDistribution({ Api }) {
  const theme = useSelector(({ global }) => global.theme)
  const textColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)'
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

  useEffect(() => {
    const fetchData = async () => {
      const {
        Code,
        Data: { Distributions },
      } = await getApiTagsDistribution({ Api, Count: 5 })
      if (Code !== 'Succeed') return

      setData(Distributions)
    }

    fetchData()
  }, [Api])

  const config = {
    appendPadding: [8, 24],
    data: data,
    angleField: 'Count',
    colorField: 'Key',
    radius: 1,
    innerRadius: 0.6,
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
    meta: {
      Key: { alias: '标签' },
      Count: { alias: '数量' },
      Proportion: { alias: '占比' },
    },
    label: false,
    tooltip: {
      fields: ['Key', 'Count', 'Proportion'],
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
    interactions: [
      { type: 'element-selected' },
      { type: 'element-active' },
      { type: 'pie-statistic-active' },
    ],
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 1000 * 1.3,
      },
    },
  }

  return !!data.length && <Pie {...config} />
}
