import { useState } from 'react'
import ProCard from '@ant-design/pro-card'
import TableTags from './TableTags'
// import TableRisks from './TableRisks'
import TableEvents from './TableEvents'

export default function TableTabs() {
  const [activeKey, setActiveKey] = useState('event')

  return (
    <ProCard
      tabs={{
        activeKey,
        tabBarStyle: { paddingLeft: 8 },
        onChange: (key) => setActiveKey(key),
      }}
    >
      <ProCard.TabPane key="event" tab="安全风险" forceRender>
        <TableEvents />
      </ProCard.TabPane>
      <ProCard.TabPane key="tag" tab="数据标签" forceRender>
        <TableTags />
      </ProCard.TabPane>
    </ProCard>
  )
}
