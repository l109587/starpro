import { useState, useEffect, useImperativeHandle } from 'react'
import ProTable from '@ant-design/pro-table'
import { Button, Pagination, message, Tooltip, Switch, Modal } from 'antd'
import {
  getEntitiesStrategys,
  modifyEntitiesStrategysOnOff,
  deleteEntitiesStrategys,
} from '@/services/strategy'
import { InfoCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import styles from './index.less'

export default function IdentificationSwitch({ onEditRow }, ref) {
  const [PageNum, setPageNum] = useState(1)
  const [PageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [isCheckedGroup, setIsCheckedGroup] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [selectedRecords, setSelectedRecords] = useState([])
  const [EntityIds, setEntityIds] = useState([])
  const [OnOff, setOnOff] = useState([])
  const [strategyLoading, setStrategyLoading] = useState(false)
  const [changeClickNum, setChangeClickNum] = useState(0)
  const [batchChangeClickNum, setBatchChangeClickNum] = useState(0)
  const builtInMap = {
    1: '内置',
    0: '自定义',
  }

  const fetchEntitiesStrategys = async () => {
    try {
      setStrategyLoading(true)
      const {
        Code,
        Data: { Stratrgys, StratrgyCounts },
      } = await getEntitiesStrategys({ PageNum: PageNum, PageSize: PageSize })
      if (Code !== 'Succeed') return
      setStrategyLoading(false)
      setDataSource(Stratrgys)
      setTotal(StratrgyCounts)
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    fetchEntitiesStrategys()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PageNum, PageSize])

  useImperativeHandle(ref, () => ({
    fetchStrategys: fetchEntitiesStrategys,
  }))

  const handleToggle = async (record) => {
    const { Code } = await modifyEntitiesStrategysOnOff({
      EntityIds: [record.EntityId],
      OnOff: Number(record.OnOff === '1' ? '0' : '1'),
    })
    if (Code === 'InternalError') {
      setChangeClickNum(changeClickNum + 1)
      if (changeClickNum === 0) {
        message.error('变更失败！请您稍后在试一下哟！')
      } else {
        message.error('变更失败！请您联系开发人员')
      }
    } else {
      if (Code !== 'Succeed') return
      message.success('变更成功')
      fetchEntitiesStrategys()
    }
  }

  const batchHandle = () => {
    setIsCheckedGroup(true)
  }
  const change = async () => {
    if (EntityIds.length === 0) {
      message.error('请选择')
    } else {
      const boo = Number(OnOff.includes('0'))
      const { Code } = await modifyEntitiesStrategysOnOff({ EntityIds: EntityIds, OnOff: boo })
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
        setEntityIds([])
        setIsCheckedGroup(false)
        fetchEntitiesStrategys()
      }
    }
  }
  const onDeleteStrategys = (StrategyIds) => {
    Modal.confirm({
      title: '是否确定删除此条策略?',
      icon: <ExclamationCircleOutlined />,
      okText: '删除',
      okButtonProps: {
        danger: true,
      },
      cancelText: '取消',
      async onOk() {
        const { Code } = await deleteEntitiesStrategys({ StrategyIds })
        if (Code !== 'Succeed') return

        message.success('删除成功')
        fetchEntitiesStrategys()
      },
    })
  }
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
      title: '是否开启',
      dataIndex: 'OnOff',
      render: (OnOff, record) => (
        <Tooltip title={record.BuiltIn === '0' && '自定义策略默认启用'}>
          <Switch
            checked={Number(OnOff)}
            disabled={record.BuiltIn === '0'}
            onChange={() => {
              handleToggle(record)
            }}
          />
        </Tooltip>
      ),
    },
    { title: '数据类别', dataIndex: 'Classification' },
    {
      title: '敏感数据名称',
      dataIndex: 'EntityName',
      render: (EntityName, { Description }) => {
        return (
          <Tooltip title={Description || '无描述'} mouseLeaveDelay={0}>
            <span style={{ marginRight: 5 }}>{EntityName}</span>
            <InfoCircleOutlined style={{ fontSize: 12 }} />
          </Tooltip>
        )
      },
    },
    { title: '示例数据', dataIndex: 'Sample', ellipsis: true },
    {
      title: '类型',
      dataIndex: 'BuiltIn',
      valueEnum: builtInMap,
    },
    {
      title: <span style={{ paddingRight: 24 }}>操作</span>,
      dataIndex: '',
      align: 'right',
      render: (_, record) => {
        return (
          <div style={{ paddingRight: 7 }}>
            <Button
              type="link"
              disabled={record.BuiltIn === '1'}
              onClick={() => onEditRow({ ...record })}
            >
              编辑
            </Button>
            <span style={{ color: '#ccc' }}>|</span>
            <Button
              type="link"
              disabled={record.BuiltIn === '1'}
              onClick={() => {
                onDeleteStrategys([record.EntityId])
              }}
            >
              删除
            </Button>
          </div>
        )
      },
    },
  ]
  return (
    <>
      <ProTable
        columns={columns}
        dataSource={dataSource}
        search={false}
        toolBarRender={false}
        pagination={false}
        loading={strategyLoading}
        rowKey="Index"
        style={{ margin: '16px 0' }}
        rowSelection={
          isCheckedGroup && {
            selectedRowKeys: selectedRecords.map((e) => e.Index),
            onChange: (_, selectedRows) => {
              setSelectedRecords(selectedRows)
              setEntityIds(selectedRows.map((e) => e.EntityId))
              setOnOff(selectedRows.map((e) => e.OnOff))
            },
          }
        }
      />
      <div className={styles.footer}>
        {isCheckedGroup ? (
          <Button type="primary" onClick={change}>
            变更
          </Button>
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
    </>
  )
}
