import { useState } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import CategoriesTree from '@/components/Classification/CategoriesTree'
import Overview from '@/components/Classification/Overview'

export default function Classification() {
  const [categoryIds, setCategoryIds] = useState('')
  const [topLevelList, setTopLevelList] = useState([])
  const onSelected = (ids) => setCategoryIds(ids.join(','))
  const getTopLevelList = (topList) => setTopLevelList(topList)
  const [flagNumber, setFlagNumber] = useState(1)
  const refreshCategories = () => setFlagNumber(flagNumber + 1)

  return (
    <PageContainer header={{ title: null }}>
      <ProCard bodyStyle={{ padding: 0 }}>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '26%', maxWidth: 400 }}>
            <CategoriesTree
              onSelected={onSelected}
              getTopLevelList={getTopLevelList}
              flagNumber={flagNumber}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Overview
              CategoryIds={categoryIds}
              topLevelList={topLevelList}
              refreshCategories={refreshCategories}
            />
          </div>
        </div>
      </ProCard>
    </PageContainer>
  )
}
