import { useState, useEffect } from 'react'
import { Input, Space, Button, Pagination, Popover, Tag, Modal, message } from 'antd'
import styles from './TableTabs.less'
import { useLocation, Link } from 'umi'
import moment from 'moment'
import { SeverityMap, StatusMap } from '@/constant/content.js'
import { getApiIssues, modifyApiIssueStatus } from '@/services/apiPortrait'
import ProTable from '@ant-design/pro-table'

const { Search } = Input

export default function TableIssues() {
  const [data, setData] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [PageNum, setPageNum] = useState(1)
  const [PageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [selectedRecords, setSelectedRecords] = useState([])
  const location = useLocation()
  const { query } = location
  const [loading, setLoading] = useState(false)

  const columns = [
    {
      title: '漏洞名称',
      dataIndex: 'IssueName',
    },
    {
      title: '威胁等级',
      dataIndex: 'Severity',
      render: (Severity) => {
        let color = 'green'
        switch (Severity) {
          case 'High':
            color = 'red'
            break
          case 'Medium':
            color = 'yellow'
            break
          case 'Low':
            color = 'blue'
            break
        }
        return (
          <Tag style={{ border: 0 }} color={color}>
            {SeverityMap[Severity]}
          </Tag>
        )
      },
    },
    {
      title: '状态',
      dataIndex: 'Status',
      render: (Status) => {
        return <div>{StatusMap[Status]}</div>
      },
    },
    {
      title: '最新时间',
      dataIndex: 'UpdatedAt',
      render: (UpdatedAt) => moment(UpdatedAt).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'URL',
      dataIndex: 'Url',
      ellipsis: true,
    },
    {
      title: '影响应用',
      dataIndex: 'Apps',
      render: (_, row) => {
        const { Apps = [] } = row
        const length = Apps.length
        const appList = () => {
          return (
            <div>
              {Apps.map((item) => {
                return (
                  <Link
                    key={item.AppId}
                    className={styles.applist}
                    to={`/assets/api/app?appId=${item.AppId}`}
                  >
                    {item.Name}
                  </Link>
                )
              })}
            </div>
          )
        }

        return (
          <Popover title="应用列表" content={length === 0 ? '无' : appList} trigger="click">
            <Button>{`${length} Apps`}</Button>
          </Popover>
        )
      },
    },
  ]

  const fetchData = async () => {
    setLoading(true)
    const { Api } = query
    const {
      Code,
      Data: { Total, Issues },
    } = await getApiIssues({ Api, Search: searchValue, PageNum, PageSize })
    if (Code !== 'Succeed') return

    setLoading(false)
    setTotal(Total)
    setData(Issues)
    setSelectedRecords([])
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, searchValue, PageNum, PageSize])

  const onModifyStatus = (targetStatus) => {
    const len = selectedRecords.length
    if (!len) return

    const title = (
      <div>
        确认将
        <span style={{ color: '#1890FF', margin: '0 4px' }}>{len}</span>
        条数据的状态修改为
        <span style={{ color: '#1890FF', margin: '0 4px' }}>{StatusMap[targetStatus]}</span>
        吗？
      </div>
    )

    Modal.confirm({
      title,
      width: 480,
      closable: true,
      onOk: async () => {
        const IssueIds = selectedRecords.map((e) => e.IssueId)
        const { Code } = await modifyApiIssueStatus({
          IssueIds,
          Status: targetStatus,
        })
        if (Code !== 'Succeed') return

        message.success(`成功将 ${len} 条数据状态修改为 ${StatusMap[targetStatus]}`)
        fetchData()
      },
    })
  }

  return (
    <>
      <Search
        placeholder="请输入关键词查询"
        onSearch={(value) => setSearchValue(value)}
        enterButton
      />
      <ProTable
        rowKey="Index"
        toolBarRender={false}
        search={false}
        loading={loading}
        style={{ margin: '16px 0' }}
        pagination={false}
        columns={columns}
        dataSource={data}
        rowSelection={{
          selectedRowKeys: selectedRecords.map((e) => e.Index),
          onChange: (_, selectedRows) => {
            setSelectedRecords(selectedRows)
          },
        }}
      />
      <div className={styles.footer}>
        <Space>
          <Button onClick={() => onModifyStatus('Whited')}>加白名单</Button>
          <Button onClick={() => onModifyStatus('Ignored')}>忽略</Button>
          <Button onClick={() => onModifyStatus('FalsePositive')}>误报</Button>
          <Button onClick={() => onModifyStatus('Disposed')}>手动处理</Button>
        </Space>
        <Pagination
          current={PageNum}
          pageSize={PageSize}
          showQuickJumper
          showSizeChanger
          pageSizeOptions={[10, 20]}
          total={total}
          onChange={(page, pageSize) => {
            setPageNum(page)
            setPageSize(pageSize)
          }}
        />
      </div>
    </>
  )
}
