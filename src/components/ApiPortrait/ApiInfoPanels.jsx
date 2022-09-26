import { useState, useEffect } from 'react'
import ProCard from '@ant-design/pro-card'
import { Typography, Row, Col, Empty } from 'antd'
import { useLocation } from 'umi'
import styles from './ApiInfoPanels.less'
import moment from 'moment'
import { getApiPortraitDetails } from '@/services/apiPortrait'
import TagsDistribution from './TagsDistribution'
import TagsTop from './TagsTop'
import Applications from '@/components/Common/Applications'
import { getAPIOverview } from '@/services/statistics'
import { SeverityMap } from '@/constant/content'
import RingChart from './RingChart'

export default function ApiInfoPanels() {
  const location = useLocation()
  const { query } = location
  const [apiPortraitDetails, setApiPortraitDetails] = useState({})
  const [fullEvents, setFullEvents] = useState([])
  const [fullEntities, setFullEntities] = useState([])
  const color = ['#ff244c', '#ff6b00', '#6FCF97', '#524EEE']
  // 获取API画像详情
  useEffect(() => {
    const fetchData = async () => {
      const { Api } = query
      const { Code, Data } = await getApiPortraitDetails({ Api })
      if (Code !== 'Succeed') return

      setApiPortraitDetails(Data)
    }

    fetchData()
  }, [query])
  const fetchAPIOverview = async () => {
    const { Api } = query

    const {
      Code,
      Data: { FullEvents, FullEntities },
    } = await getAPIOverview({ API: Api })
    if (Code !== 'Succeed') return

    const FullEvent = FullEvents.filter((i) => i.Key !== 'Total')
    setFullEvents(FullEvent.map(({ Key, ...rest }) => ({ Key: SeverityMap[Key], ...rest })))

    const FullEntitie = FullEntities.filter((i) => i.Key !== 'Total')
    setFullEntities(FullEntitie)
  }
  useEffect(() => {
    fetchAPIOverview()
  }, [])
  const title = <span style={{ color: '#524EEE' }}>{apiPortraitDetails.Method}</span>
  const subTitle = (
    <Typography.Text
      style={{ maxWidth: 200, color: '#FF862E' }}
      ellipsis={{ tooltip: apiPortraitDetails.Api }}
    >
      {apiPortraitDetails.Api}
    </Typography.Text>
  )

  return (
    <ProCard className={styles.apiInfoPanels} gutter={24} ghost>
      <ProCard
        colSpan={12}
        title={title}
        subTitle={subTitle}
        headStyle={{ padding: '24px' }}
        bodyStyle={{
          padding: '24px',
          paddingTop: 0,
          height: 160,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div className={styles.infoItem}>
          <div className={styles.itemLabel}>请求量：</div>
          <div className={styles.itemValue}>{apiPortraitDetails.TrafficCount}</div>
        </div>
        <div className={styles.infoItem}>
          <div className={styles.itemLabel}>标签数量：</div>
          <div className={styles.itemValue}>{apiPortraitDetails.TagsCount}</div>
        </div>
        <div className={styles.infoItem}>
          <div className={styles.itemLabel}>发现时间：</div>
          <div className={styles.itemValue}>
            {moment(apiPortraitDetails.FoundAt).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        </div>
        <div className={styles.infoItem}>
          <div className={styles.itemLabel}>活跃时间：</div>
          <div className={styles.itemValue}>
            {moment(apiPortraitDetails.ActivedAt).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        </div>
        <div className={styles.infoItem}>
          <div className={styles.itemLabel}>所属应用：</div>
          <div className={styles.itemValue}>
            <Applications apps={apiPortraitDetails.Apps} />
          </div>
        </div>
      </ProCard>
      <ProCard colSpan={12}>
        <Row gutter={24}>
          <Col span={12}>
            <div style={{ height: 185, width: '100%' }}>
              {fullEvents.length ? (
                <RingChart data={fullEvents} sumText="安全事件" color={color} />
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: 0, paddingTop: 50 }} />
              )}
            </div>
          </Col>
          <Col span={12}>
            <div style={{ height: 185, width: '100%' }}>
              {fullEntities.length ? (
                <RingChart
                  data={fullEntities}
                  sumText="敏感数据"
                  color={[
                    ...color,
                    '#FBBF24',
                    '#22D3EE',
                    '#D946EF',
                    '#A855F7',
                    '#8B5CF6',
                    '#6366F1',
                    '#EC4899',
                  ]}
                />
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: 0, paddingTop: 50 }} />
              )}
            </div>
          </Col>
        </Row>
      </ProCard>
    </ProCard>
  )
}
