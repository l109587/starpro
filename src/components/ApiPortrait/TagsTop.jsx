import { useState, useEffect } from 'react'
import { Bar } from '@ant-design/charts'
import { getApiTopTags } from '@/services/apiPortrait'
import numeral from 'numeral'
import { useSelector } from 'umi'

export default function TagsTop({ Api }) {
  const [data, setData] = useState([])
  const theme = useSelector(({ global }) => global.theme)
  const textColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)'

  useEffect(() => {
    const fetchData = async () => {
      const {
        Code,
        Data: { Stat },
      } = await getApiTopTags({ Api, Count: 5 })
      if (Code !== 'Succeed') return

      setData(Stat)
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Api])

  const config = {
    data,
    appendPadding: [8, 24],
    xField: 'Count',
    yField: 'Key',
    seriesField: 'Key',
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

  return !!data.length && <Bar {...config} />
}
