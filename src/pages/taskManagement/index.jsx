import React from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import { Spin, Button } from 'antd'
import TaskSumary from './taskSumary'
import TaskTable from './taskTable'
import TaskEdit from './taskEdit'
import { injectIntl } from 'umi'

class TaskManagement extends React.Component {
  state = {
    loading: false,
    drawerVisible: false,
  }

  componentDidMount() {}

  render() {
    const { drawerVisible } = this.state
    const { intl } = this.props

    return (
      <>
        <Spin spinning={this.state.loading} tip="Loading">
          <PageContainer header={{ title: null }}>
            <ProCard
              title={intl.formatMessage({ id: 'pages.task.management.overview' })}
              style={{ marginTop: 30 }}
              headerBordered
              split="horizontal"
              extra={
                <Button
                  onClick={() => {
                    this.setState({
                      drawerVisible: true,
                    })
                  }}
                  type="primary"
                >
                  {intl.formatMessage({ id: 'pages.task.management.button.create.task' })}
                </Button>
              }
            >
              <TaskSumary />
            </ProCard>
            <ProCard style={{ marginTop: 30 }} headerBordered split="horizontal">
              <TaskTable />
            </ProCard>
          </PageContainer>
        </Spin>
        {drawerVisible ? (
          <TaskEdit
            onClose={() => {
              this.setState({
                drawerVisible: false,
              })
            }}
          />
        ) : null}
      </>
    )
  }
}

export default injectIntl(TaskManagement)
