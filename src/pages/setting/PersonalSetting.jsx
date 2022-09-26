import { Component } from 'react'
import AccountPart from './accountPart'
import SecurityPart from './securityPart'
import LoginRecord from './loginRecord'
import { getUserSettings } from '@/services/settings'
import { getUserId } from '@/utils/user'
import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import styles from './index.less'
import { connect } from 'umi'

@connect(({ global }) => ({ theme: global.theme }))
export default class PersonalSetting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      personalSettings: {},
    }
    this.onEditSettingsSuccess = this.onEditSettingsSuccess.bind(this)
  }

  async fetchPersonalSettings() {
    const UserId = getUserId()
    const { Code, Data, Message } = await getUserSettings({ UserId })

    // get user setting data failed
    if (Code !== 'Succeed') return

    // get user setting data successed
    this.setState({
      personalSettings: Data || {},
    })
  }

  onEditSettingsSuccess() {
    this.fetchPersonalSettings()
  }

  componentDidMount() {
    this.fetchPersonalSettings()
  }

  render() {
    const { personalSettings } = this.state

    return (
      <PageContainer
        header={{
          title: (
            <span
              style={{
                color: this.props.theme === 'dark' ? '#fff' : '#000',
                fontSize: 14,
                fontWeight: 400,
              }}
            >
              个人设置
            </span>
          ),
        }}
        className={styles.usePageContainer}
      >
        <ProCard className={styles.settingContainer}>
          <AccountPart
            mySettings={personalSettings}
            onEditSettingsSuccess={this.onEditSettingsSuccess}
          />
          <SecurityPart
            mySettings={personalSettings}
            onEditSettingsSuccess={this.onEditSettingsSuccess}
          />
          <LoginRecord mySettings={personalSettings} />
        </ProCard>
      </PageContainer>
    )
  }
}
