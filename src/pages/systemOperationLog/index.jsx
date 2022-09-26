import { useState, useEffect } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import {
  Button,
  Select,
  DatePicker,
  Form,
  Col,
  Row,
  Table,
  Input,
  Modal,
  Typography,
  message,
} from 'antd'
import moment from 'moment'
import { getSystemLogs, queryLogToKafka, createLogToKafka } from '@/services/systemOperationLog'
import { getUsers } from '@/services/settings'
import { uniqueId } from 'lodash'
import { getToken } from '@/utils/user'
import styles from './index.less'

const { Option } = Select
const { RangePicker } = DatePicker
const defaultTimeRange = [moment().subtract(1, 'weeks'), moment()]

export default function SystemOperationLog() {
  const [userPageNum, setUserPageNum] = useState(1)
  const [PageNum, setPageNum] = useState(1)
  const [PageSize, setPageSize] = useState(10)
  const [Total, setTotal] = useState(10)
  const [userPageSize, setUserPageSize] = useState(10)
  const [userTotal, setUserTotal] = useState(0)
  const [logs, setLogs] = useState([])
  const [users, setUsers] = useState([])
  const [UserName, setUserName] = useState('')
  const [query, setQuery] = useState({ timeRange: defaultTimeRange })
  const [App, setApp] = useState('')
  const [clientIP, setClientIP] = useState('')
  const [exportModal, setExportModal] = useState(false)
  const [kafkaConfigModal, setKafkaConfigModal] = useState(false)
  const [kafkaHost, setKafkaHost] = useState('')
  const [kafkaTopic, setKafkaTopic] = useState('')
  const [form] = Form.useForm()
  const [kafkaForm] = Form.useForm()
  const [userLoading, setUserLoading] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    kafkaForm.setFieldsValue({ KafkaHost: kafkaHost, KafkaTopic: kafkaTopic })
  }, [kafkaHost, kafkaTopic])

  const fetchLogs = async () => {
    setLoading(true)
    const { timeRange } = query
    const params = {
      StartTime: timeRange[0].startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
      EndTime: timeRange[1].endOf('day').format('YYYY-MM-DDTHH:mm:ss'),
      UserName: UserName,
      App: App,
      ClientIp: clientIP,
      PageNum: PageNum,
      PageSize: PageSize,
    }
    const {
      Code,
      Data: { Logs, Total },
    } = await getSystemLogs(params)
    if (Code !== 'Succeed') return
    setLoading(false)
    setTotal(Total)
    Logs?.forEach((e) => {
      e.id = uniqueId()
    })
    setLogs(Logs)
  }
  useEffect(() => {
    fetchLogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserName, query, App, clientIP, PageNum, PageSize])

  useEffect(() => {
    const fetchUsers = async () => {
      if (userLoading) return
      try {
        setUserLoading(true)
        const {
          Code,
          Data: { Users, Total },
        } = await getUsers({ Search: '', PageNum: userPageNum, PageSize: userPageSize })
        if (Code !== 'Succeed') return

        setUserTotal(Total)
        setUsers((usrs) => [...usrs, ...Users])
        setUserLoading(false)
      } catch (err) {
        console.log(err)
        setUserLoading(false)
      }
    }

    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPageNum])

  const editKafkaConfig = async () => {
    const {
      Code,
      Data: { KafkaHost, KafkaTopic },
    } = await queryLogToKafka()
    if (Code !== 'Succeed') return
    setKafkaHost(KafkaHost)
    setKafkaTopic(KafkaTopic)
    setKafkaConfigModal(true)
    setExportModal(false)
  }
  const pushLogToKafka = async () => {
    const { Code } = await createLogToKafka({ KafkaHost: kafkaHost, KafkaTopic: kafkaTopic })
    if (Code !== 'Succeed') return
    setKafkaConfigModal(false)
    message.success('成功推送到Kafka')
  }
  const onSearch = (e) => {
    setUserName(e.OperationName)
    setQuery({ timeRange: e.timeRange })
    setApp(e.App)
    setClientIP(e.clientIP)
  }

  const handleByPopupScroll = (e) => {
    if (users.length >= userTotal) return

    const { target } = e
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      setUserPageNum(userPageNum + 1)
    }
  }

  const onReset = () => {
    form.resetFields()
    const values = form.getFieldsValue(true)
    setApp('')
    setClientIP('')
    setUserName('')
    setQuery(values)
  }
  const selectChange = (e) => {
    setUserName(e)
  }
  const rangePickerChange = (e) => {
    setQuery({ timeRange: e })
  }
  const AppRangeChange = (e) => {
    setApp(e)
  }

  let timer = null
  const IPChange = (e) => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      setClientIP(e.target.value)
    }, 1000)
  }
  const kafkaChange = (e) => {
    setKafkaHost(e.target.value)
  }
  const TopicChange = (e) => {
    setKafkaTopic(e.target.value)
  }
  const exportLogs = () => {
    if (!logs.length) {
      return message.error('操作日志数据为空,暂时无法导出')
    }
    const { timeRange } = query
    const StartTime = timeRange[0].startOf('day').format('YYYY-MM-DDTHH:mm:ss')
    const EndTime = timeRange[1].endOf('day').format('YYYY-MM-DDTHH:mm:ss')
    fetch(
      `/console/ExportJson?StartTime=${StartTime}&EndTime=${EndTime}&UserName=${UserName}&App=${App}&ClientIp=${clientIP}`,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json;charset=UTF-8',
          Authorization: `JWT ${getToken()}`,
        },
      },
    ).then((res) =>
      res.blob().then((blob) => {
        const filename = `操作日志-${moment().format('YYYY-MM-DD-HH_mm_ss')}.json`
        const a = document.createElement('a')
        const url = window.URL.createObjectURL(blob)

        a.style.display = 'none'
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }),
    )
    setExportModal(false)
  }
  const AppRange = [
    'API多维画像',
    '资产相关',
    '应用相关',
    '数据管理',
    '策略配置',
    '安全运营',
    '安全风险',
    'IP多维画像',
    '用户管理',
  ]
  const columns = [
    {
      title: <span style={{ paddingLeft: 24 }}>ID</span>,
      dataIndex: 'LogId',
      width: 100,
      render: (val) => (
        <Typography.Text
          style={{
            maxWidth: '80px',
          }}
          ellipsis={{ tooltip: val }}
        >
          {val}
        </Typography.Text>
      ),
    },
    {
      title: '行为名称',
      width: '25%',
      dataIndex: 'Detail',
    },
    {
      title: '涉及业务',
      dataIndex: 'App',
    },
    {
      title: '操作人',
      dataIndex: 'UserName',
    },
    {
      title: 'IP',
      dataIndex: 'ClientIp',
    },
    {
      title: <span style={{ paddingRight: 24 }}>操作时间</span>,
      align: 'right',
      dataIndex: 'OperationTime',
      render: (val) => (
        <span style={{ paddingRight: 24 }}>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    },
  ]

  return (
    <PageContainer header={{ title: null }}>
      <ProCard className={styles.queryProCard}>
        <Form
          name="searchForm"
          // layout="inline"
          form={form}
          onFinish={onSearch}
          initialValues={{ timeRange: defaultTimeRange, OperationName: '', App: '', clientIP: '' }}
        >
          <Row style={{ height: 32 }}>
            <Col span={5}>
              <Form.Item
                name="OperationName"
                label="操作人"
                wrapperCol={{ span: 19 }}
                labelCol={{ span: 5 }}
                labelAlign="left"
              >
                <Select onPopupScroll={handleByPopupScroll} onChange={selectChange} allowClear>
                  {users.map((e) => (
                    <Option key={e.UserId} value={e.Name}>
                      {e.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="timeRange"
                label="时间范围"
                rules={[
                  {
                    type: 'array',
                    required: true,
                    message: '请选择时间范围!',
                  },
                ]}
                wrapperCol={{ span: 15 }}
                labelCol={{ span: 7 }}
              >
                <RangePicker
                  ranges={{
                    一周: [moment().subtract(1, 'weeks'), moment()],
                    一个月: [moment().subtract(1, 'months'), moment()],
                  }}
                  allowClear={false}
                  onChange={rangePickerChange}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                name="App"
                label="涉及范围"
                wrapperCol={{ span: 17 }}
                labelCol={{ span: 7 }}
                labelAlign="right"
              >
                <Select showArrow onChange={AppRangeChange} allowClear>
                  {AppRange.map((name, value) => (
                    <Option key={value} value={name}>
                      {name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item
                name="clientIP"
                label="IP"
                wrapperCol={{ span: 19 }}
                labelCol={{ span: 5 }}
                labelAlign="right"
              >
                <Input allowClear onChange={IPChange}></Input>
              </Form.Item>
            </Col>
            <Col span={4} style={{ textAlign: 'right' }}>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
                  查询
                </Button>
                <Button htmlType="button" onClick={onReset}>
                  重置
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </ProCard>
      <ProCard style={{ marginTop: 24 }}>
        <div style={{ textAlign: 'right', marginBottom: 20 }}>
          <Button key="primary" type="primary" onClick={() => setExportModal(true)}>
            日志导出
          </Button>
        </div>
        <Modal
          title="日志导出"
          centered
          visible={exportModal}
          onCancel={() => setExportModal(false)}
          footer={null}
          width={350}
          className={styles.exportModal}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              height: '66px',
            }}
          >
            <Button type="primary" onClick={exportLogs}>
              导出json
            </Button>
            {!kafkaHost ? (
              <Button type="primary" onClick={editKafkaConfig}>
                发送到Kafka
              </Button>
            ) : (
              <Button type="primary" onClick={editKafkaConfig}>
                修改Kafka地址
              </Button>
            )}
          </div>
        </Modal>
        <Modal
          title="日志导出-Kafka 地址配置"
          centered
          visible={kafkaConfigModal}
          onCancel={() => {
            setKafkaConfigModal(false)
            setExportModal(true)
            kafkaForm.resetFields()
          }}
          width={500}
          footer={null}
          forceRender
          className={styles.kafkaConfigModal}
        >
          <Form
            name="kafkaForm"
            form={kafkaForm}
            onFinish={pushLogToKafka}
            initialValues={{ KafkaHost: kafkaHost, KafkaTopic: kafkaTopic }}
          >
            <Form.Item
              name="KafkaHost"
              label="Kafka地址"
              wrapperCol={{ span: 19 }}
              labelAlign="left"
              labelCol={{ span: 5 }}
              rules={[
                {
                  required: true,
                  message: '请输入Kafka地址',
                },
              ]}
            >
              <Input allowClear placeholder="请输入Kafka地址" onChange={kafkaChange}></Input>
            </Form.Item>
            <Form.Item
              name="KafkaTopic"
              label="Topic"
              wrapperCol={{ span: 19 }}
              labelAlign="left"
              labelCol={{ span: 5 }}
              rules={[
                {
                  required: true,
                  message: '请输入Topic',
                },
              ]}
            >
              <Input allowClear placeholder="请输入Topic" onChange={TopicChange}></Input>
            </Form.Item>
            <Form.Item style={{ textAlign: 'right', paddingBottom: '16px' }}>
              <Button
                htmlType="button"
                onClick={() => {
                  setKafkaConfigModal(false)
                  setExportModal(true)
                  kafkaForm.resetFields()
                }}
                style={{ marginRight: 10 }}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Table
          loading={loading}
          dataSource={logs}
          columns={columns}
          rowKey="id"
          options={false}
          search={false}
          pagination={{
            showTotal: () => null,
            pageSizeOptions: [10, 20],
            showQuickJumper: true,
            showSizeChanger: true,
            total: Total,
            onChange: (page, pageSize) => {
              setPageNum(page)
              setPageSize(pageSize)
            },
          }}
        ></Table>
      </ProCard>
    </PageContainer>
  )
}
