import { useState, useEffect } from 'react'
import { Form, Button, Input, DatePicker, Space, Dropdown, Menu, Select, Tabs, Table } from 'antd'
import { DownOutlined, FieldTimeOutlined, CloseOutlined } from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import ProTable from '@ant-design/pro-table'
import { useSelector } from 'umi'
import styles from './index.less'
import { actions, fieldOptions } from '@/constant/content'
import moment from 'moment'
import { getSrcEvents, getSrcEventDetail } from '@/services/eventSourcing'
import classNames from 'classnames'
import arrowDown from '@/assets/arrowDown.svg'
import arrowRight from '@/assets/arrowRight.svg'
import arrowRightWhite from '@/assets/arrowRight_white.svg'

const EventDetails = ({ record }) => {
  const theme = useSelector(({ global }) => global.theme)
  const { SrcEventId } = record
  const [details, setDetails] = useState([])

  const getJson = () => {
    let obj = {}

    details.forEach(({ Column, Value }) => {
      obj[Column] = Value
    })

    return JSON.stringify(obj, null, 4)
  }

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!SrcEventId) return

        const { Code, Data } = await getSrcEventDetail({ SrcEventId })
        if (Code !== 'Succeed') return

        setDetails(Data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchDetails()
  }, [SrcEventId])

  const columns = [
    {
      title: '字段',
      dataIndex: 'Column',
      render: (val) => <div style={{ paddingLeft: 32 }}>{val}</div>,
    },
    {
      title: '值',
      dataIndex: 'Value',
    },
  ]

  return (
    <Tabs
      defaultActiveKey="table"
      className={classNames(
        styles.innerTabs,
        theme === 'dark' ? styles.innerTabsDark : styles.innerTabsLight,
      )}
    >
      <Tabs.TabPane tab="表" key="table">
        <Table columns={columns} dataSource={details} showHeader={false} pagination={false} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="JSON" key="json">
        <pre className={styles.innerJson}>{getJson()}</pre>
      </Tabs.TabPane>
    </Tabs>
  )
}

const EventSourcing = () => {
  const theme = useSelector(({ global }) => global.theme)
  const [form] = Form.useForm()
  const [events, setEvents] = useState([])
  const [showMessage, setShowMessage] = useState(true)

  const columns = [
    {
      title: '创建时间',
      width: 180,
      dataIndex: 'CreateAt',
      valueType: 'dateTime',
    },
    {
      title: '请求报文',
      dataIndex: 'ReqRawAscii',
      valueType: 'code',
    },
    {
      title: '响应报文',
      dataIndex: 'RespRawAscii',
      valueType: 'code',
    },
  ]

  const fetchSrcEvents = async (values) => {
    try {
      setShowMessage(false)
      const { TimeRange, Regulars } = values

      const body = {
        Limit: 100,
        CreateAtStart: moment(TimeRange[0]).format('YYYY-MM-DDTHH:mm:ss'),
        CreateAtEnd: moment(TimeRange[1]).format('YYYY-MM-DDTHH:mm:ss'),
        Regular: Regulars,
      }
      const { Code, Data } = await getSrcEvents(body)
      if (Code !== 'Succeed') return

      setEvents(Data)
    } catch (err) {
      console.log(err)
    }
  }

  const onFinish = (values) => {
    fetchSrcEvents(values)
  }

  const onMenuClick = ({ key }) => {
    let range = []

    if (key === '8h') {
      range = [moment().subtract(8, 'hours'), moment()]
    } else if (key === '16h') {
      range = [moment().subtract(16, 'hours'), moment()]
    } else if (key === '24h') {
      range = [moment().subtract(24, 'hours'), moment()]
    }

    form.setFieldsValue({ TimeRange: range })
  }
  const menu = (
    <Menu onClick={onMenuClick}>
      <Menu.Item key="8h">过去8H</Menu.Item>
      <Menu.Item key="16h">过去16H</Menu.Item>
      <Menu.Item key="24h">过去24H</Menu.Item>
    </Menu>
  )

  return (
    <PageContainer header={{ title: null }}>
      <ProCard className={styles.main}>
        <Form form={form} name="query" autoComplete="off" onFinish={onFinish}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Space size="large" style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 16 }}>筛选项</span>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }} noStyle>
                <Button
                  type="primary"
                  onClick={() => {
                    const preRegulars = form.getFieldValue('Regulars') || []
                    form.setFieldsValue({
                      Regulars: [
                        ...preRegulars,
                        { Field: undefined, Operator: undefined, Value: '' },
                      ],
                    })
                  }}
                >
                  增加筛选项
                </Button>
              </Form.Item>
              <Button htmlType="submit">检索</Button>
            </Space>

            <Space>
              <Form.Item>
                <Dropdown overlay={menu} arrow>
                  <Button
                    style={{
                      borderColor: theme === 'dark' ? 'rgba(186, 208, 241, 0.1)' : '#d9d9d9',
                    }}
                  >
                    <FieldTimeOutlined />
                    <DownOutlined />
                  </Button>
                </Dropdown>
              </Form.Item>
              <Form.Item
                name="TimeRange"
                rules={[
                  {
                    type: 'array',
                    required: true,
                    message: '请选择时间',
                  },
                ]}
              >
                <DatePicker.RangePicker showTime suffixIcon={null} />
              </Form.Item>
            </Space>
          </div>
          <Form.List name="Regulars">
            {(fields, { add, remove }) => (
              <ProCard wrap ghost gutter={[16, 16]}>
                {fields.map(({ key, name, ...restField }) => (
                  <ProCard
                    colSpan={{ xs: 12, sm: 12, md: 8, lg: 8, xl: 8, xxl: 6 }}
                    key={key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    align="baseline"
                    bordered
                    bodyStyle={{ padding: '20px 12px', position: 'relative' }}
                    className={styles.regularItem}
                  >
                    <div className={styles.closeArea} onClick={() => remove(name)}>
                      <CloseOutlined />
                    </div>
                    <div style={{ display: 'flex' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: 6, textAlign: 'center' }}>字符</div>
                        <Form.Item {...restField} name={[name, 'Field']} noStyle>
                          <Select placeholder="选择字段" allowClear style={{ width: '100%' }}>
                            {fieldOptions.map(({ value, label }) => (
                              <Select.Option key={value} value={value}>
                                {label}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </div>

                      <div style={{ marginLeft: 10, marginRight: 10 }}>
                        <div style={{ marginBottom: 6, textAlign: 'center' }}>运算符</div>
                        <Form.Item {...restField} name={[name, 'Operator']} noStyle>
                          <Select placeholder="选择运算符" allowClear style={{ width: '100%' }}>
                            {[
                              ...actions,
                              {
                                value: 'not contains',
                                label: '不包含 (not contains)',
                              },
                              {
                                value: '!=',
                                label: '不等于 (!=)',
                              },
                            ].map(({ value, label }) => (
                              <Select.Option key={value} value={value}>
                                {label}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: 6, textAlign: 'center' }}>值</div>
                        <Form.Item {...restField} name={[name, 'Value']} noStyle>
                          <Input placeholder="请输入值" style={{ width: '100%' }} />
                        </Form.Item>
                      </div>
                    </div>
                  </ProCard>
                ))}
              </ProCard>
            )}
          </Form.List>
        </Form>
        {showMessage ? (
          <div style={{ textAlign: 'center', marginTop: 200, fontSize: 16, fontWeight: 600 }}>
            请输入筛选条件&时间检索
          </div>
        ) : (
          <ProTable
            columns={columns}
            dataSource={events}
            pagination={false}
            rowKey="SrcEventId"
            toolBarRender={false}
            search={false}
            expandable={{
              expandedRowRender: (record) => <EventDetails record={record} />,
              expandIcon: ({ expanded, onExpand, record }) =>
                expanded ? (
                  <img
                    src={arrowDown}
                    style={{ width: 14, cursor: 'pointer' }}
                    onClick={(e) => onExpand(record, e)}
                  />
                ) : (
                  <img
                    src={theme === 'dark' ? arrowRightWhite : arrowRight}
                    style={{ width: 14, cursor: 'pointer' }}
                    onClick={(e) => onExpand(record, e)}
                  />
                ),
            }}
            className={classNames(
              styles.mainTable,
              theme === 'dark' ? styles.darkTable : styles.lightTable,
            )}
          />
        )}
      </ProCard>
    </PageContainer>
  )
}

export default EventSourcing
