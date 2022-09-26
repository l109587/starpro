import { useState } from 'react'
import { Input } from 'antd'
import { useLocation } from 'umi'
import { getIpTagsClustered, getIpTagEntitiesClustered } from '@/services/ipPortrait'
import DataTag from '@/components/Common/DataTag'

const { Search } = Input

export default function TableTags() {
  const location = useLocation()
  const { query } = location
  const [searchValue, setSearchValue] = useState('')

  return (
    <>
      <Search
        placeholder="请输入关键词查询"
        enterButton
        onSearch={(value) => {
          setSearchValue(value)
        }}
      />
      <div style={{ marginTop: '16px' }}>
        <DataTag
          Ip={query.Ip}
          searchValue={searchValue}
          getTag={getIpTagsClustered}
          geTagEntities={getIpTagEntitiesClustered}
        />
      </div>
    </>
  )
}
