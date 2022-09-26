import { useState, useEffect } from 'react'
import { DownOutlined, RightOutlined } from '@ant-design/icons'
import moment from 'moment'
import { useSelector } from 'umi'
import { getAppApiUrlTagsClustered, getAppApiUrlTagEntitiesClustered } from '@/services/assets'
import ProTable from '@ant-design/pro-table'
import arrowRight from '@/assets/arrowRight.svg'
import arrowRightWhite from '@/assets/arrowRight_white.svg'
import arrowDown from '@/assets/arrowDown.svg'

export default function TableTags({ data: { Api } }) {
  const [outData, setOutData] = useState([])
  const [PageNum, setPageNum] = useState(1)
  const [PageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [outLoading, setOutLoading] = useState(false)
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
    const fetchData = async () => {
      if (!Api) return

      setOutLoading(true)
      const {
        Code,
        Data: { Categories, Total },
      } = await getAppApiUrlTagsClustered({ Api, PageNum, PageSize })
      if (Code !== 'Succeed') return

      setOutLoading(false)
      setOutData(Categories)
      setTotal(Total)
    }

    fetchData()
  }, [Api, PageNum, PageSize])

  const InnerTable = ({ EntityType, Api: api }) => {
    const [innerData, setInnerData] = useState([])
    const [innerPageNum, setInnerPageNum] = useState(1)
    const [innerPageSize, setInnerPageSize] = useState(10)
    const [innerTotal, setInnerTotal] = useState(0)
    const [innerLoading, setInnerLoading] = useState(false)

    const innerColumns = [
      {
        title: '实体',
        dataIndex: 'EntityValue',
      },
      {
        title: '更新时间',
        dataIndex: 'UpdatedAt',
        render: (UpdatedAt) => moment(UpdatedAt).format('YYYY-MM-DD HH:mm:ss'),
      },
    ]

    useEffect(() => {
      const fetchData = async () => {
        setInnerLoading(true)
        const {
          Code,
          Data: { Entities, Total },
        } = await getAppApiUrlTagEntitiesClustered({
          Api: api,
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
    }, [EntityType, api, innerPageNum, innerPageSize])

    return (
      <div style={{ paddingLeft: 50 }}>
        <ProTable
          columns={innerColumns}
          dataSource={innerData}
          rowKey="Index"
          toolBarRender={false}
          search={false}
          loading={innerLoading}
          pagination={{
            total: innerTotal,
            current: innerPageNum,
            pageSize: innerPageSize,
            showSizeChanger: false,
            size: 'small',
            style: { paddingTop: 10 },
            onChange: (page, pageSize) => {
              setInnerPageNum(page)
              setInnerPageSize(pageSize)
            },
          }}
        />
      </div>
    )
  }
  const expandOptions = {
    expandedRowRender: ({ EntityType }) => <InnerTable EntityType={EntityType} Api={Api} />,
    expandIcon: ({ expanded, onExpand, record }) =>
      expanded ? (
        <img src={arrowDown} onClick={(e) => onExpand(record, e)} style={{ width: 14 }} />
      ) : (
        <img src={theme === 'dark' ? arrowRightWhite : arrowRight} onClick={(e) => onExpand(record, e)} style={{ width: 14 }} />
      ),
  }

  return (
    <ProTable
      columns={outColumns}
      dataSource={outData}
      rowKey="Index"
      toolBarRender={false}
      search={false}
      loading={outLoading}
      expandable={expandOptions}
      pagination={{
        total: total,
        current: PageNum,
        pageSize: PageSize,
        pageSizeOptions: [10, 20],
        showQuickJumper: true,
        style: { paddingTop: 10 },
        onChange: (page, pageSize) => {
          setPageNum(page)
          setPageSize(pageSize)
        },
      }}
    />
  )
}
