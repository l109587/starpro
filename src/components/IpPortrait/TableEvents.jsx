import { useState, useEffect } from 'react'
import { Input, Space, Button, Pagination, Tag, Modal, message } from 'antd'
import styles from './TableTabs.less'
import { useLocation } from 'umi'
import moment from 'moment'
import { SeverityMap, StatusMap } from '@/constant/content.js'
import { getIpEvents, modifyIpEventsStatus } from '@/services/ipPortrait'
import ProTable from '@ant-design/pro-table'
import Details from '@/components/secureEvents/detailDraw'
import { GetEventDetails, modifyStatus } from '@/services/secureEvents.js'
import { getLocaleForAPI } from '@/utils/utils'
import Applications from '../Common/Applications'

const { Search } = Input

export default function TableEvents() {
  const [data, setData] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [PageNum, setPageNum] = useState(1)
  const [PageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [selectedRecords, setSelectedRecords] = useState([])
  const location = useLocation()
  const { query } = location
  const [detailsId, setDetailsId] = useState(null)
  const [eventDetails, setEventDetails] = useState({})
  const [detailsDrawerVisible, setDetailsDrawerVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const showDetails = async (id) => {
    const { Code, Data } = await GetEventDetails({ EventId: id, Lang: getLocaleForAPI() })
    if (Code !== 'Succeed') return

    setEventDetails(Data)
    setDetailsId(id)
    setDetailsDrawerVisible(true)
  }

  const columns = [
    {
      title: '事件名称',
      dataIndex: 'EventName',
      render: (EventName, { EventId }) => {
        return (
          <div style={{ cursor: 'pointer', color: '#1890ff' }} onClick={() => showDetails(EventId)}>
            {EventName}
          </div>
        )
      },
    },
    {
      title: '事件等级',
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
      title: '攻击源',
      dataIndex: 'SrcHost',
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
      title: <span style={{ paddingRight: 24 }}>影响应用</span>,
      dataIndex: 'Apps',
      width: 200,
      align: 'right',
      render: (Apps = []) => <Applications apps={Apps} />,
    },
  ]

  const fetchData = async () => {
    setLoading(true)
    const { Ip } = query
    const {
      Code,
      Data: { Total, Events },
    } = await getIpEvents({
      Ip,
      Search: searchValue,
      PageNum,
      PageSize,
      Lang: getLocaleForAPI(),
    })
    if (Code !== 'Succeed') return

    setLoading(false)
    setTotal(Total)
    setData(Events)
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
        const EventIds = selectedRecords.map((e) => e.EventId)
        const { Code } = await modifyIpEventsStatus({
          EventIds,
          Status: targetStatus,
        })
        if (Code !== 'Succeed') return

        message.success(`成功将 ${len} 条数据状态修改为 ${StatusMap[targetStatus]}`)
        fetchData()
      },
    })
  }

  const closeDetailsDarwer = () => setDetailsDrawerVisible(false)
  const modifyEventsStatus = async (ids, status, callback) => {
    const { Code } = await modifyStatus({ EventIds: ids, Status: status })
    if (Code !== 'Succeed') return

    message.success('修改成功！')
    fetchData()
    callback && callback()
  }

  return (
    <>
      <Search
        placeholder="请输入关键词查询"
        enterButton
        onSearch={(value) => {
          setPageNum(1)
          setSearchValue(value)
        }}
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
          columnWidth: 64,
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
      <Details
        details={eventDetails}
        visible={detailsDrawerVisible}
        onClose={closeDetailsDarwer}
        onModifyStatus={modifyEventsStatus}
        id={detailsId}
        title="事件详情"
      />
    </>
  )
}
