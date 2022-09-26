import { useState, useEffect } from 'react'
import { Tabs, Empty, Row, Col, Typography } from 'antd'
import {
  EllipsisOutlined,
  FallOutlined,
  CloudOutlined,
  FieldTimeOutlined,
  SwapOutlined,
  ProfileOutlined,
} from '@ant-design/icons'
import TabContent from './tabContent'
import styles from './apiDetail.less'
import { useIntl, Link, useSelector } from 'umi'
import { getApiDetailsInfo } from '@/services/assets'
import moment from 'moment'
import ProCard from '@ant-design/pro-card'
import RingChart from './RingChart'
import DataTag from '@/components/Common/DataTag'
import { getAppApiUrlTagsClustered, getAppApiUrlTagEntitiesClustered } from '@/services/assets'
import { getAPIOverview } from '@/services/statistics'
import { SeverityMap } from '@/constant/content'

const { TabPane } = Tabs

export default function ApiDetail({ apiConfig }) {
  const theme = useSelector(({ global }) => global.theme)
  const [tabKey, setTabkey] = useState('req')
  const [apiDetail, setApiDetail] = useState({})
  const [fullEvents, setFullEvents] = useState([])
  const [fullEntities, setFullEntities] = useState([])
  const intl = useIntl()
  const { AppId, Api } = apiConfig
  const apiTabs = [
    {
      key: 'req',
      name: intl.formatMessage({ id: 'component.api.detail.tabpane.req' }),
    },
    {
      key: 'res',
      name: intl.formatMessage({ id: 'component.api.detail.tabpane.res' }),
    },
  ]
  const secondApiTabs = [
    {
      key: 'event',
      name: '安全风险',
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { Code, Data } = await getApiDetailsInfo({
          Api: Api.includes('http://') ? Api : `http://${Api}`,
        })
        if (Code !== 'Succeed') return

        setApiDetail({ ...Data, Api })
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [Api])

  const fetchAPIOverview = async () => {
    try {
      const {
        Code,
        Data: { FullEvents, FullEntities },
      } = await getAPIOverview({ API: apiConfig.Api })
      if (Code !== 'Succeed') return

      const FullEvent = FullEvents.filter((i) => i.Key !== 'Total')
      setFullEvents(FullEvent.map(({ Key, ...rest }) => ({ Key: SeverityMap[Key], ...rest })))

      const list = FullEntities.sort((a, b) => b.Count - a.Count)
      const top3 = list.slice(0, 3)
      const rest = list.slice(3)
      if (rest.length) {
        const sum = rest.reduce((prev, current) => (current.Count ? prev + current.Count : prev), 0)
        const obj = {
          Key: '其他',
          Count: sum,
        }
        top3.push(obj)
      }
      setFullEntities(top3)
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    fetchAPIOverview()
  }, [])
  const SecurityEvent = () => {
    const color = ['#ff244c', '#ff6b00', '#6fcf97', '#524EEE']

    return fullEvents.length ? (
      <RingChart data={fullEvents} sumText="安全事件" color={color} />
    ) : (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    )
  }
  const SensitiveData = () => {
    const color = ['#ff244c', '#ff6b00', '#6fcf97', '#524EEE', '#9390F4', '#A9A7F7', '#9390F4']

    return fullEntities.length ? (
      <RingChart data={fullEntities} sumText="敏感数据" color={color} />
    ) : (
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    )
  }
  const darkStyle = {
    wrapper: {
      border: '2px solid rgba(186, 208, 241, 0.1)',
      backgroundColor: '#26264E',
    },
    inWrapper: {
      backgroundColor: '#26264E',
    },
    name: {
      color: 'rgba(255, 255, 255, 0.6)',
    },
    data: {
      color: 'rgba(255, 255, 255, 0.87)',
    },
  }
  const lightStyle = {
    wrapper: {
      backgroundColor: '#F7F7FF',
    },
    inWrapper: {
      backgroundColor: '#F7F7FF',
    },
    name: {
      color: 'rgba(0, 0, 0, 0.6)',
    },
    data: {
      color: 'rgba(29, 29, 66, 0.87)',
    },
  }
  const styleSheet = theme === 'dark' ? darkStyle : lightStyle
  return (
    <div className={styles.apiDetailWrap}>
      <Row gutter={16} style={{ margin: '16px 24px' }}>
        <Col span={12}>
          <ProCard style={{ ...styleSheet.wrapper }}>
            <div className={styles.baseDeatil}>
              <div className={styles.infoItem}>
                <ProfileOutlined className={styles.baseIcon} style={{ ...styleSheet.name }} />
                <span className={styles.baseName} style={{ ...styleSheet.name }}>
                  协议
                </span>
                <span style={{ ...styleSheet.data }}>{apiDetail.Scheme || '-'}</span>
              </div>
            </div>
            <div className={styles.baseDeatil}>
              <div className={styles.infoItem}>
                <SwapOutlined className={styles.baseIcon} style={{ ...styleSheet.name }} />
                <span className={styles.baseName} style={{ ...styleSheet.name }}>
                  请求方法
                </span>
                <span style={{ ...styleSheet.data }}>{apiDetail.Method?.join(', ') || '-'}</span>
              </div>
            </div>
            <div className={styles.baseDeatil}>
              <div className={styles.infoItem}>
                <CloudOutlined className={styles.baseIcon} style={{ ...styleSheet.name }} />
                <span className={styles.baseName} style={{ ...styleSheet.name }}>
                  主机
                </span>
                <Typography.Text
                  style={{ ...styleSheet.data, maxWidth: '170px' }}
                  ellipsis={{ tooltip: apiDetail.Host }}
                >
                  {apiDetail.Host || '-'}
                </Typography.Text>
              </div>
            </div>
            <div className={styles.baseDeatil}>
              <div className={styles.infoItem}>
                <FallOutlined className={styles.baseIcon} style={{ ...styleSheet.name }} />
                <span className={styles.baseName} style={{ ...styleSheet.name }}>
                  路径
                </span>
                {/* <span style={{ ...styleSheet.data }}>{apiDetail.Path || '-'}</span> */}
                <Typography.Text
                  style={{ ...styleSheet.data, maxWidth: '170px' }}
                  ellipsis={{ tooltip: apiDetail.Path }}
                >
                  {apiDetail.Path || '-'}
                </Typography.Text>
              </div>
            </div>
            <div className={styles.baseDeatil}>
              <div className={styles.infoItem}>
                <FieldTimeOutlined className={styles.baseIcon} style={{ ...styleSheet.name }} />
                <span className={styles.baseName} style={{ ...styleSheet.name }}>
                  首次发现
                </span>
                <span style={{ ...styleSheet.data }}>
                  {moment(apiDetail.CreatedAt).format('YYYY-MM-DD HH:mm:ss')}
                </span>
              </div>
            </div>
            <div className={styles.baseDeatil}>
              <div>
                <FieldTimeOutlined className={styles.baseIcon} style={{ ...styleSheet.name }} />
                <span className={styles.baseName} style={{ ...styleSheet.name }}>
                  最新发现
                </span>
                <span style={{ ...styleSheet.data }}>
                  {moment(apiDetail.RequestdAt).format('YYYY-MM-DD HH:mm:ss')}
                </span>
              </div>
            </div>
          </ProCard>
        </Col>
        <Col span={12}>
          <ProCard
            bodyStyle={{ paddingLeft: 0, width: '100%' }}
            style={{ ...styleSheet.wrapper, height: '220px', width: '100%' }}
            className={styles.chartWrapper}
          >
            <ProCard
              colSpan={12}
              layout="center"
              bodyStyle={{ height: 168, padding: 0, width: '100%' }}
              style={{ ...styleSheet.inWrapper, overflowX: 'hidden' }}
            >
              <div style={{ overflow: 'hidden', width: '100%' }}>
                <SecurityEvent />
              </div>
            </ProCard>
            <ProCard
              colSpan={12}
              layout="center"
              bodyStyle={{ height: 168, padding: 0, width: '100%' }}
              style={{ ...styleSheet.inWrapper, overflowX: 'hidden' }}
            >
              <div style={{ overflow: 'hidden', width: '100%' }}>
                <SensitiveData />
              </div>
            </ProCard>
          </ProCard>
        </Col>
      </Row>

      <div className={styles.apiTab}>
        <Tabs
          tabBarStyle={{ padding: '0 24px' }}
          activeKey={tabKey}
          onChange={(k) => {
            setTabkey(k)
          }}
        >
          {apiTabs.map((i) => {
            return (
              <TabPane style={{ fontSize: 16 }} tab={i.name} key={i.key}>
                <TabContent name={i.key} data={apiDetail} />
              </TabPane>
            )
          })}
        </Tabs>
        <Tabs tabBarStyle={{ padding: '0 24px' }}>
          {secondApiTabs.map((i) => {
            return (
              <TabPane style={{ fontSize: 16 }} tab={i.name} key={i.key}>
                <TabContent name={i.key} data={apiDetail} />
              </TabPane>
            )
          })}
        </Tabs>
        <div style={{ padding: '24px' }}>
          <div style={{ paddingBottom: '16px', fontWeight: '500' }}>敏感数据</div>
          <DataTag
            Api={Api}
            getTag={getAppApiUrlTagsClustered}
            geTagEntities={getAppApiUrlTagEntitiesClustered}
          />
        </div>
      </div>
    </div>
  )
}
