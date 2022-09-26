import React from 'react'
import {
  EllipsisOutlined,
  DoubleRightOutlined,
  MenuOutlined,
  FullscreenOutlined,
} from '@ant-design/icons'
import ProCard from '@ant-design/pro-card'
import {
  Button,
  Input,
  message,
  Pagination,
  Menu,
  Dropdown,
  Typography,
  Row,
  Col,
  Tooltip,
  Radio,
  AutoComplete,
  Space,
  Modal,
} from 'antd'
import { createApp, getApps, deleteApp, searchDomainMatch, modifyApp } from '@/services/assets'
import styles from './index.less'
import moment from 'moment'
import { history, injectIntl, connect } from 'umi'
import IconFont from '@/components/Common/IconFont'
import Overview from './overView'
import hot from '@/assets/hot.svg'

const { TextArea } = Input

@connect(({ global }) => ({
  theme: global.theme,
}))
class AppListCard extends React.Component {
  state = {
    drawerVisible: false,
    appCreateName: '',
    appCreateDesc: '',
    appCreateScope: 'domain_range',
    domain_range: '',
    ip_segment: '',
    keyword_match: '',
    domainRangeOptions: [],
    keywordMatchOptions: [],

    appList: [],
    extendAppList: [],
    pageNum: 1,
    pageSize: 4,
    totalNum: 0,
    extendPageNum: 1,
    extendPageSize: 10,
    extendTotalNum: 0,
    isCreating: true, // true-创建 false-修改
    editRecordId: '',
    unassortedCount: 0,
    extendListShow: false,
  }

  componentDidMount() {
    this.getAppList()
  }

  getAppList = () => {
    const { pageSize, pageNum } = this.state

    getApps({
      PageNum: pageNum,
      PageSize: pageSize,
    })
      .then((res) => {
        if (res.Code === 'Succeed') {
          const { Apps = [], Total = 0, UnassortedCount = 0 } = res.Data || {}

          this.setState({
            appList: Apps,
            totalNum: Total,
            unassortedCount: UnassortedCount,
          })
        }
      })
      .catch((err) => console.log(err))
  }
  getExtendAppList = () => {
    const { extendPageNum, extendPageSize } = this.state

    getApps({
      PageNum: extendPageNum,
      PageSize: extendPageSize,
    })
      .then((res) => {
        if (res.Code === 'Succeed') {
          const { Apps = [], Total = 0, UnassortedCount = 0 } = res.Data || {}

          this.setState({
            extendAppList: Apps,
            extendTotalNum: Total,
            unassortedCount: UnassortedCount,
          })
        }
      })
      .catch((err) => console.log(err))
  }
  createApp = () => {
    const { appCreateDesc, appCreateName, appCreateScope } = this.state
    const { intl } = this.props

    createApp({
      Name: appCreateName,
      Description: appCreateDesc,
      AssetRangeType: appCreateScope,
      AssetTypeValue: this.state[appCreateScope],
    })
      .then((res) => {
        if (res.status === 403) return message.warning('创建失败，应用名称已存在')

        if (res.Code === 'Succeed') {
          this.setState({
            drawerVisible: false,
            appCreateName: '',
            appCreateDesc: '',
            appCreateScope: 'domain_range',
            domain_range: '',
            ip_segment: '',
            keyword_match: '',
            editRecordId: '',
          })
          message.success(intl.formatMessage({ id: 'pages.asset.management.createapp.success' }))

          setTimeout(() => {
            this.getAppList()
            this.getExtendAppList()
          }, 200)
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }

  editApp = () => {
    const { appCreateDesc, appCreateName, appCreateScope, editRecordId } = this.state

    modifyApp({
      Name: appCreateName,
      Description: appCreateDesc,
      AssetRangeType: appCreateScope,
      AssetTypeValue: this.state[appCreateScope],
      AppId: editRecordId,
    })
      .then((res) => {
        if (res.Code === 'Succeed') {
          this.setState({
            drawerVisible: false,
            appCreateName: '',
            appCreateDesc: '',
            appCreateScope: 'domain_range',
            domain_range: '',
            ip_segment: '',
            keyword_match: '',
            editRecordId: '',
          })
          message.success('编辑应用成功')

          setTimeout(() => {
            this.getAppList()
            this.getExtendAppList()
          }, 200)
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }

  moreExtra = ({ AppId, Name, Description, Range, RangeType }) => {
    const menu = (
      <Menu>
        <Menu.Item
          key="1"
          onClick={async (e) => {
            e.domEvent.stopPropagation()
            this.setState({
              drawerVisible: true,
              isCreating: false,
              editRecordId: AppId,
              appCreateName: Name,
              appCreateDesc: Description,
              appCreateScope: RangeType,
              [RangeType]: Range,
            })
          }}
        >
          编辑应用
        </Menu.Item>
        <Menu.Item
          key="2"
          style={{ color: 'red' }}
          onClick={async (e) => {
            e.domEvent.stopPropagation()

            const { Code } = await deleteApp({ AppId, AppName: Name })
            if (Code !== 'Succeed') return

            message.success('删除应用成功')
            this.getAppList()
            this.getExtendAppList()
          }}
        >
          删除应用
        </Menu.Item>
      </Menu>
    )

    return (
      <Dropdown overlay={menu} placement="bottom">
        <EllipsisOutlined className={styles.moreIcon} onClick={(e) => e.stopPropagation()} />
      </Dropdown>
    )
  }

  onDomainRangeSelect = (data) => {
    console.log('onDomainRangeSelect', data)
  }

  onDomainRangeSearch = async (searchText) => {
    if (!searchText) {
      return this.setState({ domainRangeOptions: [] })
    }
    const { Code, Data } = await searchDomainMatch({
      AssetRangeType: 'domain_range',
      AssetTypeValue: searchText,
    })
    if (Code !== 'Succeed') return

    this.setState({
      domainRangeOptions: Data.map((kw) => ({ value: kw })),
    })
  }

  onDomainRangeChange = (data) => {
    this.setState({ domain_range: data })
  }

  onKeywordMatchSelect = (data) => {
    console.log('onKeywordMatchSelect', data)
  }

  onKeywordMatchSearch = async (searchText) => {
    if (!searchText) {
      return this.setState({ keywordMatchOptions: [] })
    }
    const { Code, Data } = await searchDomainMatch({
      AssetRangeType: 'keyword_match',
      AssetTypeValue: searchText,
    })
    if (Code !== 'Succeed') return

    this.setState({
      keywordMatchOptions: Data.map((kw) => ({ value: kw })),
    })
  }

  onKeywordMatchChange = (data) => {
    this.setState({ keyword_match: data })
  }

  render() {
    const {
      drawerVisible,
      appList,
      extendAppList,
      isCreating,
      unassortedCount,
      extendListShow,
      pageNum,
      pageSize,
      totalNum,
      extendPageNum,
      extendPageSize,
      extendTotalNum,
    } = this.state
    const { intl, theme } = this.props
    const radioOptions = [
      { label: '域名', value: 'domain_range' },
      { label: 'IP网段', value: 'ip_segment' },
      { label: '关键字匹配', value: 'keyword_match' },
    ]
    const darkStyle = {
      wrapper: {
        border: '1px solid #282C38',
        backgroundColor: '#26264E',
      },
      name: {
        color: 'rgba(255, 255, 255, 0.87)',
      },
      count: {
        color: 'rgba(235, 235, 245, 0.6)',
      },
      unAssortedText: {
        color: 'rgba(235, 235, 245, 0.6)',
      },
      extend: {
        color: '#8B8AA8',
      },
      unassortedCount: {
        color: '#fff',
      },
    }
    const lightStyle = {
      wrapper: {
        border: '1px solid rgba(82, 78, 238, 0.16)',
        background: '#F7F7FF',
      },
      name: {
        color: 'rgba(29, 29, 66, 0.87)',
      },
      count: {
        color: 'rgba(29, 29, 66, 0.6)',
      },
      unAssortedText: {
        color: 'rgba(29, 29, 66, 0.6)',
      },
      extend: {
        color: '#C4C4C4',
      },
      unassortedCount: {
        color: 'rgba(29, 29, 66, 0.6)',
      },
    }
    const styleSheet = theme === 'dark' ? darkStyle : lightStyle
    return (
      <>
        <Row gutter={24}>
          <Col span={12}>
            <Overview />
          </Col>
          <Col span={12}>
            {appList.length !== 0 ? (
              <ProCard
                gutter={16}
                title={
                  <div>
                    <span>应用列表</span>
                    <span className={styles.unAssorted} style={{ ...styleSheet.unAssortedText }}>
                      未分类资产数量：
                      <Button
                        type="link"
                        className={styles.unAssortedCount}
                        onClick={() => {
                          history.push({
                            pathname: '/assets/api/app',
                            query: {
                              appId: 'UnclassifiedAssets',
                            },
                          })
                        }}
                      >
                        {unassortedCount}
                        <DoubleRightOutlined className={styles.afterCountIcon} />
                      </Button>
                    </span>
                  </div>
                }
                extra={
                  <FullscreenOutlined
                    style={{ ...styleSheet.extend }}
                    onClick={() => {
                      this.setState({ extendListShow: true })
                      this.getExtendAppList()
                    }}
                  />
                }
                wrap
                className={styles.AppList}
              >
                {appList.map((i) => {
                  return (
                    <ProCard
                      onClick={() => {
                        history.push({
                          pathname: '/assets/api/app',
                          query: {
                            appId: i.AppId,
                          },
                        })
                      }}
                      key={i.AppId}
                      className={styles.App}
                      style={{ ...styleSheet.wrapper }}
                      colSpan="50%"
                    >
                      <Row gutter={8} align="middle">
                        <Col span={8} className={styles.AppTitle} style={{ ...styleSheet.name }}>
                          {i.Name}
                        </Col>
                        <Col span={12} className={styles.apiCount} style={{ ...styleSheet.count }}>
                          总API:{i.ApiCount}
                        </Col>
                        <Col span={4}>
                          {/* <EllipsisOutlined className={styles.moreIcon} /> */}
                          {this.moreExtra(i)}
                        </Col>
                      </Row>
                      <Row gutter={8} align="middle">
                        <Col span={8}>
                          <img src={hot} style={{ width: '16px', marginRight: '7px' }} />
                          <span className={styles.AppTitle} style={{ ...styleSheet.name }}>
                            {i.EventsCount}
                          </span>
                        </Col>
                        <Col span={16}>
                          <Typography.Text
                            ellipsis={{ tooltip: i.Range }}
                            className={styles.apiCount}
                            style={{ ...styleSheet.count }}
                          >
                            <MenuOutlined style={{ marginRight: '5px' }} />
                            <span>{i.Range}</span>
                          </Typography.Text>
                        </Col>
                      </Row>
                    </ProCard>
                  )
                })}
                <div className={styles.appCardFooter}>
                  <Button
                    type="primary"
                    size="mid"
                    onClick={(e) => {
                      e.stopPropagation()
                      this.setState({
                        drawerVisible: true,
                        isCreating: true,
                      })
                    }}
                  >
                    {intl.formatMessage({ id: 'pages.asset.management.createapp' })}
                  </Button>
                  <Pagination
                    current={pageNum}
                    size="small"
                    pageSize={pageSize}
                    showQuickJumper
                    showSizeChanger={false}
                    total={totalNum}
                    onChange={(page, pageSize) => {
                      this.setState({ pageNum: page, pageSize: pageSize }, () => this.getAppList())
                    }}
                  />
                </div>
              </ProCard>
            ) : (
              <ProCard title="应用列表" className={styles.noAppShow}>
                <div>
                  <div>
                    <Button
                      type="link"
                      className={styles.noAppUnAssorted}
                      onClick={() => {
                        history.push({
                          pathname: '/assets/api/app',
                          query: {
                            appId: 'UnclassifiedAssets',
                          },
                        })
                      }}
                    >
                      未分类资产数量
                      <DoubleRightOutlined className={styles.afterCountIcon} />
                    </Button>
                  </div>

                  <div className={styles.noAppUnAssortedCount}>{unassortedCount}</div>
                  <div style={{ textAlign: 'center' }}>
                    <Button
                      type="primary"
                      size="mid"
                      onClick={(e) => {
                        e.stopPropagation()
                        this.setState({
                          drawerVisible: true,
                          isCreating: true,
                        })
                      }}
                    >
                      {intl.formatMessage({ id: 'pages.asset.management.createapp' })}
                    </Button>
                  </div>
                </div>
              </ProCard>
            )}
            <Modal
              title="应用列表"
              visible={extendListShow}
              onCancel={() => {
                this.setState({ extendListShow: false })
              }}
              footer={null}
              centered
              width="640px"
            >
              <div className={styles.extendListTop}>
                <div>
                  <span
                    className={styles.extendUnAssorted}
                    style={{ ...styleSheet.unAssortedText }}
                  >
                    未分类资产数量:
                  </span>
                  <span
                    className={styles.extendUnAssortedCount}
                    style={{ ...styleSheet.unassortedCount }}
                  >
                    {unassortedCount}
                  </span>
                </div>

                <Button
                  type="primary"
                  size="mid"
                  onClick={(e) => {
                    e.stopPropagation()
                    this.setState({
                      drawerVisible: true,
                      isCreating: true,
                      extendListShow: false,
                    })
                  }}
                >
                  {intl.formatMessage({ id: 'pages.asset.management.createapp' })}
                </Button>
              </div>
              <div style={{ marginTop: '14px' }}>
                {extendAppList.map((i) => {
                  return (
                    <ProCard
                      onClick={() => {
                        history.push({
                          pathname: '/assets/api/app',
                          query: {
                            appId: i.AppId,
                          },
                        })
                      }}
                      key={i.AppId}
                      className={styles.App}
                      style={{ ...styleSheet.wrapper }}
                      colSpan="50%"
                    >
                      <Row gutter={8} align="middle">
                        <Col span={8} className={styles.AppTitle} style={{ ...styleSheet.name }}>
                          {i.Name}
                        </Col>
                        <Col span={12} className={styles.apiCount} style={{ ...styleSheet.count }}>
                          总API:{i.ApiCount}
                        </Col>
                        <Col span={4}>
                          {/* <EllipsisOutlined className={styles.moreIcon} /> */}
                          {this.moreExtra(i)}
                        </Col>
                      </Row>
                      <Row gutter={8} align="middle">
                        <Col span={8}>
                          <img src={hot} style={{ width: '16px', marginRight: '7px' }} />
                          <span className={styles.AppTitle} style={{ ...styleSheet.name }}>
                            {i.EventsCount}
                          </span>
                        </Col>
                        <Col span={16}>
                          <Typography.Text
                            ellipsis={{ tooltip: i.Range }}
                            className={styles.apiCount}
                            style={{ ...styleSheet.count }}
                          >
                            <MenuOutlined style={{ marginRight: '5px' }} />
                            <span>{i.Range}</span>
                          </Typography.Text>
                        </Col>
                      </Row>
                    </ProCard>
                  )
                })}
              </div>
              <div className={styles.extendListFooter}>
                <Pagination
                  current={extendPageNum}
                  pageSize={extendPageSize}
                  showQuickJumper
                  showSizeChanger
                  pageSizeOptions={[5, 10]}
                  total={extendTotalNum}
                  onChange={(page, pageSize) => {
                    this.setState({ extendPageNum: page, extendPageSize: pageSize }, () => {
                      this.getExtendAppList()
                    })
                  }}
                />
              </div>
            </Modal>
          </Col>
        </Row>

        <Modal
          title={
            isCreating
              ? intl.formatMessage({ id: 'pages.asset.management.createapp.title' })
              : '编辑应用'
          }
          bodyStyle={{ padding: '24px 32px' }}
          headerStyle={{ padding: '24px 32px' }}
          onClose={() => {
            this.setState({
              drawerVisible: false,
              appCreateName: '',
              appCreateDesc: '',
              appCreateScope: 'domain_range',
              domain_range: '',
              ip_segment: '',
              keyword_match: '',
              editRecordId: '',
            })
          }}
          onCancel={() => {
            this.setState({
              drawerVisible: false,
              appCreateName: '',
              appCreateDesc: '',
              appCreateScope: 'domain_range',
              domain_range: '',
              ip_segment: '',
              keyword_match: '',
              editRecordId: '',
            })
          }}
          visible={drawerVisible}
          width={480}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button
                onClick={() => {
                  this.setState({
                    drawerVisible: false,
                    appCreateName: '',
                    appCreateDesc: '',
                    appCreateScope: 'domain_range',
                    domain_range: '',
                    ip_segment: '',
                    keyword_match: '',
                    editRecordId: '',
                  })
                }}
              >
                {intl.formatMessage({ id: 'component.button.cancel' })}
              </Button>
              <Button
                onClick={() => {
                  const { appCreateDesc, appCreateName } = this.state
                  if (!appCreateName) {
                    message.warning(
                      intl.formatMessage({ id: 'pages.asset.management.createapp.name.required' }),
                    )
                    return
                  }
                  if (!appCreateDesc) {
                    message.warning(
                      intl.formatMessage({
                        id: 'pages.asset.management.createapp.description.required',
                      }),
                    )
                    return
                  }
                  isCreating ? this.createApp() : this.editApp()
                }}
                type="primary"
                style={{ marginRight: 8 }}
              >
                {isCreating
                  ? intl.formatMessage({ id: 'component.button.create' })
                  : intl.formatMessage({ id: 'component.button.save' })}
              </Button>
            </div>
          }
        >
          <div className={styles.appCreateItem}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>
              {intl.formatMessage({ id: 'pages.asset.management.createapp.label.name' })}
            </div>
            <Input
              value={this.state.appCreateName}
              placeholder="输入应用名称"
              onChange={(e) => {
                this.setState({
                  appCreateName: e.target.value,
                })
              }}
            />
          </div>
          <div className={styles.appCreateItem}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>
              {intl.formatMessage({ id: 'pages.asset.management.createapp.label.description' })}
            </div>
            <TextArea
              rows={4}
              value={this.state.appCreateDesc}
              placeholder="输入应用介绍"
              onChange={(e) => {
                this.setState({
                  appCreateDesc: e.target.value,
                })
              }}
            />
          </div>
          <div className={styles.appCreateItem}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>资产范围</div>
            <Radio.Group
              options={radioOptions}
              value={this.state.appCreateScope}
              optionType="button"
              buttonStyle="solid"
              style={{ marginBottom: 14 }}
              onChange={({ target: { value } }) => {
                this.setState({ appCreateScope: value })
              }}
            />
            <br />
            {this.state.appCreateScope === 'domain_range' && (
              <AutoComplete
                value={this.state.domain_range}
                options={this.state.domainRangeOptions}
                style={{ width: '100%' }}
                placeholder="请输入域名"
                onSelect={this.onDomainRangeSelect}
                onSearch={this.onDomainRangeSearch}
                onChange={this.onDomainRangeChange}
              />
            )}
            {this.state.appCreateScope === 'ip_segment' && (
              <Input
                placeholder='请输入IP网段，多个请用英文逗号","分割'
                value={this.state.ip_segment}
                onChange={({ target: { value } }) => {
                  this.setState({ ip_segment: value })
                }}
              />
            )}
            {this.state.appCreateScope === 'keyword_match' && (
              <AutoComplete
                value={this.state.keyword_match}
                options={this.state.keywordMatchOptions}
                style={{ width: '100%' }}
                placeholder="请输入关键字"
                onSelect={this.onKeywordMatchSelect}
                onSearch={this.onKeywordMatchSearch}
                onChange={this.onKeywordMatchChange}
              />
            )}
          </div>
        </Modal>
      </>
    )
  }
}

export default injectIntl(AppListCard)
