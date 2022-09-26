import { useState, useEffect } from 'react'
import { Scatter } from '@ant-design/charts'
import { getIpEventsScatters } from '@/services/ipPortrait'
import { getTimeDistance } from '@/utils/utils'
import moment from 'moment'
import { useSelector } from 'umi'

export default function ScatterChart({ Ip }) {
  const [data, setData] = useState([])
  const theme = useSelector(({ global }) => global.theme)
  const textColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)'

  useEffect(() => {
    const fetchData = async () => {
      const range = getTimeDistance('week')
      const StartTime = moment(range[0]).format('YYYY-MM-DDTHH:mm:ss')
      const EndTime = moment(range[1]).format('YYYY-MM-DDTHH:mm:ss')
      const {
        Code,
        Data: { Scatters },
      } = await getIpEventsScatters({ Ip, Count: 7, StartTime, EndTime })
      if (Code !== 'Succeed') return

      Scatters.forEach((e) => {
        const dateTime = e.Date
        const date = moment(dateTime).format('YYYY-MM-DD')
        const hour = moment(dateTime).format('HH')

        e.Date = date
        e.Hour = hour
        e.customField = '事件数量'
      })

      setData(Scatters)
    }

    fetchData()
  }, [Ip])

  const config = {
    data,
    appendPadding: [8, 24],
    xField: 'Hour',
    yField: 'Date',
    colorField: 'customField',
    size: [5, 16],
    sizeField: 'Count',
    legend: {
      layout: 'vertical',
      position: 'right',
      itemName: {
        style: {
          fill: textColor,
        },
      },
    },
    meta: {
      Count: { alias: '事件数量' },
      Date: { alias: '日期' },
      Hour: { alias: '小时' },
    },
    tooltip: {
      fields: ['Count', 'Date', 'Hour'],
    },
    shape: 'circle',
    yAxis: {
      title: {
        text: '日期',
        position: 'end',
        autoRotate: false,
        style: {
          fill: textColor,
        },
      },
      nice: false,
      grid: { line: { style: { stroke: '#eee' } } },
      line: { style: { stroke: '#aaa' } },
    },
    xAxis: {
      title: {
        text: '小时',
        position: 'end',
        style: {
          fill: textColor,
        },
      },
      grid: { line: { style: { stroke: '#eee' } } },
      line: { style: { stroke: '#aaa' } },
    },
  }

  return <Scatter {...config} />
}
