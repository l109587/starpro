import { Component } from 'react'
import { Drawer, Button, Select, message } from 'antd'
import styles from './index.less'
import { addUrlsToApps, getApps } from '@/services/assets'
import { injectIntl, history } from 'umi'

const { Option } = Select

class ApiAddToApps extends Component {
  constructor(props) {
    super(props)
    this.state = {
      apps: [],
      chooseApps: [], // selected APPs
      hasMore: true,
      pageNum: 1,
      pageSize: 10,
      total: 0,
    }
  }

  componentDidMount() {
    this.fetchData(({ Data: { Apps, Total } }) => this.setState({ apps: Apps, total: Total }))
  }

  componentDidUpdate(preProps) {
    if (this.props.timestamp !== preProps.timestamp) {
      this.fetchData(({ Data: { Apps, Total } }) => this.setState({ apps: Apps, total: Total }))
    }
  }

  fetchData = async (cb) => {
    const { pageNum, pageSize } = this.state
    try {
      const res = await getApps({
        PageNum: pageNum,
        PageSize: pageSize,
      })

      cb(res)
    } catch (err) {
      console.log(err)
    }
  }

  loadMore = () => {
    const { apps, total } = this.state

    if (apps.length >= total) {
      return this.setState({
        hasMore: false,
      })
    }
    this.fetchData(({ Data: { Apps, Total } }) => {
      this.setState({
        apps: apps.concat(Apps),
        total: Total,
      })
    })
  }

  // 滚动加载
  onOptionsScroll = (e) => {
    const { hasMore, pageNum } = this.state
    if (!hasMore) return

    const { scrollHeight, scrollTop, clientHeight } = e.target
    const condition = scrollHeight - scrollTop <= clientHeight

    if (condition) {
      this.setState(
        {
          pageNum: pageNum + 1,
        },
        () => this.loadMore(),
      )
    }
  }

  addApisToApp = () => {
    const { chooseUrls, onVisibleChange, intl } = this.props
    const { chooseApps } = this.state
    const { appId } = history.location.query

    if (!chooseApps.length)
      return message.warning(intl.formatMessage({ id: 'component.addApisToApp.api.required' }))

    const url = appId ? '/console/AddAppApisToApps' : '/console/AddApisToApps'
    const params = appId
      ? {
          BaseApis: chooseUrls,
          Apps: chooseApps,
          AppId: appId,
        }
      : {
          BaseApis: chooseUrls,
          Apps: chooseApps,
        }

    addUrlsToApps(url, params).then((res) => {
      if (res.Code === 'Succeed') {
        message.success(intl.formatMessage({ id: 'component.addApisToApp.add.success' }))

        setTimeout(() => {
          onVisibleChange(false)
        }, 200)
      } else {
        message.error(intl.formatMessage({ id: 'component.addApisToApp.add.fail' }))
      }
    })
  }

  render() {
    const { visible, onVisibleChange, chooseUrls, intl } = this.props
    const { apps, chooseApps } = this.state

    return (
      <Drawer
        title={intl.formatMessage({ id: 'component.addApisToApp.addtoapp' })}
        placement="right"
        closable={false}
        bodyStyle={{ padding: '24px 32px' }}
        headerStyle={{ padding: '24px 32px' }}
        onClose={() => onVisibleChange(false)}
        visible={visible}
        width={400}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button
              onClick={() => {
                this.addApisToApp()
              }}
              type="primary"
              style={{ marginRight: 8 }}
            >
              {intl.formatMessage({ id: 'component.addApisToApp.button.add' })}
            </Button>
            <Button onClick={() => onVisibleChange(false)}>
              {intl.formatMessage({ id: 'component.addApisToApp.button.cancel' })}
            </Button>
          </div>
        }
      >
        <div className={styles.apiAddWrap}>
          <div style={{ marginBottom: 8 }}>
            {intl.formatMessage(
              { id: 'component.addApisToApp.selected.message' },
              {
                apiCount: chooseUrls.length,
                appCount: chooseApps.length,
                spancount: (str) => (
                  <span style={{ color: '#1890ff', fontWeight: 500 }}>{str} </span>
                ),
                spanbold: (str) => <span style={{ fontWeight: 500 }}> {str} </span>,
              },
            )}
          </div>
          <Select
            showSearch
            labelInValue
            mode="multiple"
            style={{ width: '100%' }}
            placeholder={intl.formatMessage({ id: 'component.addApisToApp.select.placeholder' })}
            optionFilterProp="children"
            onChange={(vals) => {
              this.setState({
                chooseApps: vals.map((e) => ({ AppId: e.value, AppName: e.label })),
              })
            }}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onPopupScroll={this.onOptionsScroll}
          >
            {apps.map((i) => {
              return (
                <Option key={i.AppId} value={i.AppId}>
                  {i.Name}
                </Option>
              )
            })}
          </Select>
        </div>
      </Drawer>
    )
  }
}

export default injectIntl(ApiAddToApps)
