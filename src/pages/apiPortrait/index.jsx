import { PageContainer } from '@ant-design/pro-layout'
import { history } from 'umi'
import ApiInfoPanels from '@/components/ApiPortrait/ApiInfoPanels'
import TrafficTrends from '@/components/ApiPortrait/TrafficTrends'
import TableTabs from '@/components/ApiPortrait/TableTabs'

export default function ApiPortrait() {
  return (
    <PageContainer onBack={() => history.goBack()} header={{ title: null }}>
      <ApiInfoPanels />
      <TrafficTrends />
      <TableTabs />
    </PageContainer>
  )
}
