import { useState, useEffect } from 'react'
import ProCard from '@ant-design/pro-card'
import styles from './index.less'
import {
  Input,
  Button,
  Space,
  Pagination,
  Tooltip,
  Typography,
  Form,
  Row,
  Col,
  Select,
  Modal,
} from 'antd'
import ProTable from '@ant-design/pro-table'
import { SearchOutlined } from '@ant-design/icons'
import { getRootApis } from '@/services/assets'
import { useLocation } from 'umi'
import ApiDetail from './apiDetail'
import ApiAddToApps from './apiAddToApps'
import IconFont from '@/components/Common/IconFont'
import numeral from 'numeral'
import hot from '@/assets/hot.svg'
import Applications from '@/components/Common/Applications'

const { Option } = Select

export default function ApiAssets() {
  const [dataSource, setDataSource] = useState([])
  const [queryValue, setQueryValue] = useState({})
  const [PageNum, setPageNum] = useState(1)
  const [PageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [apiSelectList, setApiSelectList] = useState([])
  const [apiConfig, setApiConfig] = useState({})
  const [timestamp, setTimestamp] = useState(0)
  const [tag, setTag] = useState([])
  const location = useLocation()
  const {
    query: { appId },
  } = location
  const [form] = Form.useForm()

  const fetchData = async () => {
    setLoading(true)

    let queryData = appId ? { AppId: appId } : {}
    queryData = {
      ...queryData,
      ...queryValue,
      PageNum,
      PageSize,
    }

    try {
      const {
        Code,
        Data: { Apis, ApisTotal },
      } = await getRootApis(queryData)
      if (Code !== 'Succeed') return

      setLoading(false)
      setTotal(ApisTotal)
      setDataSource(Apis)
    } catch (err) {
      setLoading(false)
      console.log(err)
    }
  }
  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryValue, PageNum, PageSize, appId])

  const columns = [
    {
      title: 'API',
      dataIndex: 'Api',
      width: 250,
      render(Api, { Tag }) {
        const apiStr = Api.includes('http://') ? Api : `http://${Api}`

        return (
          <div
            style={{ cursor: 'pointer', wordBreak: 'break-all', color: '#1890ff' }}
            onClick={() => {
              setApiConfig({ Api })
              setTag(Tag)
              setDetailVisible(true)
            }}
          >
            <Typography.Text
              style={{
                maxWidth: '100%',
                color: '#1890ff',
              }}
              ellipsis={{ tooltip: apiStr }}
            >
              {apiStr}
            </Typography.Text>
          </div>
        )
      },
    },
    {
      title: '安全事件',
      dataIndex: 'EventCounts',
      render(EventCounts) {
        return (
          <div>
            <div>
              <img src={hot} style={{ width: '16px', paddingBottom: '3px', marginRight: '7px' }} />
              {EventCounts}
            </div>
          </div>
        )
      },
    },
    {
      title: '产品',
      dataIndex: 'AppName',
      ellipsis: true,
    },
    {
      title: 'Action',
      dataIndex: 'AppAction',
      ellipsis: true,
    },
    // {
    //   title: '域名',
    //   dataIndex: 'Host',
    // },
    {
      title: '归属应用',
      dataIndex: 'Tag',
      render: (Apps = []) => <Applications apps={Apps} />,
    },
    {
      title: '敏感数据类型',
      dataIndex: 'Classification',
      align: 'right',
      render: (Classification = []) => {
        const iconMap = {
          个人信息: 'icon-icon_people_16',
          网络信息: 'icon-icon_network_161',
          认证信息: 'icon-icon_renzheng_24',
          企业信息: 'icon-icon_company_24',
        }

        return (
          <Space>
            {Classification.sort().map((e) => (
              <Tooltip key={e} title={e} mouseLeaveDelay={0}>
                {iconMap[e] ? <IconFont type={iconMap[e]} style={{ fontSize: 18 }} /> : e}
              </Tooltip>
            ))}
          </Space>
        )
      },
    },
  ]

  const getChooseUrls = (selects = []) => {
    return selects.map((Api) => (Api.includes('http://') ? Api : `http://${Api}`))
  }

  return (
    <ProCard
      title="资产列表"
      className={styles.proCardContainer}
      style={{ marginTop: 24 }}
      extra={
        <Form
          form={form}
          // style={{padding:0}}
          className={styles.searchForm}
          name="search_form"
          autoComplete="off"
          onValuesChange={(changedValues, values) => {
            setPageNum(1)
            setQueryValue(values)
          }}
        >
          <Row gutter={24}>
            <Col flex="auto">
              <Form.Item name="Search">
                <Input placeholder="输入关键词检索API" prefix={<SearchOutlined />} allowClear />
              </Form.Item>
            </Col>
            <Col flex="auto">
              <Form.Item name="AppName">
                <Input placeholder="输入关键词检索产品" prefix={<SearchOutlined />} allowClear />
              </Form.Item>
            </Col>
            <Col flex="auto">
              <Form.Item name="AppAction">
                <Input placeholder="输入关键词检索Action" prefix={<SearchOutlined />} allowClear />
              </Form.Item>
            </Col>
            <Col flex="auto">
              <Form.Item name="HostFlag" label="API 类型">
                <Select allowClear placeholder="选择API类型">
                  <Option value="Standard">标准 API</Option>
                  <Option value="Unstandard">非标准 API</Option>
                </Select>
              </Form.Item>
            </Col>
            <div style={{ display: 'none' }}>
              <Space>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
              </Space>
            </div>
          </Row>
        </Form>
      }
    >
      <ProTable
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        search={false}
        toolBarRender={false}
        tableAlertRender={false}
        tableAlertOptionRender={false}
        loading={loading}
        rowKey="Api"
        rowSelection={{
          selectedRowKeys: apiSelectList,
          onChange(v) {
            setApiSelectList(v)
          },
        }}
      />
      <div className={styles.tableFooter}>
        <Tooltip title={!apiSelectList.length ? '请选择API' : ''}>
          <Button
            disabled={!apiSelectList.length}
            onClick={() => {
              setTimestamp(Date.now())
              setDrawerVisible(true)
            }}
          >
            加入应用
          </Button>
        </Tooltip>

        <Pagination
          current={PageNum}
          pageSize={PageSize}
          showQuickJumper
          showSizeChanger
          pageSizeOptions={[10, 20]}
          total={total}
          showTotal={() => (
            <span>
              API总数 <b>{numeral(total).format('0,0')}</b>
            </span>
          )}
          onChange={(page, pageSize) => {
            setPageNum(page)
            setPageSize(pageSize)
            setApiSelectList([])
          }}
        />
      </div>
      <Modal
        title={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingRight: 12,
            }}
          >
            <Typography.Text
              style={{
                maxWidth: 420,
              }}
              ellipsis={{ tooltip: apiConfig.Api }}
            >
              {apiConfig.Api}
            </Typography.Text>
            <span style={{ marginLeft: '20px', height: '30px' }}>
              {!!tag.length && <Applications apps={tag} />}
            </span>
          </div>
        }
        width={900}
        onClose={() => setDetailVisible(false)}
        onCancel={() => setDetailVisible(false)}
        destroyOnClose={true}
        visible={detailVisible}
        bodyStyle={{ padding: 0 }}
        headerStyle={{ height: 50 }}
        footer={null}
      >
        <ApiDetail apiConfig={apiConfig} />
      </Modal>
      <ApiAddToApps
        timestamp={timestamp}
        visible={drawerVisible}
        chooseUrls={getChooseUrls(apiSelectList)}
        assetsType="api"
        onVisibleChange={(v) => setDrawerVisible(v)}
      />
    </ProCard>
  )
}
