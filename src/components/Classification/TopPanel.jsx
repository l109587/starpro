import { useState, useEffect } from 'react'
import { Bar } from '@ant-design/charts'
import styles from './TopPnael.less'
import { getTopTags } from '@/services/categories'
import numeral from 'numeral'
import { useSelector } from 'umi'

export default function TopPnael({ CategoryIds }) {
  const [data, setData] = useState([])
  const theme = useSelector(({ global }) => global.theme)

  useEffect(() => {
    const fetchData = async () => {
      if (!CategoryIds) return
      const {
        Code,
        Data: { Stat },
      } = await getTopTags({ CategoryIds, Count: 5 })
      if (Code !== 'Succeed') return

      setData(Stat)
    }

    fetchData()
  }, [CategoryIds])

  const textColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)'
  const wrapperBorder =
    theme === 'dark' ? '1px solid rgba(186, 208, 241, 0.1)' : '0.6px solid #BAD0F1'

  const config = {
    barWidthRatio: 0.4,
    autoFit: true,
    data,
    appendPadding: [0, 16, 10, 16],
    color: ['#524EEE', '#A35CF1', '#647798', '#65DAAB', '#6495F9'],
    xField: 'Count',
    yField: 'Entities',
    seriesField: 'Entities',
    legend: false,
    tooltip: {
      showTitle: false,
    },
    xAxis: {
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
    yAxis: {
      label: {
        autoEllipsis: true,
        style: {
          fill: textColor,
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
      <div className={styles.title}>TOP 数据标签类型</div>
      {!!data.length && <Bar {...config} style={{ height: 200 }} />}
    </div>
  )
}
