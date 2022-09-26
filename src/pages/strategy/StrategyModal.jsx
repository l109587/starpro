import { useState, useImperativeHandle, useEffect } from 'react'
import { Modal, Form, Input, Button, Select, message, Spin } from 'antd'
import { useSelector } from 'umi'
import { createEntitiesStrategys, entityImmediateDetection } from '@/services/strategy'

const { Option } = Select

const StrategyModal = ({ record, refreshStrategys }, ref) => {
  const { EntityId } = record
  const [visible, setVisible] = useState(false)
  const theme = useSelector(({ global }) => global.theme)
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [testLoading, setTestLoading] = useState(false)

  useImperativeHandle(ref, () => ({ setVisible }))

  useEffect(() => {
    const {
      Classification,
      EntityName,
      Description,
      Sample,
      MessageSample,
      Regular,
      TestResult,
      EntityId,
    } = record

    if (!EntityId) return
    form.setFieldsValue({
      Classification,
      EntityName,
      Description,
      Sample,
      MessageSample,
      Regular,
      TestResult,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record])

  const strategyConfigWrap = {
    dark: {
      border: '1px solid rgba(186, 208, 241, 0.1)',
    },
    light: {
      border: '#eee',
    },
  }[theme]

  const onFinish = async (values) => {
    setConfirmLoading(true)
    values.StrategyId = EntityId || ''
    const { Code } = await createEntitiesStrategys(values)
    setConfirmLoading(false)
    if (Code === 'DuplicateEntityName')
      return form.setFields([{ name: 'EntityName', errors: ['名称已存在，请重新输入'] }])
    if (Code !== 'Succeed') return

    setVisible(false)
    form.resetFields()
    message.success(`${EntityId ? '编辑' : '创建'}策略成功`)
    refreshStrategys()
  }

  const onTesting = () => {
    form
      .validateFields(['MessageSample', 'Regular'])
      .then(async (values) => {
        const { MessageSample, Regular } = values
        if (!MessageSample || !Regular) return
        setTestLoading(true)
        try {
          const { Code, Data } = await entityImmediateDetection({
            ReqRespMessage: MessageSample,
            CheckRegular: Regular,
          })
          setTestLoading(false)
          if (Code !== 'Succeed') return
          form.setFieldsValue({ TestResult: Data })
        } catch (err) {
          console.log(err)
          setTestLoading(false)
        }
      })
      .catch((err) => console.log('err', err))
  }

  return (
    <Modal
      title={`${EntityId ? '编辑' : '创建'}敏感数据识别策略`}
      visible={visible}
      confirmLoading={confirmLoading}
      onOk={() => {
        form.submit()
      }}
      onCancel={() => {
        setVisible(false)
        form.resetFields()
      }}
    >
      <Form
        name="strategy_config"
        form={form}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          name="Classification"
          label="数据类别"
          rules={[{ required: true, message: '此项必填' }]}
        >
          <Select placeholder="请选择数据类别" allowClear>
            <Option value="个人信息">个人信息</Option>
            <Option value="网络信息">网络信息</Option>
            <Option value="企业信息">企业信息</Option>
            <Option value="认证信息">认证信息</Option>
            <Option value="其他">其他</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="EntityName"
          label="敏感数据名称"
          rules={[{ required: true, message: '此项必填' }]}
        >
          <Input placeholder="请输入敏感数据名称" />
        </Form.Item>
        <Form.Item name="Description" label="敏感数据描述" initialValue="">
          <Input placeholder="请输入敏感数据描述" />
        </Form.Item>

        <Form.Item name="Sample" label="示例数据" initialValue="">
          <Input placeholder="请输入示例数据" />
        </Form.Item>

        <Form.Item label="策略配置">
          <Spin spinning={testLoading}>
            <div style={{ ...strategyConfigWrap, borderRadius: 8, padding: 24 }}>
              <Form.Item name="MessageSample" label="报文样例" initialValue="">
                <Input.TextArea
                  autoSize={{ minRows: 4, maxRows: 8 }}
                  placeholder="请输入报文样例"
                />
              </Form.Item>
              <Form.Item
                name="Regular"
                label="识别规则"
                rules={[{ required: true, message: '此项必填' }]}
              >
                <Input placeholder="请输入识别规则表达式" />
              </Form.Item>
              <Form.Item shouldUpdate>
                {({ getFieldsValue }) => {
                  const { MessageSample, Regular } = getFieldsValue(['MessageSample', 'Regular'])

                  return (
                    <div style={{ textAlign: 'center' }}>
                      <Button
                        size="small"
                        type="primary"
                        disabled={!MessageSample || !Regular}
                        onClick={onTesting}
                      >
                        立即测试
                      </Button>
                    </div>
                  )
                }}
              </Form.Item>
            </div>
          </Spin>
        </Form.Item>
        <Form.Item name="TestResult" label="测试结果" initialValue="">
          <Input.TextArea
            readOnly
            autoSize={{ minRows: 4, maxRows: 8 }}
            placeholder="测试结果将会显示在这里"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default StrategyModal
