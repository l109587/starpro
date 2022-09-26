import { mock } from 'mockjs'
export default {
  'GET /console/GetEntitiesStrategys': mock({
    Code: 'Succeed',
    Data: {
      StratrgyCounts: 1000, // 策略总数
      Stratrgys: [
        {
          Index: 1, // 序号
          EntityId: '1', // 实体 ID
          EntityName: '身份证', // 实体名称
          Classification: '个人信息', // 实体类别
          Sample: '130111199611111111', //  实体实例数据
          Description: '这是一个身份证号', // 实体描述
          OnOff: 1, // 是否开启器 开启 0 关闭 1
        },
        {
          Index: 2,
          EntityId: '2',
          EntityName: '身份证',
          Classification: '个人信息',
          Sample: '130111199611111111',
          Description: '这是一个身份证号',
          OnOff: 0,
        },
        {
          Index: 3,
          EntityId: '3',
          EntityName: '身份证',
          Classification: '个人信息',
          Sample: '130111199611111111',
          Description: '这是一个身份证号',
          OnOff: 0,
        },
      ],
      Message: 'Succeed',
      RequestId: '',
    },
  }),
  'GET /console/GetUrlIgnores': mock({
    Code: 'Succeed',
    Data: {
      UrlCounts: 1000, // Url总数
      Urls: [
        {
          Index: 1, // 序号
          UrlId: 1, // URL ID
          IsUsing: '0', // 是否忽略Url 忽略 0 不忽略 1
          Url: 'http://url.com', // Url
        },
        {
          Index: 2, // 序号
          UrlId: 2, // URL ID
          IsUsing: '0', // 是否忽略Url 忽略 0 不忽略 1
          Url: 'http://url.com', // Url
        },
        {
          Index: 3, // 序号
          UrlId: 3, // URL ID
          IsUsing: '0', // 是否忽略Url 忽略 0 不忽略 1
          Url: 'http://url.com', // Url
        },
      ],
      Message: 'Succeed',
      RequestId: '',
    },
  }),
  'GET /console/ModifyEntitiesStrategysOnOff': mock({
    Code: 'Succeed',
    Data: {},
    Message: 'Succeed',
    RequestId: '',
  }),
  'GET /console/GetEntityStrategyDetails': mock({
    Code: 'Succeed',
    Data: {
      Description: '港澳通行证。',
    },
    Message: 'Succeed',
    RequestId: '',
  }),
  'GET /console/AddUrlStrategy': mock({
    Code: 'Succeed',
    Data: {},
    Message: 'Succeed',
    RequestId: '',
  }),
  'GET /console/UpdateUrlStrategy': mock({
    Code: 'Succeed',
    Data: {},
    Message: 'Succeed',
    RequestId: '',
  }),
  'GET /console/DeleteUrlStrategy': mock({
    Code: 'Succeed',
    Data: {},
    Message: 'Succeed',
    RequestId: '',
  }),
  'GET /console/GetAlarmTestList': mock({
    Code: 'Succeed',
    Data: {
      AlarmCounts: 1000, // 告警总数
      Alarms: [
        {
          Index: 1, // 序号
          AlarmId: 1, // 告警 ID
          testCategory: 'SQL注入漏洞信息',
        },
        {
          Index: 2, // 序号
          AlarmId: 2, // 告警 ID
          testCategory: 'SQL注入漏洞信息',
        },
        {
          Index: 3, // 序号
          AlarmId: 3, // 告警 ID
          testCategory: 'SQL注入漏洞信息',
        },
      ],
      Message: 'Succeed',
      RequestId: '',
    },
  }),
}
