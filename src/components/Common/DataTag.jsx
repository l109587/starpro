import { useState, useEffect } from 'react'
import moment from 'moment'
import { useSelector } from 'umi'
import ProTable from '@ant-design/pro-table'
import { Space, Pagination, Empty } from 'antd'
import { Collapse } from 'antd'
import arrowDown from '@/assets/arrowDown.svg'
import arrowRight from '@/assets/arrowRight.svg'
import arrowRightWhite from '@/assets/arrowRight_white.svg'
import styles from './DataTagCss.less'

const { Panel } = Collapse

export default function TableTags(props) {
  const [outData, setOutData] = useState([])
  const [PageNum, setPageNum] = useState(1)
  const [PageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const theme = useSelector(({ global }) => global.theme)
  const { Ip, Api, getTag, geTagEntities, searchValue, CategoryId } = props

  useEffect(() => {
    const fetchData = async () => {
      const param = {
        PageNum,
        PageSize,
        [Api ? 'Api' : 'Ip']: Api || Ip,
        Search: searchValue,
        CategoryId: CategoryId,
      }
      const {
        Code,
        Data: { Categories, Total },
      } = await getTag(param)
      if (Code !== 'Succeed') return

      setOutData(Categories)
      setTotal(Total)
    }

    fetchData()
  }, [searchValue, Api, PageNum, PageSize, Ip])

  const darkStyle = {
    wrapper: {
      backgroundColor: '#1D1D42',
      border: '1px solid rgba(186, 208, 241, 0.1)',
    },
    type: {
      color: 'rgba(255, 255, 255, 0.87)',
    },
  }
  const lightStyle = {
    wrapper: {
      backgroundColor: '#F7F7FF',
      border: '1px solid rgba(82, 78, 238, 0.16)',
    },
    type: {
      color: 'rgba(29, 29, 66, 0.87)',
    },
  }
  const styleSheet = theme === 'dark' ? darkStyle : lightStyle

  const InnerTable = ({ EntityType, Api: api, Ip: ip }) => {
    const [innerData, setInnerData] = useState([])
    const [innerPageNum, setInnerPageNum] = useState(1)
    const [innerPageSize, setInnerPageSize] = useState(5)
    const [innerTotal, setInnerTotal] = useState(0)
    const [innerLoading, setInnerLoading] = useState(false)
    const theme = useSelector(({ global }) => global.theme)

    const innerColumns = [
      {
        title: '实体',
        dataIndex: 'EntityValue',
        align: 'center',
        ellipsis: true,
      },
      {
        title: '更新时间',
        dataIndex: 'UpdatedAt',
        render: (UpdatedAt) => moment(UpdatedAt).format('YYYY-MM-DD HH:mm:ss'),
        align: 'center',
      },
    ]

    useEffect(() => {
      const fetchData = async () => {
        setInnerLoading(true)
        const param = {
          EntityType,
          PageNum: innerPageNum,
          PageSize: innerPageSize,
          [api ? 'Api' : 'Ip']: api || ip,
        }
        const {
          Code,
          Data: { Entities, Total },
        } = await geTagEntities(param)
        if (Code !== 'Succeed') return

        setInnerLoading(false)
        setInnerData(Entities)
        setInnerTotal(Total)
      }

      fetchData()
    }, [EntityType, api, ip, innerPageNum, innerPageSize])
    return (
      <div>
        <ProTable
          columns={innerColumns}
          dataSource={innerData}
          rowKey="Index"
          toolBarRender={false}
          search={false}
          loading={innerLoading}
          className={theme === 'dark' ? {} : styles.innerTableLight}
          // pagination={{
          //   total: innerTotal,
          //   current: innerPageNum,
          //   pageSize: innerPageSize,
          //   showSizeChanger: false,
          //   size: 'small',
          //   onChange: (page, pageSize) => {
          //     setInnerPageNum(page)
          //     setInnerPageSize(pageSize)
          //   },
          // }}
          pagination={false}
        />
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination
            current={innerPageNum}
            pageSize={innerPageSize}
            total={innerTotal}
            size="small"
            hideOnSinglePage={true}
            onChange={(page, pageSize) => {
              setInnerPageNum(page)
              setInnerPageSize(pageSize)
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <>
      {outData.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <div>
          <Space direction="vertical" style={{ width: '100%' }}>
            {outData.map((i) => {
              return (
                <Collapse
                  key={i.Index}
                  expandIconPosition="right"
                  style={{ ...styleSheet.wrapper }}
                  ghost
                  expandIcon={({ isActive }) =>
                    isActive ? (
                      <img src={arrowDown} style={{ width: 14 }} />
                    ) : (
                      <img
                        src={theme === 'dark' ? arrowRightWhite : arrowRight}
                        style={{ width: 14 }}
                      />
                    )
                  }
                >
                  <Panel
                    header={<span style={{ ...styleSheet.type }}>{i.EntityType}</span>}
                    extra={<span style={{ ...styleSheet.type }}>{i.Count}</span>}
                    key={i.Index}
                  >
                    <InnerTable EntityType={i.EntityType} Api={Api} Ip={Ip} />
                  </Panel>
                </Collapse>
              )
            })}
          </Space>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <Pagination
              current={PageNum}
              pageSize={PageSize}
              showQuickJumper
              showSizeChanger
              pageSizeOptions={[10, 20]}
              total={total}
              hideOnSinglePage={true}
              onChange={(page, pageSize) => {
                setPageNum(page)
                setPageSize(pageSize)
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}
