import { useState, useRef, forwardRef } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import IdentificationSwitch from './identificationSwitch'
import UrlIgnores from './urlIgnores'
import AlarmTesting from './alarmTesting'
import { Tabs, Button } from 'antd'
import styles from './index.less'
import StrategyModal from './StrategyModal'
import DetectRuleModal from '@/components/Strategy/DetectRuleModal'

const { TabPane } = Tabs
const MyUrlIgnores = forwardRef(UrlIgnores)
const MyAlarmTesting = forwardRef(AlarmTesting)
const MyStrategyModal = forwardRef(StrategyModal)
const MyIdentificationSwitch = forwardRef(IdentificationSwitch)
const MyDetectRuleModal = forwardRef(DetectRuleModal)

export default function Strategy() {
  const fancyButtonRef = useRef()
  const safeEventRef = useRef()
  const strategyModalRef = useRef()
  const strategysRef = useRef()
  const safeEventModalRef = useRef()
  const [tabKey, setTabKey] = useState('Switch')
  const [strategyRow, setStrategyRow] = useState({})
  const [safeEventRow, setSafeEventRow] = useState({})
  const addIgnore = () => {
    fancyButtonRef.current.addIgnores()
  }
  const changeTabs = (key) => {
    setTabKey(key)
  }
  const creatTestEvent = () => {
    safeEventRef.current.addTestEvent()
  }

  const strategyCreateButton = (
    <Button
      type="primary"
      onClick={() => {
        setStrategyRow({})
        strategyModalRef.current.setVisible(true)
      }}
    >
      创建自定义敏感数据
    </Button>
  )
  const refreshStrategys = () => {
    strategysRef.current.fetchStrategys()
  }

  const refreshSafeEvents = () => {
    safeEventRef.current.fetchSafeEvents()
  }

  return (
    <PageContainer header={{ title: null }}>
      <ProCard bodyStyle={{ paddingTop: 12 }}>
        <Tabs
          defaultActiveKey="IdentificationStrategy"
          size="large"
          tabBarExtraContent={
            tabKey === 'alarmTesting' ? (
              <Button
                type="primary"
                onClick={() => {
                  setSafeEventRow({})
                  safeEventModalRef.current.setVisible(true)
                }}
              >
                创建自定义检测事件
              </Button>
            ) : (
              strategyCreateButton
            )
          }
          onChange={changeTabs}
        >
          <TabPane tab="隐私数据识别策略" key="IdentificationStrategy">
            <Tabs
              defaultActiveKey="Switch"
              tabBarExtraContent={
                tabKey === 'URLIgnores' && (
                  <Button type="link" style={{ marginRight: 20, fontSize: 30 }} onClick={addIgnore}>
                    +
                  </Button>
                )
              }
              onChange={changeTabs}
            >
              <TabPane tab="策略开关" key="Switch">
                <MyIdentificationSwitch
                  ref={strategysRef}
                  onEditRow={(row) => {
                    setStrategyRow(row)
                    strategyModalRef.current.setVisible(true)
                  }}
                />
              </TabPane>
              <TabPane tab="URL忽略列表" key="URLIgnores">
                <MyUrlIgnores ref={fancyButtonRef} />
              </TabPane>
            </Tabs>
          </TabPane>
          <TabPane tab="告警检测列表" key="alarmTesting">
            <MyAlarmTesting
              ref={safeEventRef}
              onEditRow={(row) => {
                setSafeEventRow(row)
                safeEventModalRef.current.setVisible(true)
              }}
            />
          </TabPane>
        </Tabs>
      </ProCard>
      <MyStrategyModal
        ref={strategyModalRef}
        refreshStrategys={refreshStrategys}
        record={strategyRow}
      />
      <MyDetectRuleModal
        ref={safeEventModalRef}
        refreshSafeEvents={refreshSafeEvents}
        record={safeEventRow}
      />
    </PageContainer>
  )
}
