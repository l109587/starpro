import { PageContainer } from '@ant-design/pro-layout'
import { history } from 'umi'
import IpInfoPanels from '@/components/IpPortrait/IpInfoPanels'
import RequestTrends from '@/components/IpPortrait/RequestTrends'
import TableTabs from '@/components/IpPortrait/TableTabs'

export default function IPPortrait() {
  return (
    <PageContainer onBack={() => history.goBack()} header={{ title: null }}>
      <IpInfoPanels />
      <RequestTrends />
      <TableTabs />
    </PageContainer>
  )
}
