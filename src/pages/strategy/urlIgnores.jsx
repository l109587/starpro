import { useState, useEffect, useImperativeHandle } from 'react'
import ProTable from '@ant-design/pro-table'
import { Input, Button, Pagination, Modal, message, Switch, Popconfirm, Form } from 'antd'
import {
  getUrlIgnores,
  updateUrlStrategy,
  addUrlStrategy,
  deleteUrlStrategys,
  modifyUrlStrategysOnOff,
} from '@/services/strategy'
import styles from './index.less'

export default function UrlIgnores(props, ref) {
  const [isModalVisible, setisModalVisible] = useState(false)
  const [PageNum, setPageNum] = useState(1)
  const [PageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [isCheckedGroup, setIsCheckedGroup] = useState(false)
  const [Record, setRecord] = useState({})
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState([])
  const [UrlRule, setUrlRule] = useState('')
  const [selectedRecords, setSelectedRecords] = useState([])
  const [urls, setUrls] = useState()
  const [isUsing, setIsUsing] = useState([])
  const [urlIgnoresLoading, setUrlIgnoresLoading] = useState(false)
  const [batchDeleteClickNum, setBatchDeleteClickNum] = useState(0)
  const [deleteClickNum, setDeleteClickNum] = useState(0)
  const [editClickNum, setEditClickNum] = useState(0)
  const [changeClickNum, setChangeClickNum] = useState(0)
  const [batchChangeClickNum, setBatchChangeClickNum] = useState(0)
  useEffect(() => {
    form.setFieldsValue(Record)
  }, [Record])

  const fetchUrlIgnores = async () => {
    setUrlIgnoresLoading(true)
    const {
      Code,
      Data: { Urls, UrlCounts },
    } = await getUrlIgnores({ PageNum: PageNum, PageSize: PageSize })
    if (Code !== 'Succeed') return
    setUrlIgnoresLoading(false)
    setDataSource(Urls)
    setTotal(UrlCounts)
  }
  useEffect(() => {
    fetchUrlIgnores()
  }, [PageNum, PageSize])

  const editIgnores = (record) => {
    setRecord(record)
    setisModalVisible(true)
  }
  const addIgnores = () => {
    setRecord(null)
    setUrlRule('')
    setisModalVisible(true)
  }
  const handleToggle = async (record) => {
    const { Code } = await modifyUrlStrategysOnOff({
      Urls: [record.Url],
      OnOff: Number(record.IsUsing === '1' ? '0' : '1'),
    })
    if (Code === 'InternalError') {
      setChangeClickNum(changeClickNum + 1)
      if (changeClickNum === 0) {
        message.error('变更失败！请您稍后在试一下哟！')
      } else {
        message.error('变更失败！请您联系开发人员')
      }
    } else if (Code === 'Succeed') {
      message.success('变更成功')
      fetchUrlIgnores()
    }
  }
  const handleOk = async () => {
    if (Record) {
      if (!UrlRule) {
        setUrlRule(Record.Url)
      } else {
        const { Code } = await updateUrlStrategy({ CurrentUrl: Record.Url, Url: UrlRule })
        if (Code === 'InternalError') {
          setEditClickNum(editClickNum + 1)
          if (editClickNum === 0) {
            message.error('编辑失败！请您稍后在试一下哟！')
          } else {
            message.error('编辑失败！请您联系开发人员')
          }
        }
        if (Code !== 'Succeed') return
        message.success('编辑成功')
        setisModalVisible(false)
        fetchUrlIgnores()
        form.resetFields()
      }
    } else {
      if (!UrlRule) {
        message.error('内容不得为空')
      } else {
        const { Code } = await addUrlStrategy({ Url: UrlRule, BwType: 'black', Flag: 1 })
        if (Code !== 'Succeed') return
        message.success('添加成功')
        setisModalVisible(false)
        fetchUrlIgnores()
        form.resetFields()
      }
    }
  }
  const handleCancel = () => {
    setisModalVisible(false)
    form.resetFields()
  }
  const change = async () => {
    if (isUsing.length === 0) {
      message.error('请选择')
    } else {
      const boo = Number(isUsing.includes('0'))
      const { Code } = await modifyUrlStrategysOnOff({ Urls: urls, OnOff: boo })
      if (Code === 'InternalError') {
        setBatchChangeClickNum(batchChangeClickNum + 1)
        if (batchChangeClickNum === 0) {
          message.error('变更失败！请您稍后在试一下哟！')
        } else {
          message.error('变更失败！请您联系开发人员')
        }
      } else {
        if (Code !== 'Succeed') return
        setSelectedRecords([])
        message.success('变更成功')
        setIsCheckedGroup(false)
        setIsUsing([])
        fetchUrlIgnores()
      }
    }
  }
  const batchDelete = async () => {
    if (isUsing.length === 0) {
      return message.error('请选择')
    }
    const { Code } = await deleteUrlStrategys({ Urls: urls })
    if (Code === 'InternalError') {
      setBatchDeleteClickNum(batchDeleteClickNum + 1)
      if (batchDeleteClickNum === 0) {
        message.error('删除失败！请您稍后在试一下哟！')
      } else {
        message.error('删除失败！请您联系开发人员')
      }
    }
    if (Code !== 'Succeed') return
    message.success('删除成功')
    fetchUrlIgnores()
  }
  const getUrlRule = (e) => {
    setUrlRule(e.target.value)
  }
  const batchHandle = () => {
    setIsCheckedGroup(true)
  }

  useImperativeHandle(ref, () => {
    return {
      addIgnores: addIgnores,
    }
  })

  const columns = [
    {
      title: <span style={{ paddingLeft: 24 }}>#</span>,
      dataIndex: 'Index',
      width: 80,
      render: (Index) => {
        return <span style={{ marginLeft: 24 }}>{Index}</span>
      },
    },
    {
      title: '忽略此URL',
      dataIndex: 'IsUsing',
      render: (IsUsing, record) => (
        <Switch
          onChange={() => {
            handleToggle(record)
          }}
          checked={Number(IsUsing)}
        />
      ),
    },
    { title: 'URL匹配规则', dataIndex: 'Url' },
    {
      title: <span style={{ paddingRight: 24 }}>操作</span>,
      dataIndex: '',
      align: 'right',
      render: (_, record) => {
        return (
          <div style={{ paddingRight: 7 }}>
            <Button
              type="link"
              onClick={() => {
                editIgnores(record)
              }}
            >
              编辑
            </Button>
            <Popconfirm
              title="确定要从该列表移除吗？"
              okText="确定"
              cancelText="取消"
              onConfirm={async () => {
                const { Code } = await deleteUrlStrategys({ Urls: [Record.Url] })
                if (Code === 'InternalError') {
                  setDeleteClickNum(deleteClickNum + 1)
                  if (deleteClickNum === 0) {
                    message.error('删除失败！请您稍后在试一下哟！')
                  } else {
                    message.error('删除失败！请您联系开发人员')
                  }
                }
                if (Code !== 'Succeed') return
                message.success('删除成功')
                fetchUrlIgnores()
              }}
            >
              <span style={{ color: '#ccc' }}>|</span>
              <Button type="link" danger>
                删除
              </Button>
            </Popconfirm>
          </div>
        )
      },
    },
  ]
  return (
    <div>
      <ProTable
        columns={columns}
        dataSource={dataSource}
        search={false}
        toolBarRender={false}
        pagination={false}
        loading={urlIgnoresLoading}
        rowKey="Index"
        style={{ margin: '16px 0' }}
        rowSelection={
          isCheckedGroup && {
            selectedRowKeys: selectedRecords.map((e) => e.Index),
            onChange: (_, selectedRows) => {
              setSelectedRecords(selectedRows)
              setUrls(selectedRows.map((e) => e.Url))
              setIsUsing(selectedRows.map((e) => e.IsUsing))
            },
          }
        }
      ></ProTable>
      <div className={styles.footer}>
        {isCheckedGroup ? (
          <div>
            <Button type="primary" ghost onClick={change} style={{ marginRight: 10 }}>
              变更
            </Button>
            <Button type="primary" onClick={batchDelete}>
              删除
            </Button>
          </div>
        ) : (
          <Button onClick={batchHandle}>批量操作</Button>
        )}

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
      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        title={Record ? <span>编辑策略</span> : <span>新建策略</span>}
        className={styles.strategyModal}
        forceRender
      >
        <Form form={form} preserve={false}>
          <Form.Item
            label="URL匹配规则"
            name="Url"
            rules={[
              {
                validator: (_, value) => {
                  if (value.includes('?') || value.includes('？')) {
                    return Promise.reject(new Error('输入的URL内不能存在"?"'))
                  }
                },
              },
            ]}
          >
            <Input
              allowClear
              onChange={(event) => {
                getUrlRule(event)
              }}
            ></Input>
          </Form.Item>
          <div className={styles.tips} style={{ marginBottom: 20 }}>
            匹配到此规则的URL将不触发数据识别功能。
          </div>
          <div className={styles.tips}>
            URL样例支持通配符*(若URL中含有*，请使用**进行匹配)，样例规则：
          </div>
          <div className={styles.sampleRule}>
            example.*:9090/**
            <br />
            example.com:8080/*
            <br />
            *.example.com*
            <br />
            example.com:8080/v1/api/*/profile
          </div>
        </Form>
      </Modal>
    </div>
  )
}
