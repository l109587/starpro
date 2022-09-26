/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-param-reassign */
import { useState, useEffect, useRef } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { Card, Select, Space, Button, Form, Input, DatePicker } from 'antd'
import { ExpandOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import { getAssetsVisualization } from '@/services/assets'
import DetailsPane from '@/components/Graph/DetailsPane'
import styles from './index.less'
import echarts from '@/components/Echarts'
import useEchartsResize from '@/components/Echarts/useEchartsResize'
import moment from 'moment'

const { Option } = Select
const { RangePicker } = DatePicker
const defaultTimeRange = [moment().subtract(1, 'months'), moment()]

const Graph = () => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const detailsPaneRef = useRef(null)
  const [graphData, setGraphData] = useState({})
  const [selectedEdge, setSelectedEdge] = useState({})
  const [query, setQuery] = useState({ timeRange: defaultTimeRange })
  const [showNodeLabel, setShowNodeLabel] = useState(false)
  const [form] = Form.useForm()

  const buildGraphData = (data) => {
    data.nodes.forEach((n) => {
      const { id, host } = n
      n.name = id
    })

    // data.edges.forEach(e => {})
  }

  useEchartsResize(chartInstance)

  useEffect(() => {
    const fetchGraphData = async () => {
      const { timeRange } = query
      const params = {
        StartTime: timeRange[0].startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
        EndTime: timeRange[1].endOf('day').format('YYYY-MM-DDTHH:mm:ss'),
        // Search: '',
        // Field: '',
        // Operator: '',
      }

      try {
        const { Code, Data } = await getAssetsVisualization(params)
        if (Code !== 'Succeed') return

        buildGraphData(Data)
        setGraphData(Data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchGraphData()
  }, [query])

  const getCenter = () => {
    return [parseInt(chartRef.current.clientWidth) / 2, parseInt(chartRef.current.clientHeight) / 2]
  }

  function renderChart() {
    const options = {
      series: [
        {
          name: 'assets_graph',
          type: 'graph',
          layout: 'force',
          animation: false,
          roam: true,
          center: getCenter(),
          zoom: 0.88,
          label: {
            show: false,
            position: 'bottom',
            formatter: ({ data }) => {
              const { host } = data

              return host
            },
          },
          edgeLabel: {
            show: false,
            formatter: ({ data }) => {
              const { api_counts } = data

              return `${api_counts} API`
            },
          },
          emphasis: {
            scale: true,
            focus: 'adjacency',
            label: {
              show: true,
              position: 'bottom',
              formatter: ({ data }) => {
                const { host } = data

                return host
              },
            },
            edgeLabel: {
              show: true,
              formatter: ({ data }) => {
                const { api_counts } = data

                return `${api_counts} API`
              },
            },
          },
          edgeSymbol: ['none', 'arrow'],
          select: {
            itemStyle: {
              borderWidth: 4,
            },
            lineStyle: {
              color: '#126acc',
              width: 4,
            },
          },
          selectedMode: true,
          autoCurveness: true,
          draggable: true,
          nodes: graphData.nodes || [],
          force: {
            edgeLength: 8,
            repulsion: 30,
            gravity: 0.2,
          },
          edges: graphData.edges || [],
        },
      ],
    }

    const renderedInstance = echarts.getInstanceByDom(chartRef.current)
    if (renderedInstance) {
      chartInstance.current = renderedInstance
    } else {
      chartInstance.current = echarts.init(chartRef.current)
      chartInstance.current.on('click', { dataType: 'node' }, (evt) => {
        console.log('node', evt)
      })
      chartInstance.current.on('click', { dataType: 'edge' }, ({ data }) => {
        setSelectedEdge(data)
        detailsPaneRef.current.updateVisible(true)
      })
    }
    chartInstance.current.setOption(options)
  }

  useEffect(() => {
    renderChart()
  }, [graphData])

  useEffect(() => {
    return () => {
      chartInstance.current && chartInstance.current.dispose()
    }
  }, [])

  const onSearch = (values) => {
    setQuery(values)
  }

  const onReset = () => {
    form.resetFields()
    const values = form.getFieldsValue(true)

    setQuery(values)
  }

  const FilterForm = () => {
    return (
      <Form
        name="searchForm"
        layout="inline"
        form={form}
        style={{ flex: 'auto', paddingBottom: 16 }}
        initialValues={{ timeRange: defaultTimeRange }}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onSearch}
      >
        <Form.Item
          name="timeRange"
          label="时间范围"
          rules={[
            {
              type: 'array',
              required: true,
              message: '请选择时间范围!',
            },
          ]}
        >
          <RangePicker
            style={{ width: 270 }}
            ranges={{
              一周: [moment().subtract(1, 'weeks'), moment()],
              一个月: [moment().subtract(1, 'months'), moment()],
            }}
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button htmlType="button" onClick={onReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    )
  }

  return (
    <PageContainer header={{ title: null }}>
      <Card
        style={{ height: 'calc(100vh - 146px)', minHeight: 400 }}
        bodyStyle={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <FilterForm />
        <div className={styles.assetTopoGraph} ref={chartRef}></div>
        <div className={styles.toolbar}>
          <Space>
            <Button
              title="视图居中"
              size="small"
              type="text"
              icon={<ExpandOutlined />}
              onClick={() => {
                chartInstance.current.setOption({ series: [{ center: getCenter(), zoom: 0.88 }] })
              }}
            />
            <Button
              title={showNodeLabel ? '隐藏节点名称' : '显示节点名称'}
              size="small"
              type="text"
              icon={showNodeLabel ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              onClick={() => {
                const options = chartInstance.current.getOption()
                const show = options.series[0].label.show

                chartInstance.current.setOption({ series: [{ label: { show: !show } }] })
                setShowNodeLabel(!show)
              }}
            />
          </Space>
        </div>
        <DetailsPane ref={detailsPaneRef} edge={selectedEdge} />
      </Card>
    </PageContainer>
  )
}

export default Graph
