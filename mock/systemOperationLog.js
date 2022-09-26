import { mock } from 'mockjs'

export default {
  'GET /console/GetSystemLogs': mock({
    Code: 'Succeed',
    Data: {
      BehaviorCounts: 1000, // 行为总数
      Logs: [
        {
          Index: '1',
          behaviorName: '应用管理/获取应用列表成功',
          name: '胡彦斌',
          operationTime: '2021-11-25',
        },
        {
          Index: '2',
          behaviorName: '应用管理/获取应用列表成功',
          name: '吴彦祖',
          operationTime: '2021-11-25',
        },
        {
          Index: '3',
          behaviorName: '应用管理/获取应用列表成功',
          name: '迪丽热巴',
          operationTime: '2021-11-25',
        },
        {
          Index: '4',
          behaviorName: '应用管理/获取应用列表成功',
          name: '古力娜扎',
          operationTime: '2021-11-25',
        },
      ],
      Message: 'Succeed',
      RequestId: '',
    },
  }),
  'GET /console/QueryLogToKafka': mock({
    Code: 'Succeed',
    Data: {
      KafkaHost: 'app1:9091',
      KafkaTopic: 'dumper',
    },
    Message: 'Succeed',
    RequestId: '',
  }),
  'GET /console/CreateLogToKafka': mock({
    Code: 'Succeed',
    Data: {},
    Message: 'Succeed',
    RequestId: '',
  }),
}
