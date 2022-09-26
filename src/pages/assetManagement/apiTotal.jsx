import React from 'react'
import { Button, message } from 'antd'
import TreeSelect from './treeSelect'
import styles from './index.less'
import ApiAddToApps from './apiAddToApps'
import { injectIntl } from 'umi'

class ApiTotal extends React.Component {
  state = {
    drawerVisible: false,
    apiSelectList: [], // Selected APIs
  }

  get apiSelectNum() {
    const { apiSelectList } = this.state

    return apiSelectList.length
  }

  onDrawerVisibleChange = (visible) => {
    this.setState({
      drawerVisible: visible,
    })
  }

  render() {
    const { drawerVisible, apiSelectList } = this.state
    const {
      rootApis = [],
      intl,
      onSitemapScroll,
      loading,
      onLoadChildren,
      assetsType,
      onChangeLeafApis,
      onUrlListLoading,
    } = this.props

    return (
      <div className={styles.siteMapWrapper}>
        <div className={styles.apiMuiltyWrap}>
          <TreeSelect
            options={rootApis}
            assetsType={assetsType}
            loading={loading}
            onLoadChildren={onLoadChildren}
            onCheck={(checkedUrls) => this.setState({ apiSelectList: checkedUrls })}
            onSitemapScroll={onSitemapScroll}
            onUrlListLoading={onUrlListLoading}
            renderApis={({ leafApis, Total, AppId, Url, Api }) => {
              onChangeLeafApis({
                leafApis,
                Total,
                AppId,
                Url,
                Api,
              })
            }}
          />
        </div>
        <div className={styles.apiTotalFooter}>
          <span>
            {intl.formatMessage(
              { id: 'component.asset.list.selected.nodes' },
              {
                count: this.apiSelectNum,
                span: (str) => <span style={{ color: '#1890ff' }}> {str} </span>,
              },
            )}
          </span>
          <Button
            onClick={() => {
              if (!this.apiSelectNum) {
                message.warning(
                  intl.formatMessage(
                    { id: 'component.asset.list.api.required' },
                    { type: (assetsType || '').toUpperCase() },
                  ),
                )
                return
              }
              this.setState({
                drawerVisible: true,
              })
            }}
            type="primary"
          >
            {intl.formatMessage({ id: 'component.asset.list.button.addtoapp' })}
          </Button>
        </div>
        <ApiAddToApps
          visible={drawerVisible}
          chooseUrls={apiSelectList}
          assetsType={assetsType}
          onVisibleChange={this.onDrawerVisibleChange}
        />
      </div>
    )
  }
}

export default injectIntl(ApiTotal)
