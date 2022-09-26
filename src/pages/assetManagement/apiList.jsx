import { Component } from 'react'
import ApiTotal from './apiTotal'
import ApiDetail from './apiDetail'
import styles from './index.less'
import { getRootApis } from '@/services/assets'
import { injectIntl } from 'umi'
import { Spin, Input } from 'antd'

const { Search } = Input

class ApisManagement extends Component {
  state = {
    rootApis: [],
    apiSearchId: '',
    apiTotalNum: 0,
    leafApis: [],
    appConfig: {},
    PageNum: 1,
    PageSize: 50,
    searchValue: '',
    total: 0,
    hasMore: true,
    loading: false,
    pageLoading: false,
    urlListLoading: false,
  }

  componentDidMount() {
    this.fetchData(({ Data: { Apis, RootTotal, ApisTotal } }) =>
      this.setState({
        total: RootTotal,
        rootApis: Apis,
        apiTotalNum: ApisTotal,
      }),
    )
  }

  onRootSearch = (value) => {
    this.setState(
      {
        searchValue: value,
        PageNum: 1,
      },
      () => {
        this.fetchData(({ Data: { Apis, RootTotal, ApisTotal } }) =>
          this.setState({
            total: RootTotal,
            rootApis: Apis,
            apiTotalNum: ApisTotal,
          }),
        )
      },
    )
  }

  loadMore = () => {
    const { rootApis, total } = this.state

    if (rootApis.length >= total) {
      return this.setState({
        hasMore: false,
        loading: false,
      })
    }
    this.fetchData(({ Data: { Apis, RootTotal, ApisTotal } }) => {
      this.setState({
        rootApis: rootApis.concat(Apis),
        total: RootTotal,
        apiTotalNum: ApisTotal,
        loading: false,
      })
    })
  }

  onSitemapScroll = (flag) => {
    const { hasMore, PageNum, loading } = this.state
    if (!hasMore || loading) return

    if (flag) {
      this.setState(
        {
          PageNum: PageNum + 1,
          loading: true,
        },
        () => this.loadMore(),
      )
    }
  }

  fetchData = async (cb) => {
    const { PageNum, PageSize, searchValue } = this.state
    const { appId: AppId } = this.props
    const queryData = AppId ? { AppId } : {}
    queryData.PageNum = PageNum
    queryData.PageSize = PageSize
    queryData.Search = searchValue

    if (PageNum === 1) {
      this.setState({ pageLoading: true })
    }

    try {
      const res = await getRootApis(queryData)

      this.setState({ pageLoading: false })
      cb && cb(res)
    } catch (err) {
      console.log(err)
    }
  }

  refreshSitemap = () => {
    this.fetchData(({ Data: { Apis, RootTotal, ApisTotal } }) =>
      this.setState({
        total: RootTotal,
        rootApis: Apis,
        apiTotalNum: ApisTotal,
      }),
    )
  }

  updateTreeData = (list, key, children) => {
    return list.map((node) => {
      if (node.UniqueId === key || node.key === key) {
        return { ...node, children }
      }

      if (node.children) {
        return { ...node, children: this.updateTreeData(node.children, key, children) }
      }

      return node
    })
  }

  onLoadChildren = (key, childrenNodes, callback) => {
    const { rootApis } = this.state
    const newTree = this.updateTreeData(rootApis, key, childrenNodes)

    this.setState({ rootApis: newTree }, () => callback && callback())
  }

  onUrlListLoading = (flag) => {
    this.setState({ urlListLoading: flag })
  }

  render() {
    const { apiTotalNum, rootApis, loading, pageLoading, urlListLoading } = this.state
    const { intl } = this.props

    return (
      <Spin spinning={pageLoading}>
        <div className={styles.apiFlexWrap}>
          <div className={styles.apiFlexLeft}>
            <div className={styles.apiHeader}>
              <div className={styles.totalTitle}>
                <span style={{ marginRight: 10 }}>
                  {intl.formatMessage({ id: 'component.asset.list.total' })}
                </span>
                <span>{apiTotalNum}</span>
              </div>
              <Search
                placeholder="搜索根API"
                size="small"
                className={styles.rootSearch}
                onSearch={this.onRootSearch}
              />
            </div>
            {rootApis.length ? (
              <ApiTotal
                rootApis={rootApis}
                loading={loading}
                assetsType="api"
                onUrlListLoading={this.onUrlListLoading}
                onChangeLeafApis={({ leafApis, Total, AppId, Url, Api }) => {
                  this.setState({
                    leafApis: leafApis,
                    appConfig: {
                      Total,
                      AppId,
                      Url,
                      Api,
                    },
                  })
                }}
                onSitemapScroll={this.onSitemapScroll}
                onLoadChildren={this.onLoadChildren}
              />
            ) : null}
          </div>
          <div className={styles.apiFlexRight}>
            <div className={styles.apiHeader}>
              <span>{intl.formatMessage({ id: 'component.asset.list.url.list' })}</span>
            </div>
            <Spin spinning={urlListLoading}>
              <div style={{ minHeight: 200 }}>
                {!!this.state.leafApis.length && (
                  <ApiDetail
                    assetsType="api"
                    appConfig={this.state.appConfig}
                    leafApis={this.state.leafApis}
                    onDeleted={this.refreshSitemap}
                  />
                )}
              </div>
            </Spin>
          </div>
        </div>
      </Spin>
    )
  }
}

export default injectIntl(ApisManagement)
