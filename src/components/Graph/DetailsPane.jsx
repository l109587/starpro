import { useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import { getAssetsVisualizationApis } from '@/services/assets'
import { List, Pagination, Typography } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import styles from './DetailsPane.less'

// edge: { source, target, api_counts }
const DetailsPane = forwardRef(({ edge }, ref) => {
  const [PageNum, setPageNum] = useState(1)
  const [PageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [apis, setApis] = useState([])
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const updateVisible = (v) => setVisible(v)

  useImperativeHandle(ref, () => ({
    updateVisible,
  }))

  useEffect(() => {
    const fetchApis = async () => {
      const { source, target } = edge
      if (!source || !target) return
      setLoading(true)
      const { Code, Data } = await getAssetsVisualizationApis({
        Source: source,
        Target: target,
        PageNum,
        PageSize,
      })
      if (Code !== 'Succeed') return

      const { ApiCounts, Apis } = Data
      setLoading(false)
      setTotal(ApiCounts)
      setApis(Apis)
    }

    fetchApis()
  }, [edge, PageNum, PageSize])

  const onClose = () => {
    setVisible(false)
    setApis([])
  }

  return (
    <>
      {visible && (
        <div className={styles.detailsPane}>
          <div className={styles.header}>
            <CloseOutlined style={{ cursor: 'pointer' }} onClick={onClose} />
          </div>
          {/* <div style={{ marginBottom: 16 }}>
            <span style={{ width: 50, display: 'inline-block' }}>源: </span>
            <span>{edge.sourceHost}</span>
            <br />
            <span style={{ width: 50, display: 'inline-block' }}>目标: </span>
            <span>{edge.targetHost}</span>
          </div> */}
          <List
            size="small"
            loading={loading}
            dataSource={apis}
            renderItem={({ Api }) => (
              <List.Item style={{ paddingLeft: 0 }}>
                <Typography.Text
                  style={{
                    maxWidth: '100%',
                    // color: '#1890ff',
                  }}
                  ellipsis={{ tooltip: Api }}
                >
                  {Api}
                </Typography.Text>
              </List.Item>
            )}
          />
          <div className={styles.footerContainer}>
            <span style={{ marginRight: 4 }}>{total} API</span>
            <Pagination
              size="small"
              simple
              current={PageNum}
              pageSize={PageSize}
              total={total}
              onChange={(num) => {
                setPageNum(num)
              }}
            />
          </div>
        </div>
      )}
    </>
  )
})

export default DetailsPane
