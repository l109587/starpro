import { useState, useEffect, useImperativeHandle } from 'react'
import ProTable from '@ant-design/pro-table'
import { Pagination, Modal, Button, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { getAlarmTestList, deleteSafeEvent } from '@/services/strategy'

export default function AlarmTesting({ onEditRow }, ref) {
  const [PageNum, setPageNum] = useState(1)
  const [PageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [dataSource, setDataSource] = useState([])
  const builtInMap = {
    1: '内置',
    0: '自定义',
  }

  const fetchAlarmTestList = async () => {
    const {
      Code,
      Data: { Events, Total },
    } = await getAlarmTestList({ PageNum: PageNum, PageSize: PageSize })
    if (Code !== 'Succeed') return
    setDataSource(Events)
    setTotal(Total)
  }
  useEffect(() => {
    fetchAlarmTestList()
  }, [PageNum, PageSize])
  useImperativeHandle(ref, () => {
    return {
      fetchSafeEvents: fetchAlarmTestList,
    }
  })
  const onDeleteSafeEvents = (EventIds) => {
    Modal.confirm({
      title: '是否确定删除此条数据?',
      icon: <ExclamationCircleOutlined />,
      okText: '删除',
      okButtonProps: {
        danger: true,
      },
      cancelText: '取消',
      async onOk() {
        const { Code } = await deleteSafeEvent({ EventIds })
        if (Code !== 'Succeed') return

        message.success('删除成功')
        fetchAlarmTestList()
      },
    })
  }
  const columns = [
    {
      title: <span style={{ paddingLeft: 24 }}>#</span>,
      dataIndex: 'Index',
      render: (text, record, index) => {
        return <span style={{ marginLeft: 24 }}>{(PageNum - 1) * PageSize + index + 1}</span>
      },
    },
    {
      title: <span>检测项目</span>,
      dataIndex: 'Name',
      align: 'left',
      render: (Name) => {
        return <span>{Name}</span>
      },
    },
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
                onDeleteSafeEvents([record.EventId])
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
        rowKey="Index"
        style={{ margin: '16px 0' }}
      />
      <div style={{ textAlign: 'right' }}>
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
