import React from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import AppListCard from './appListCard'
import ApiAssets from './apiAssets'

export default class AssetManagement extends React.Component {
  render() {
    return (
      <PageContainer header={{ title: null }}>
        <AppListCard />
        <ApiAssets />
      </PageContainer>
    )
  }
}
