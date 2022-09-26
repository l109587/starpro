import { useState, useImperativeHandle, useEffect } from 'react'
import { Modal, Form, Input, Button, Select, message, Space, Radio, Row, Col, Spin } from 'antd'
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { useSelector } from 'umi'
import { createSafeEvent, safeEventImmediateDetection } from '@/services/strategy'
import styles from './DetectRuleModal.less'
import { actions, fieldOptions, SeverityOptions } from '@/constant/content'

const { Option } = Select
const letters = [
  '$A',
  '$B',
  '$C',
  '$D',
  '$E',
  '$F',
  '$G',
  '$H',
  '$I',
  '$J',
  '$K',
  '$L',
  '$M',
  '$N',
  '$O',
  '$P',
  '$Q',
  '$R',
  '$S',
  '$T',
  '$U',
  '$V',
  '$W',
  '$X',
  '$Y',
  '$Z',
]

const DetectRuleModal = ({ record, refreshSafeEvents }, ref) => {
  const { EventId } = record
  const [visible, setVisible] = useState(false)
  const theme = useSelector(({ global }) => global.theme)
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [testLoading, setTestLoading] = useState(false)

  useImperativeHandle(ref, () => ({ setVisible }))

  useEffect(() => {
    const {
      Name,
      Description,
      Remediation,
      References,
      Regular,
      EventId,
      MessageSample,
      TestResult,
      Severity,
    } = record

    if (!EventId) return
    form.setFieldsValue({
      EventName: Name,
      Description,
      Remediation,
      References,
      Regular,
      MessageSample,
      TestResult,
      Severity,
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

  const getRegular = () => {
    let { rules, Regular } = form.getFieldsValue(['rules', 'Regular'])
    rules.forEach((rule, i) => {
      const { field, action, value } = rule
      if (!field || !action || !value) return
      const letter = letters[i]
      const val = isNaN(value) ? `"${value}"` : value
      Regular = Regular.replaceAll(letter, `${field} ${action} ${val}`)
    })
    return Regular
  }

  const onTesting = () => {
    form
      .validateFields(['MessageSample', 'Regular'])
      .then(async (values) => {
        const { MessageSample, Regular } = values
        if (!MessageSample || !Regular) return
        setTestLoading(true)
        try {
          const { Code, Data } = await safeEventImmediateDetection({
            ReqRespMessage: MessageSample,
            CheckRegular: getRegular(),
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

  const onFinish = async (values) => {
    setConfirmLoading(true)
    values.EventId = EventId || ''
    values.Regular = getRegular()
    delete values.rules
    const { Code, status } = await createSafeEvent(values)
    setConfirmLoading(false)
    if (Code !== 'Succeed') return

    setVisible(false)
    form.resetFields()
    message.success(`${EventId ? '编辑' : '创建'}自定义检测事件成功`)
    refreshSafeEvents()
  }

  return (
    <Modal
      title={`${EventId ? '编辑' : '创建'}自定义检测事件`}
      visible={visible}
      width={850}
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
        name="safe_event_config"
        form={form}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          name="EventName"
          label="事件名"
          rules={[{ required: true, message: '此项必填' }]}
        >
          <Input placeholder="请输入标签名" />
        </Form.Item>
        <Form.Item name="Description" label="事件描述" initialValue="">
          <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} placeholder="填写事件描述" />
        </Form.Item>

        <Form.Item name="Remediation" label="安全建议" initialValue="">
          <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} placeholder="填写安全建议" />
        </Form.Item>

        <Form.Item name="References" label="相关参考" initialValue="">
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 6 }}
            placeholder={'填写相关参考，例如: \n1. ......\n2. ......\n3. ......'}
          />
        </Form.Item>

        <Form.Item
          name="Severity"
          label="风险等级"
          rules={[
            {
              required: true,
              message: '请选择风险等级',
            },
          ]}
          style={{ marginBottom: 8 }}
        >
          <Radio.Group style={{ width: '100%' }}>
            <Row>
              {SeverityOptions.map(({ value, label }) => (
                <Col span={6} key={value}>
                  <Radio value={value} style={{ lineHeight: '32px' }}>
                    {label}
                  </Radio>
                </Col>
              ))}
            </Row>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="规则配置">
          <Form.List
            name="rules"
            initialValue={[{ field: undefined, action: undefined, value: '' }]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Form.Item required={false} key={key} style={{ marginBottom: 0 }}>
                    <Space style={{ display: 'flex' }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'field']}
                        rules={[
                          () => ({
                            validator(_, value) {
                              if (EventId) return Promise.resolve()

                              if (value) return Promise.resolve()
                              return Promise.reject(new Error('请选择字段'))
                            },
                          }),
                        ]}
                        style={{ marginBottom: 8 }}
                      >
                        <Select
                          placeholder="选择字段"
                          allowClear
                          style={{ width: 220 }}
                          disabled={!!EventId}
                        >
                          {fieldOptions.map(({ value, label }) => (
                            <Option key={value} value={value}>
                              {label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'action']}
                        rules={[
                          () => ({
                            validator(_, value) {
                              if (EventId) return Promise.resolve()

                              if (value) return Promise.resolve()
                              return Promise.reject(new Error('请选择运算符'))
                            },
                          }),
                        ]}
                        style={{ marginBottom: 8 }}
                      >
                        <Select
                          placeholder="选择运算符"
                          allowClear
                          style={{ width: 180 }}
                          disabled={!!EventId}
                        >
                          {actions.map(({ value, label }) => (
                            <Option key={value} value={value}>
                              {label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'value']}
                        rules={[
                          () => ({
                            validator(_, value) {
                              if (EventId) return Promise.resolve()

                              if (value) return Promise.resolve()
                              return Promise.reject(new Error('请输入值'))
                            },
                          }),
                        ]}
                        style={{ marginBottom: 8 }}
                      >
                        <Input placeholder="输入值" style={{ width: 200 }} disabled={!!EventId} />
                      </Form.Item>
                      <span>
                        规则别名:{' '}
                        <b style={{ display: 'inline-block', width: 28 }}>{letters[index]}</b>
                      </span>
                      <Space style={{ marginLeft: 6 }}>
                        <PlusCircleOutlined
                          className={styles.dynamicButton}
                          style={{
                            color: !!EventId ? 'gray' : 'green',
                            cursor: !!EventId ? 'not-allowed' : 'pointer',
                          }}
                          onClick={() => {
                            if (!!EventId) return
                            if (fields.length >= letters.length) return
                            add({ field: undefined, action: undefined, value: '' })
                          }}
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
          <Form.Item
            name="Regular"
            label="规则表达式"
            rules={[{ required: true, message: '此项必填' }]}
          >
            <Input placeholder="书写表达式，例如：($A and $B) or (not $C)" size="large" />
          </Form.Item>
        </Form.Item>

        <Form.Item label="规则测试">
          <Spin spinning={testLoading}>
            <div style={{ ...strategyConfigWrap, borderRadius: 8, padding: 24 }}>
              <Form.Item name="MessageSample" label="测试报文" initialValue="">
                <Input.TextArea autoSize={{ minRows: 4, maxRows: 8 }} placeholder="输入测试报文" />
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

export default DetectRuleModal
