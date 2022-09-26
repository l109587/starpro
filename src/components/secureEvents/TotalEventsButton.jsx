import { Button } from 'antd'
import { DoubleRightOutlined } from '@ant-design/icons'
import { esIndex, esPort } from '@/constant/content'

const TotalEventsButton = (props) => {
  const { details } = props
  const { AttackerSrcHost, API, Type, Count } = details

  const hostname = new URL(window.location.href).hostname
  const columns =
    'name,action_name,app_name,type,api,severity,scheme,method,dst_host,path,attacker_src_host,created_at,request_details,response_details'
  const query = encodeURIComponent(
    `attacker_src_host : "${AttackerSrcHost}" and type : "${Type}"  and api : "${API}"`,
  )
  const url = `http://${hostname}:${esPort}/app/kibana#/discover?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-1y,to:now))&_a=(columns:!(${columns}),filters:!(),index:'${esIndex}',interval:auto,query:(language:kuery,query:'${query}'),sort:!())`

  return (
    <Button type="text" style={{ marginLeft: 4 }} href={url} target="_blank">
      共攻击<span style={{ color: '#1890ff', margin: '0 2px' }}>{Count}</span>次
      <DoubleRightOutlined style={{ color: '#1890ff', marginLeft: 2, fontSize: 14 }} />
    </Button>
  )
}

export default TotalEventsButton
