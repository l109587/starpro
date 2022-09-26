import React from 'react'
import { message, Tree, Typography } from 'antd'
import {
  getBranchUrls,
  getListAppNodeUrls,
  getBranchApis,
  getListAppNodeApis,
} from '@/services/assets'
import styles from './index.less'
import { injectIntl } from 'umi'
import { Loading3QuartersOutlined } from '@ant-design/icons'

class TreeSelect extends React.Component {
  state = {
    checkedKeys: [],
    height: 860,
  }

  onCheck = (checkedKeysValue, e) => {
    this.setState(
      {
        checkedKeys: checkedKeysValue,
      },
      () => {
        const urls = e.checkedNodes.map((el) => el.url || el.Api)

        this.props.onCheck(urls)
      },
    )
  }

  get queryMap() {
    const { search } = window.location
    let res = {}
    if (search) {
      res = search.split('?') && search.split('?')[1]
      res = res.split('&')
      res = res.reduce((acc, i) => {
        const [k, v] = i.split('=')
        acc[k] = v
        return acc
      }, {})
    }

    return res
  }

  get appId() {
    return (this.queryMap && this.queryMap.appId) || ''
  }

  onSelect = (selectedKeysValue, info) => {
    const { assetsType, onUrlListLoading } = this.props
    const { title, key, count, isLeaf, appId, url, Api } = info.node || {}

    let req = getListAppNodeApis
    if (assetsType === 'url') req = getListAppNodeUrls
    onUrlListLoading(true)

    req({
      PageNum: 1,
      PageSize: 10,
      // AppId: appId,
      AppId: this.appId || undefined,
      Url: url,
      Api,
    }).then((res) => {
      if (res.Code === 'Succeed') {
        const resData = res.Data || {}
        const leafApis = resData.Urls || resData.Apis || []
        const Total = resData.Total

        onUrlListLoading(false)
        this.props.renderApis({
          leafApis,
          Total,
          AppId: appId,
          Url: url,
          Api,
        })
      }
    })
  }

  updateTreeData = (list, key, children) => {
    return list.map((node) => {
      if (node.key === key) {
        return { ...node, children }
      }

      if (node.children) {
        return { ...node, children: this.updateTreeData(node.children, key, children) }
      }

      return node
    })
  }

  getTitle(name, count) {
    return (
      <div className={styles.flexNode}>
        <div className={styles.apiNodeName}>{name}</div>
        <div className={styles.pRightBadge2}>
          <Typography.Text style={{ width: '100%' }} ellipsis={{ tooltip: count }}>
            {String(count)}
          </Typography.Text>
        </div>
      </div>
    )
  }

  onLoadData = ({ title, key, count, isLeaf, appId, url, children, Api }) => {
    const { assetsType } = this.props

    return new Promise((resolve) => {
      if (children) {
        resolve()
        return
      }

      let req = getBranchApis
      if (assetsType === 'url') req = getBranchUrls

      req({
        AppId: appId,
        Url: url,
        Api,
      }).then((res) => {
        if (res.Code === 'Succeed') {
          const Urls = res.Data || []
          const { onLoadChildren } = this.props

          onLoadChildren(
            key,
            Urls.map((e) => {
              return {
                key: e.UniqueId,
                title: this.getTitle(e.Node, e.Count),
                url: e.Url,
                isLeaf: e.IsLeaf,
                count: e.Count,
                appId: e.AppId,
                Api: e.Api,
              }
            }),
            () => {
              resolve()
              // 默认渲染第一个子节点的叶子apis
              if (Urls.length) {
                const { Url, IsLeaf, Count, AppId, UniqueId, Api: api } = Urls[0]
                const node = {
                  title: Url,
                  key: UniqueId,
                  count: Count,
                  isLeaf: IsLeaf,
                  appId: AppId,
                  url: Url,
                  Api: api,
                }

                this.onSelect([key], { node })
              }
            },
          )
        } else {
          const { intl } = this.props

          message.error(intl.formatMessage({ id: 'component.treeSelect.message.getFail' }))
        }
      })
    })
  }

  onWheel = () => {
    const { height } = this.state
    const { onSitemapScroll, assetsType } = this.props
    const scrollbar = document.querySelector(
      `.sitemap-tree-${assetsType} .ant-tree-list-scrollbar-thumb`,
    )
    const elementTop = parseFloat(scrollbar.style.top)
    const elementHeight = parseFloat(scrollbar.style.height)

    onSitemapScroll(elementTop + elementHeight >= height)
  }

  componentDidMount() {
    const { assetsType } = this.props
    const target = document.querySelector(`.sitemap-tree-${assetsType} .ant-tree-list`)
    target.addEventListener('wheel', this.onWheel)
  }

  componentWillUnmount() {
    const { assetsType } = this.props
    const target = document.querySelector(`.sitemap-tree-${assetsType} .ant-tree-list`)
    target.removeEventListener('wheel', this.onWheel)
  }

  render() {
    const { height } = this.state
    const { loading, intl, options, assetsType } = this.props
    const treeData = options.map((e) => {
      return {
        key: e.UniqueId,
        title: this.getTitle(e.Node, e.Count),
        url: e.Url,
        isLeaf: e.IsLeaf,
        count: e.Count,
        appId: e.AppId,
        children: e.children,
        Api: e.Api,
      }
    })

    return (
      <div className={styles.muiltySelect}>
        <Tree
          checkable
          blockNode
          style={{ width: '100%', paddingRight: 10 }}
          onCheck={this.onCheck}
          checkedKeys={this.state.checkedKeys}
          onSelect={this.onSelect}
          treeData={treeData}
          loadData={this.onLoadData}
          height={height}
          className={`sitemap-tree-${assetsType}`}
        />
        {loading && (
          <div style={{ textAlign: 'center', paddingBottom: 6 }}>
            {intl.formatMessage({ id: 'component.loading' })}
            <Loading3QuartersOutlined
              spin
              style={{ fontSize: 12, color: '#1785ff', marginLeft: 4 }}
            />
          </div>
        )}
      </div>
    )
  }
}

export default injectIntl(TreeSelect)
