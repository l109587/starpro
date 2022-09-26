import React from 'react'
import ApiReqDetail from './apiReqDetail'
import ApiTableList from './apiTableList'

export default class TabContent extends React.Component {
  state = {}

  get page() {
    return {
      req: ApiReqDetail,
      res: ApiReqDetail,
      event: ApiTableList,
    }
  }

  render() {
    const { name, data } = this.props
    const PageContent = this.page[name]
    return (
      <div style={{ overflowY: 'auto', padding: '6px 24px 16px' }}>
        <PageContent name={name} data={data} />
      </div>
    )
  }
}
