import React from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import AppDetailCard from './appDetailCard'
import ApiAssets from './apiAssets'
import { history, useLocation } from 'umi'

export default function AppDetails() {
  const location = useLocation()
  const {
    query: { appId },
  } = location

  return (
    <PageContainer onBack={() => history.goBack()} header={{ title: null }}>
      <AppDetailCard appId={appId} />
      <ApiAssets />
    </PageContainer>
  )
}
