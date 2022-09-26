import React from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import styles from './index.less'
import UsersManagement from './usersManagement'
import { injectIntl } from 'umi'

class Setting extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      tabKey: 'Users',
    }
  }

  render() {
    const { tabKey } = this.state
    const { intl } = this.props
    const tabTitle = (title) => <div style={{ fontSize: '16px' }}>{title}</div>

    return (
      <PageContainer header={{ title: null }}>
        <ProCard
          tabs={{
            activeKey: tabKey,
            onChange: (key) => this.setState({ tabKey: key }),
          }}
          className={styles.settingContainer}
        >
          <ProCard.TabPane
            key="Users"
            tab={tabTitle(intl.formatMessage({ id: 'pages.settings.tab.users' }))}
          >
            <UsersManagement />
          </ProCard.TabPane>
        </ProCard>
      </PageContainer>
    )
  }
}

export default injectIntl(Setting)
