import { useState, useEffect } from 'react'
import CountUp from 'react-countup'
import { getCategoriesCountStat } from '@/services/categories'
import styles from './TotalPanel.less'
import { useSelector } from 'umi'
import { color } from 'echarts'

export default function TotalPanel({ CategoryIds }) {
  const theme = useSelector(({ global }) => global.theme)
  const [data, setData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      if (!CategoryIds) return
      const { Code, Data } = await getCategoriesCountStat({ CategoryIds })
      if (Code !== 'Succeed') return

      setData(Data)
    }

    fetchData()
  }, [CategoryIds])
  const darkStyle = {
    wrapper: {
      border: '1px solid rgba(186, 208, 241, 0.1)',
    },
    dataCountName: {
      backgroundColor: '#1D1D42',
      border: '1px solid rgba(186, 208, 241, 0.1)',
      color: '#524EEE',
    },
    apiCountName: {
      bbackgroundColor: '#1D1D42',
      border: '1px solid rgba(186, 208, 241, 0.1)',
      color: '#6FCF97',
    },
  }
  const lightStyle = {
    wrapper: {
      border: ' 0.6px solid #BAD0F1',
    },
    dataCountName: {
      backgroundColor: '#524EEE',
      color: '#fff',
    },
    apiCountName: {
      backgroundColor: '#6FCF97',
      color: '#fff',
    },
  }
  const styleSheet = theme === 'dark' ? darkStyle : lightStyle
  return (
    <div className={styles.panelItem} style={{ ...styleSheet.wrapper }}>
      <div className={styles.title}>概览信息</div>
      <div className={styles.wrap}>
        <div className={styles.item}>
          <span className={styles.count}>
            <CountUp end={data.EntitiesCount || 0} duration={1.3} separator="," />
          </span>
          <div className={styles.countName} style={{ ...styleSheet.dataCountName }}>
            敏感数据数
          </div>
        </div>
        <div className={styles.item}>
          <span className={styles.count}>
            <CountUp end={data.ApiCount || 0} duration={1.3} separator="," />
          </span>
          <div className={styles.countName} style={{ ...styleSheet.apiCountName }}>
            包含API数
          </div>
        </div>
      </div>
    </div>
  )
}
