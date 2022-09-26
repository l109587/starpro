/* eslint-disable no-param-reassign */
import { useState, useEffect } from 'react'
import {
  Input,
  Tabs,
  Button,
  Space,
  Pagination,
  Modal,
  Typography,
  Select,
  Tree,
  message,
  Tooltip,
} from 'antd'
import { history, useSelector } from 'umi'
import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import ProTable from '@ant-design/pro-table'
import styles from './index.less'
import { getApis, getIPs } from '@/services/multiDimensionalPortrait'
import { getTopLevelCategories, getCategories, addApisToCategory } from '@/services/categories'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import { FileAddOutlined } from '@ant-design/icons'
import Applications from '@/components/Common/Applications'
import StaticPanel from './components/StaticPanel'

const { Search } = Input
const { TabPane } = Tabs
const { Option } = Select

export default function MultiDimensionalPortrait() {
  const [dataSource, setDataSource] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [PageNum, setPageNum] = useState(1)
  const [PageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [selectedRecords, setSelectedRecords] = useState([])
  const [topList, setTopList] = useState([])
  const [assignModalVisible, setAssignModalVisible] = useState(false)
  const [activeKey, setActiveKey] = useState('api')
  const [ipSearchValue, setIpSearchValue] = useState('')
  const [apiLoading, setApiLoading] = useState(false)
  const [ipPageNum, setIpPageNum] = useState(1)

  const columns = [
    {
      title: 'API',
      dataIndex: 'Api',
      width: 200,
      render: (Api) => {
        return (
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => {
              history.push({
                pathname: '/assets/portraits/api',
                query: {
                  Api,
                },
              })
            }}
          >
            <Typography.Text
              style={{
                maxWidth: 200,
                color: '#1890ff',
              }}
              ellipsis={{ tooltip: Api }}
            >
              {Api}
            </Typography.Text>
          </Button>
        )
      },
    },
    {
      title: '请求方法',
      dataIndex: 'Method',
    },
    {
      title: '请求量',
      dataIndex: 'TrafficCount',
    },
    {
      title: '数据标签',
      dataIndex: 'TagsCount',
    },
    {
      title: '安全等级',
      dataIndex: 'Level',
    },
    {
      title: '类别',
      dataIndex: 'Category',
      // render: (val) => val.map(({ Name }) => Name).join(', '),
      render: (val) => (
        <span>{val.length > 0 ? val.map(({ Name }) => Name).join(', ') : <span>-</span>}</span>
      ),
    },
    {
      title: '所属应用',
      dataIndex: 'Apps',
      render: (Apps = []) => <Applications apps={Apps} />,
    },
    {
      title: '活跃时间',
      dataIndex: 'ActivedAt',
      render: (dateTime) => moment(dateTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: <span style={{ paddingRight: 24 }}>操作</span>,
      dataIndex: 'ApiId',
      align: 'right',
      render: (_, record) => {
        return (
          <Space style={{ paddingRight: 24 }}>
            <Tooltip placement="top" title="加入分类" mouseLeaveDelay={0}>
              <Button
                type="link"
                icon={<FileAddOutlined />}
                onClick={() => {
                  setSelectedRecords([record])
                  setAssignModalVisible(true)
                }}
              />
            </Tooltip>
          </Space>
        )
      },
    },
  ]

  useEffect(() => {
    const fetchTopLevelCategories = async () => {
      const {
        Code,
        Data: { Categories },
      } = await getTopLevelCategories()
      if (Code !== 'Succeed') return

      setTopList(Categories)
    }

    fetchTopLevelCategories()
  }, [])

  const fetchApis = async () => {
    setApiLoading(true)
    const {
      Code,
      Data: { ApiTotal, Apis },
    } = await getApis({ Search: searchValue, PageNum, PageSize })
    if (Code !== 'Succeed') return

    setApiLoading(false)
    setDataSource(Apis)
    setTotal(ApiTotal)
  }

  useEffect(() => {
    fetchApis()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, PageNum, PageSize])

  const onAssignModalChange = (flag) => setAssignModalVisible(flag)

  const onAssignSuccess = () => fetchApis()

  return (
    <PageContainer header={{ title: null }}>
      <ProCard bodyStyle={{ paddingTop: 12 }}>
        <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
          <TabPane
            tab={<span style={{ fontSize: 16, fontWeight: 500 }}>API维度</span>}
            key="api"
            forceRender
          >
            <StaticPanel Type="api" />
            <Search
              placeholder="请输入关键词查询API"
              key="api"
              enterButton
              style={{
                marginBottom: 4,
              }}
              onSearch={(value) => {
                setPageNum(1)
                setSearchValue(value)
              }}
            />
            <ProTable
              columns={columns}
              dataSource={dataSource}
              toolBarRender={false}
              search={false}
              rowKey="Index"
              style={{ margin: '8px 0' }}
              pagination={false}
              loading={apiLoading}
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
                <Button
                  type="primary"
                  ghost
                  onClick={() => {
                    if (!selectedRecords.length) return
                    setAssignModalVisible(true)
                  }}
                >
                  加入分类
                </Button>
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
            <AssignCategoryModal
              topLevelList={topList}
              apiRecords={selectedRecords}
              assignVisible={assignModalVisible}
              onVisibleChange={onAssignModalChange}
              onAssignSuccess={onAssignSuccess}
            />
          </TabPane>
          <TabPane
            tab={<div style={{ padding: '0 10px', fontSize: 16, fontWeight: 500 }}>IP维度</div>}
            key="ip"
          >
            <StaticPanel Type="ip" />
            <Search
              placeholder="请输入关键词查询IP"
              key="ip"
              enterButton
              style={{
                marginBottom: 4,
              }}
              onSearch={(value) => {
                setIpPageNum(1)
                setIpSearchValue(value)
              }}
            />
            <IPTable searchValue={ipSearchValue} PageNum={ipPageNum} setPageNum={setIpPageNum} />
          </TabPane>
        </Tabs>
      </ProCard>
    </PageContainer>
  )
}

function IPTable({ searchValue, PageNum, setPageNum }) {
  const [PageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [dataSource, setDataSource] = useState([])
  const [ipLoading, setIpLoading] = useState(false)
  const networkTypeMap = {
    intranet: '私网',
    internet: '公网',
  }

  const columns = [
    {
      title: <span style={{ paddingLeft: 24 }}>IP</span>,
      dataIndex: 'Ip',
      render: (Ip) => {
        return (
          <Button
            type="link"
            style={{ padding: 0, paddingLeft: 24 }}
            onClick={() => {
              history.push({
                pathname: '/assets/portraits/ip',
                query: {
                  Ip,
                },
              })
            }}
          >
            {Ip}
          </Button>
        )
      },
    },
    {
      title: '网络类型',
      dataIndex: 'NetworkType',
      render: (type) => networkTypeMap[type] || '-',
    },
    {
      title: '请求量',
      align: 'right',
      width: 120,
      dataIndex: 'RequestsCount',
    },
    {
      title: '数据标签',
      align: 'right',
      width: 140,
      dataIndex: 'TagsCount',
    },
    {
      title: '访问应用',
      dataIndex: 'Apps',
      render: (Apps = []) => <Applications apps={Apps} />,
    },
    {
      title: <span style={{ paddingRight: 24 }}>活跃时间</span>,
      dataIndex: 'ActivedAt',
      width: 200,
      align: 'right',
      render: (dateTime) => (
        <span style={{ paddingRight: 24 }}>{moment(dateTime).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      setIpLoading(true)
      const {
        Code,
        Data: { IpTotal, Ips },
      } = await getIPs({ Search: searchValue, PageNum, PageSize })
      if (Code !== 'Succeed') return

      setIpLoading(false)
      setTotal(IpTotal)
      setDataSource(Ips)
    }

    fetchData()
  }, [searchValue, PageNum, PageSize])

  const pagination = {
    total: total,
    current: PageNum,
    pageSize: PageSize,
    pageSizeOptions: [10, 20],
    showQuickJumper: true,
    style: { paddingTop: 10 },
    onChange: (page, pageSize) => {
      setPageNum(page)
      setPageSize(pageSize)
    },
  }

  return (
    <>
      <ProTable
        columns={columns}
        dataSource={dataSource}
        toolBarRender={false}
        search={false}
        rowKey="Index"
        style={{ margin: '8px 0' }}
        loading={ipLoading}
        pagination={false}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination {...pagination} />
      </div>
    </>
  )
}

const convertData = (data) => {
  data.forEach((item) => {
    item.key = item.CategoryId
    item.title = item.CategoryName
    if (item.ChildrenList && item.ChildrenList.length) {
      item.children = item.ChildrenList
      delete item.ChildrenList
      convertData(item.children)
    } else {
      delete item.ChildrenList
      item.isLeaf = true
    }
  })
}

// API等级枚举
const ApiLevelEnum = [
  { value: 'C1', label: 'C1' },
  { value: 'C2', label: 'C2' },
  { value: 'C3', label: 'C3' },
  { value: 'C4', label: 'C4' },
  { value: 'C5', label: 'C5' },
]

function AssignCategoryModal({
  topLevelList,
  apiRecords,
  assignVisible,
  onVisibleChange,
  onAssignSuccess,
}) {
  const len = apiRecords.length
  const [treeData, setTreeData] = useState([])
  const [Level, setLevel] = useState('C1')
  const [categoryId, setCategoryId] = useState(null)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const theme = useSelector(({ global }) => global.theme)

  useEffect(() => {
    const initTreeData = cloneDeep(topLevelList).map((e) => {
      e.title = e.CategoryName
      e.key = e.CategoryId
      e.isLeaf = false

      return e
    })

    setTreeData(initTreeData)
  }, [topLevelList])

  const updateTreeData = (list, CategoryId, children) => {
    return list.map((node) => {
      if (node.CategoryId === CategoryId) {
        return { ...node, children }
      }

      if (node.children) {
        return { ...node, children: updateTreeData(node.children, CategoryId, children) }
      }

      return node
    })
  }
  const onLoadData = ({ CategoryId, children }) => {
    return new Promise((resolve) => {
      if (children) return resolve()

      getCategories({ CategoryId }).then(({ Code, Data: { Categories } }) => {
        if (Code !== 'Succeed') return

        const categoryList = Categories[0]?.ChildrenList || []
        convertData(categoryList)

        setTreeData((origin) => updateTreeData(origin, CategoryId, categoryList))
        resolve()
      })
    })
  }

  const onOk = async () => {
    if (!categoryId) return

    setConfirmLoading(true)

    const { Code } = await addApisToCategory({
      CategoryId: categoryId,
      Apis: apiRecords.map((e) => e.Api),
      Level: [Level],
    })
    if (Code !== 'Succeed') return

    message.success('加入分类中...')
    onVisibleChange(false)
    setConfirmLoading(false)
    onAssignSuccess()
  }
  const darkStyle = {
    treeTitle: {
      backgroundColor: '#1D1D42',
      color: '#fff',
    },
  }
  const styleSheet = theme === 'dark' ? darkStyle : {}

  return (
    <Modal
      title={len === 1 ? '加入类别' : '批量加入类别'}
      visible={assignVisible}
      confirmLoading={confirmLoading}
      destroyOnClose
      width={480}
      onOk={onOk}
      onCancel={() => onVisibleChange(false)}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <Typography.Text
          ellipsis={{ tooltip: len === 1 ? apiRecords[0].Api : `批量选中${len}条数据` }}
          style={{ color: '#1890FF', width: 284 }}
        >
          {len === 1 ? apiRecords[0].Api : `批量选中${len}条数据`}
        </Typography.Text>
        <label>
          <span style={{ margin: '0 8px' }}>安全等级</span>
          <Select
            value={Level}
            style={{ width: 76 }}
            size="small"
            onChange={(value) => setLevel(value)}
          >
            {ApiLevelEnum.map(({ value, label }) => (
              <Option value={value} key={value}>
                {label}
              </Option>
            ))}
          </Select>
        </label>
      </div>
      <div className={styles.treeWrapper}>
        <div className={styles.treeHeader} style={{ ...styleSheet.treeTitle }}>
          类别层级:
        </div>
        <Tree
          height={256}
          virtual={false}
          treeData={treeData}
          loadData={onLoadData}
          style={{ padding: '8px 10px' }}
          onSelect={(selectedKeys) => setCategoryId(selectedKeys[0])}
        />
      </div>
    </Modal>
  )
}
