/* eslint-disable no-param-reassign */
import { useState, useEffect } from 'react'
import {
  Input,
  Table,
  Button,
  Pagination,
  Space,
  Popover,
  Drawer,
  Tooltip,
  Popconfirm,
  message,
  Modal,
  Typography,
  Tree,
  Select,
  Empty,
  Collapse,
} from 'antd'
import { Link, history, useDispatch, useSelector } from 'umi'
import { FileTextOutlined, DownOutlined, RightOutlined, EllipsisOutlined } from '@ant-design/icons'
import {
  getCategoryApis,
  getUnclassifiedApis,
  getCategoryApiTagsClustered,
  getCategoryApiTagEntitiesClustered,
  deleteCategoryApis,
  getCategories,
  addApisToCategory,
} from '@/services/categories'
import { getApiTagsClustered, getApiTagEntitiesClustered } from '@/services/apiPortrait'
import moment from 'moment'
import { cloneDeep } from 'lodash'
import ProTable from '@ant-design/pro-table'
import styles from './ApiAssets.less'
import IconFont from '../Common/IconFont'
import arrowRight from '@/assets/arrowRight.svg'
import arrowRightWhite from '@/assets/arrowRight_white.svg'
import arrowDown from '@/assets/arrowDown.svg'
import Applications from '../Common/Applications'

const { Search } = Input
const { Option } = Select
const { Panel } = Collapse

export default function ApiAssets({ CategoryIds, topLevelList, refreshCategories }) {
  const [dataSource, setDataSource] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [PageNum, setPageNum] = useState(1)
  const [PageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [visible, setVisible] = useState(false)
  const [drawerParams, setDrawerParams] = useState({})
  const [selectedRecords, setSelectedRecords] = useState([])
  const [assignModalVisible, setAssignModalVisible] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const dispatch = useDispatch()

  const fetchData = async () => {
    if (!CategoryIds) return

    setTableLoading(true)

    let req = getCategoryApis
    if (CategoryIds === '100000') req = getUnclassifiedApis

    const {
      Code,
      Data: { ApiTotal, Apis },
    } = await req({ CategoryIds, Search: searchValue, PageNum, PageSize })
    if (Code !== 'Succeed') return

    setTableLoading(false)
    setTotal(ApiTotal)
    setDataSource(Apis)
    setSelectedRecords([])
    dispatch({
      type: 'classification/getApiTotal',
      payload: {
        apiTotal: ApiTotal,
      },
    })
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CategoryIds, searchValue, PageNum, PageSize])

  const columns = [
    {
      title: 'API',
      dataIndex: 'Api',
      width: 150,
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
                maxWidth: 150,
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
      title: 'API调用量',
      dataIndex: 'TrafficCount',
    },
    {
      title: '数据访问量',
      dataIndex: 'EntitiesCount',
      render: (EntitiesCount, { Api, CategoryId }) => (
        <div>
          <Tooltip placement="top" title="标签详情" mouseLeaveDelay={0}>
            <Button
              type="link"
              icon={<FileTextOutlined style={{ color: '#1890ff' }} />}
              className={styles.tagCateButton}
              onClick={() => {
                setDrawerParams({ Api, CategoryId })
                setVisible(true)
              }}
            />
          </Tooltip>
          <span>{EntitiesCount}</span>
        </div>
      ),
    },
    {
      title: '安全等级',
      dataIndex: 'Level',
    },
    CategoryIds !== '100000'
      ? {
          title: '分类名称',
          dataIndex: 'CategoryName',
        }
      : null,
    {
      title: '所属应用',
      dataIndex: 'Apps',
      render: (Apps = []) => <Applications apps={Apps} />,
    },
    {
      title: '更新时间',
      dataIndex: 'UpdatedAt',
      render: (UpdatedAt) =>
        UpdatedAt !== '-' ? moment(UpdatedAt).format('YYYY-MM-DD HH:mm:ss') : '-',
    },
    {
      title: <span style={{ paddingRight: 24 }}>操作</span>,
      dataIndex: 'Api',
      width: 100,
      align: 'right',
      render: (_, record) => {
        return (
          <Space size={2} style={{ paddingRight: 16 }}>
            <Tooltip placement="top" title="加入分类" mouseLeaveDelay={0}>
              <Button
                type="link"
                icon={<IconFont type="icon-icon_add_16" style={{ fontSize: 18 }} />}
                onClick={() => {
                  setSelectedRecords([record])
                  setAssignModalVisible(true)
                }}
              ></Button>
            </Tooltip>
            {CategoryIds !== '100000' && (
              <Tooltip placement="top" title="删除" mouseLeaveDelay={0}>
                <Popconfirm
                  title="确定要从该类别移除吗？"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={async () => {
                    const { Code } = await deleteCategoryApis({
                      CategoryIds: [record.CategoryId],
                      Apis: [record.Api],
                    })
                    if (Code !== 'Succeed') return

                    message.success('删除成功')
                    fetchData()
                  }}
                >
                  <Button
                    type="link"
                    danger
                    icon={
                      <IconFont type="icon-icon_opeartion_delete_16" style={{ fontSize: 18 }} />
                    }
                  ></Button>
                </Popconfirm>
              </Tooltip>
            )}
          </Space>
        )
      },
    },
  ].filter((col) => col)

  const onClose = () => setVisible(false)

  const onAssignModalChange = (flag) => setAssignModalVisible(flag)

  const onAssignSuccess = () => {
    fetchData()
    refreshCategories()
  }

  return (
    <div className={styles.apiAssets}>
      <div className={styles.title}>API资产</div>
      <div className={styles.dataArea}>
        <Search
          placeholder="请输入API查询"
          enterButton
          onSearch={(value) => {
            setPageNum(1)
            setSearchValue(value)
          }}
        />
        <ProTable
          dataSource={dataSource}
          columns={columns}
          loading={tableLoading}
          toolBarRender={false}
          search={false}
          rowKey="Index"
          style={{ margin: '16px 0' }}
          pagination={false}
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
            {!selectedRecords.length ? (
              <Button>加入分类</Button>
            ) : (
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
            )}

            {CategoryIds !== '100000' && (
              <Button
                danger
                onClick={() => {
                  const len = selectedRecords.length
                  if (!len) return

                  const title = (
                    <div>
                      确定要从该类别移除这
                      <span style={{ color: '#1890FF', margin: '0 4px' }}>{len}</span>个 API
                      资产吗？
                    </div>
                  )

                  Modal.confirm({
                    title,
                    width: 480,
                    closable: true,
                    onOk: async () => {
                      const categoryIds = []
                      const Apis = []
                      selectedRecords.forEach(({ Api, CategoryId }) => {
                        categoryIds.push(CategoryId)
                        Apis.push(Api)
                      })

                      const { Code } = await deleteCategoryApis({
                        CategoryIds: categoryIds,
                        Apis,
                      })
                      if (Code !== 'Succeed') return

                      message.success('删除成功')
                      fetchData()
                    },
                  })
                }}
              >
                删除
              </Button>
            )}
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
      </div>
      <TagCategoryDrawer visible={visible} params={drawerParams} onClose={onClose} />
      <AssignCategoryModal
        topLevelList={topLevelList}
        apiRecords={selectedRecords}
        assignVisible={assignModalVisible}
        onVisibleChange={onAssignModalChange}
        onAssignSuccess={onAssignSuccess}
      />
    </div>
  )
}

function TagCategoryDrawer({ visible, params, onClose }) {
  const [outData, setOutData] = useState([])
  const theme = useSelector(({ global }) => global.theme)
  const outColumns = [
    {
      title: '实体类型',
      dataIndex: 'EntityType',
    },
    {
      title: '数量',
      dataIndex: 'Count',
    },
  ]

  useEffect(() => {
    if (!params.Api) return

    let req = getCategoryApiTagsClustered
    if (!params.CategoryId) req = getApiTagsClustered

    const fetchData = async () => {
      const {
        Code,
        Data: { Categories },
      } = await req({ ...params, ...(!params.CategoryId ? { PageNum: 1, PageSize: 20 } : {}) })
      if (Code !== 'Succeed') return

      setOutData(Categories)
    }

    fetchData()
  }, [params])

  const InnerTable = ({ EntityType, Api, CategoryId }) => {
    const [innerData, setInnerData] = useState([])
    const [innerPageNum, setInnerPageNum] = useState(1)
    const [innerPageSize, setInnerPageSize] = useState(5)
    const [innerTotal, setInnerTotal] = useState(0)
    const [innerLoading, setInnerLoading] = useState(false)
    const theme = useSelector(({ global }) => global.theme)
    const innerColumns = [
      {
        title: '实体',
        dataIndex: 'EntityValue',
        align: 'center',
      },
      {
        title: '更新时间',
        dataIndex: 'UpdatedAt',
        render: (UpdatedAt) => moment(UpdatedAt).format('YYYY-MM-DD HH:mm:ss'),
        align: 'center',
      },
    ]

    useEffect(() => {
      let innerReq = getCategoryApiTagEntitiesClustered
      if (!CategoryId) innerReq = getApiTagEntitiesClustered
      setInnerLoading(true)
      const fetchData = async () => {
        const {
          Code,
          Data: { Entities, Total },
        } = await innerReq({
          Api,
          EntityType,
          PageNum: innerPageNum,
          PageSize: innerPageSize,
        })
        if (Code !== 'Succeed') return

        setInnerLoading(false)
        setInnerData(Entities)
        setInnerTotal(Total)
      }

      fetchData()
    }, [Api, EntityType, innerPageNum, innerPageSize, CategoryId])

    return (
      <div>
        <Table
          columns={innerColumns}
          dataSource={innerData}
          loading={innerLoading}
          rowKey="Index"
          pagination={false}
          className={theme === 'dark' ? {} : styles.innerTableLight}
        />
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination
            current={innerPageNum}
            pageSize={innerPageSize}
            total={innerTotal}
            onChange={(page, pageSize) => {
              setInnerPageNum(page)
              setInnerPageSize(pageSize)
            }}
          />
        </div>
      </div>
    )
  }

  const darkStyle = {
    wrapper: {
      backgroundColor: '#1D1D42',
      border: '1px solid rgba(186, 208, 241, 0.1)',
    },
    type: {
      color: 'rgba(255, 255, 255, 0.87)',
    },
  }
  const lightStyle = {
    wrapper: {
      backgroundColor: '#F7F7FF',
      border: '1px solid rgba(82, 78, 238, 0.16)',
    },
    type: {
      color: 'rgba(29, 29, 66, 0.87)',
    },
  }
  const styleSheet = theme === 'dark' ? darkStyle : lightStyle
  return (
    <Drawer title="标签种类" placement="right" width={643} onClose={onClose} visible={visible}>
      <Space direction="vertical" style={{ width: '100%' }}>
        {outData.map((i) => {
          return (
            <Collapse
              key={i.Index}
              expandIconPosition="right"
              style={{ ...styleSheet.wrapper }}
              ghost
              expandIcon={({ isActive }) =>
                isActive ? (
                  <img src={arrowDown} style={{ width: 14 }} />
                ) : (
                  <img
                    src={theme === 'dark' ? arrowRightWhite : arrowRight}
                    style={{ width: 14 }}
                  />
                )
              }
            >
              <Panel
                header={<span style={{ ...styleSheet.type }}>{i.EntityType}</span>}
                extra={<span style={{ ...styleSheet.type }}>{i.Count}</span>}
                key={i.Index}
              >
                <InnerTable
                  EntityType={i.EntityType}
                  Api={params.Api}
                  CategoryId={params.CategoryId}
                />
              </Panel>
            </Collapse>
          )
        })}
      </Space>
    </Drawer>
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

  useEffect(() => {
    const initTreeData = cloneDeep(topLevelList)
      .filter((e) => e.CategoryId !== '100000')
      .map((e) => {
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
        <div className={styles.treeHeader}>类别层级:</div>
        {treeData.length ? (
          <Tree
            height={256}
            virtual={false}
            treeData={treeData}
            loadData={onLoadData}
            style={{ padding: '8px 10px' }}
            onSelect={(selectedKeys) => setCategoryId(selectedKeys[0])}
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </Modal>
  )
}
