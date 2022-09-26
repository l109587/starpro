import { useState, useEffect } from 'react'
import ProCard from '@ant-design/pro-card'
import { Popover, Button, Space } from 'antd'
import { EllipsisOutlined } from '@ant-design/icons'
import { Link, useLocation } from 'umi'
import styles from './IpInfoPanels.less'
import moment from 'moment'
import { getIpPortraitDetails } from '@/services/ipPortrait'
import ScatterChart from './ScatterChart'
import RiskDistribution from './RiskDistribution'
import Applications from '../Common/Applications'

export default function IpInfoPanels() {
  const location = useLocation()
  const { query } = location
  const [ipPortraitDetails, setIpPortraitDetails] = useState({})
  // 获取IP画像详情
  useEffect(() => {
    const fetchData = async () => {
      const { Ip } = query
      const { Code, Data } = await getIpPortraitDetails({ Ip })
      if (Code !== 'Succeed') return

      setIpPortraitDetails(Data)
    }

    fetchData()
  }, [query])

  const title = (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img src={require('@/assets/ip.png')} width="14" alt="" />
      <span style={{ fontSize: 14, marginLeft: 4, marginRight: 16 }}>{ipPortraitDetails.Ip}</span>
    </div>
  )

  return (
    <ProCard className={styles.ipInfoPanels} gutter={24}>
      <ProCard
        bordered
        title={title}
        headStyle={{ padding: '8px 24px' }}
        bodyStyle={{
          padding: '8px 24px',
          height: 160,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div className={styles.infoItem}>
          <div className={styles.itemLabel}>请求量：</div>
          <div className={styles.itemValue}>{ipPortraitDetails.ReuqestsCount}</div>
        </div>
        <div className={styles.infoItem}>
          <div className={styles.itemLabel}>访问标签：</div>
          <div className={styles.itemValue}>{ipPortraitDetails.TagsCount}</div>
        </div>
        <div className={styles.infoItem}>
          <div className={styles.itemLabel}>发现时间：</div>
          <div className={styles.itemValue}>
            {moment(ipPortraitDetails.FoundAt).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        </div>
        <div className={styles.infoItem}>
          <div className={styles.itemLabel}>活跃时间：</div>
          <div className={styles.itemValue}>
            {moment(ipPortraitDetails.ActivedAt).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        </div>
        <div className={styles.infoItem}>
          <div className={styles.itemLabel}>访问应用：</div>
          <div className={styles.itemValue}>
            <Applications apps={ipPortraitDetails.Apps} />
          </div>
        </div>
      </ProCard>
      <ProCard
        bordered
        title={<span style={{ fontSize: 16 }}>风险趋势</span>}
        headStyle={{ padding: '8px 24px' }}
        bodyStyle={{ height: 160, padding: 0 }}
      >
        <ScatterChart Ip={query.Ip} />
      </ProCard>
      <ProCard
        bordered
        title={<span style={{ fontSize: 16 }}>风险分布</span>}
        headStyle={{ padding: '8px 24px' }}
        bodyStyle={{
          padding: '8px 24px',
          height: 160,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <RiskDistribution Ip={query.Ip} />
      </ProCard>
    </ProCard>
  )
}
