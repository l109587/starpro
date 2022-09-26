import { useState, useEffect, useRef } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import { Empty, Button, Table, Badge, Menu, Dropdown, Pagination, message, Modal } from 'antd'
import { PlusOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import ConfigModal from '@/components/AlarmPush/ConfigModal'
import moment from 'moment'
import { alarmSwitch, getReports, alarmDelete, alarmPushTest } from '@/services/alarmPush'
import styles from './index.less'

const { confirm } = Modal

const AlarmPush = () => {
  const configModalRef = useRef(null)
  const [hasData, setHasData] = useState(true)
  // type will be 'create' or 'update'
  const [type, setType] = useState('')
  const [dataList, setDataList] = useState([])
  const [PageNum, setPageNum] = useState(1)
  const [PageSize, setPageSize] = useState(10)
  const [SortMethod, setSortMethod] = useState('')
  const [SortColumn, setSortColumn] = useState('')
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [currentReport, setCurrentReport] = useState({})

  const fetchReports = async () => {
    setLoading(true)
    const {
      Code,
      Data: { Total, Reports },
    } = await getReports({ PageNum, PageSize, SortMethod, SortColumn })
    if (Code !== 'Succeed') return

    setLoading(false)
    setTotal(Total)
    setDataList(Reports)
    setHasData(Total > 0)
  }

  useEffect(() => {
    fetchReports()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PageNum, PageSize, SortMethod, SortColumn])

  const toUpdate = (record) => {
    setCurrentReport(record)
    setType('update')
    configModalRef.current.setVisible(true)
  }

  const setAlarmSwitch = async (State, ReportId) => {
    const { Code } = await alarmSwitch({ State, ReportId })
    if (Code !== 'Succeed') return

    const stateMap = {
      open: '启用',
      close: '禁用',
    }
    message.success(`${stateMap[State]}成功`)
    fetchReports()
  }

  const onAlarmDelete = (ReportId) => {
    confirm({
      title: '确认删除这条告警推送策略?',
      icon: <ExclamationCircleOutlined />,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        const { Code } = await alarmDelete({ ReportId })
        if (Code !== 'Succeed') return

        message.success('删除成功')
        fetchReports()
      },
    })
  }

  const pushTest = async (ReportId) => {
    const { Code } = await alarmPushTest({ ReportId })
    if (Code !== 'Succeed') return

    message.success('推送测试数据成功')
  }

  const onAction = (key, record) => {
    if (key === 'update') return toUpdate(record)
    if (key === 'disabled') return setAlarmSwitch('close', record.ReportId)
    if (key === 'enable') return setAlarmSwitch('open', record.ReportId)
    if (key === 'delete') return onAlarmDelete(record.ReportId)
    if (key === 'push') return pushTest(record.ReportId)
  }

  const columns = [
    {
      title: '序号',
      width: 70,
      render: (val, record, index) => (PageNum - 1) * 10 + index + 1,
    },
    {
      title: '推送策略名称',
      dataIndex: 'Name',
    },
    {
      title: '状态',
      dataIndex: 'Status',
      width: 90,
      render: (val) => {
        const statusMap = {
          ToEnable: <Badge status="warning" text="待启用" />,
          Disabled: (
            <Badge status="error" text={<span style={{ color: '#7a7a7a' }}>已禁用</span>} />
          ),
          Enabling: <Badge status="success" text="启用中" />,
        }

        return statusMap[val] || '-'
      },
    },
    {
      title: '创建者',
      dataIndex: 'Creator',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'CreatedAt',
      sorter: true,
      render: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: '推送量',
      dataIndex: 'EventCount',
      sorter: true,
      align: 'right',
      width: 140,
      render: (val, { PushType }) => (PushType.includes('Kafka') ? '-' : val),
    },
    {
      title: '最新推送时间',
      dataIndex: 'UpdatedAt',
      sorter: true,
      render: (val) => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '-'),
    },
    {
      title: '推送类型',
      dataIndex: 'PushType',
      width: 150,
      render: (val) => val.sort().join(' & '),
    },
    {
      title: '收件人',
      dataIndex: 'Receiver',
      render: (val) => val.sort().join(' & '),
    },
    {
      title: '管理',
      dataIndex: 'ReportId',
      width: 130,
      render: (_, record) => {
        const menu = (
          <Menu onClick={({ key }) => onAction(key, record)}>
            {record.Status === 'Enabling' ? (
              <Menu.Item key="disabled">禁用</Menu.Item>
            ) : (
              <Menu.Item key="enable">启用</Menu.Item>
            )}
            <Menu.Item key="push">推送测试数据</Menu.Item>
            <Menu.Item key="update">修改配置</Menu.Item>
            <Menu.Item key="delete" style={{ color: 'red' }}>
              删除
            </Menu.Item>
          </Menu>
        )

        return (
          <Dropdown overlay={menu}>
            <Button type="link">
              操作 <DownOutlined />
            </Button>
          </Dropdown>
        )
      },
    },
  ]

  const onTableChange = (pagination, filters, { field, order }) => {
    setSortMethod((order || '').replace('end', ''))
    setSortColumn(order ? field : '')
  }

  const mainContent = (
    <div>
      <div style={{ textAlign: 'right', marginBottom: 20 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setType('create')
            configModalRef.current.setVisible(true)
          }}
        >
          新建推送策略
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={dataList}
        pagination={false}
        loading={loading}
        rowKey="ReportId"
        onChange={onTableChange}
      />
      <div className={styles.tableFooter}>
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
    </div>
  )

  const emptyContent = (
    <div className={styles.emptyWrapper}>
      <Empty
        image={require('@/assets/empty.svg')}
        imageStyle={{
          height: 60,
        }}
        description={
          <span style={{ color: '#747474', fontSize: 12 }}>您还没有创建告警推送呦～</span>
        }
      >
        <Button
          type="primary"
          onClick={() => {
            setType('create')
            configModalRef.current.setVisible(true)
          }}
        >
          新建告警推送
        </Button>
      </Empty>
    </div>
  )

  const onSuccess = () => {
    fetchReports()
  }

  return (
    <PageContainer header={{ title: null }}>
      <ProCard>{hasData ? mainContent : emptyContent}</ProCard>
      <ConfigModal ref={configModalRef} type={type} record={currentReport} success={onSuccess} />
    </PageContainer>
  )
}

export default AlarmPush
