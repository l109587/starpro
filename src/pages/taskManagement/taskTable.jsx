import React from 'react'
import { Tabs } from 'antd'
import TableTask from './tableTask'
import TableTaskInstance from './tableTaskInstance'
import { injectIntl } from 'umi'
import styles from './index.less'

const { TabPane } = Tabs

class TaskTable extends React.Component {
  state = {};

  render() {
    const { intl } = this.props

    return (
      <div className={styles.tableCard}>
        <Tabs style={{ padding: '0 20px' }} defaultActiveKey={'task'}>
          <TabPane tab={intl.formatMessage({ id: 'pages.task.management.task' })} key={'task'}>
            <TableTask />
          </TabPane>
          <TabPane
            tab={intl.formatMessage({ id: 'pages.task.management.task.instance' })}
            key={'taskInstance'}
          >
            <TableTaskInstance />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default injectIntl(TaskTable)
