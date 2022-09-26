import { mock } from 'mockjs'

export default {
  'GET /console/GetIpPortraitDetails': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          ActivedAt: '@date',
          Apps: [
            {
              AppId: 1,
              Name: '视频业务',
            },
            {
              AppId: 2,
              Name: '游戏业务',
            },
          ],
          FoundAt: '@datetime',
          Ip: '@ip',
          Location: '@city',
          ReuqestsCount: '@integer(1, 100)',
          TagsCount: '@integer(1, 100)',
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'GET /console/GetIpEventsScatters': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          'Scatters|10': [
            {
              'EventName|1': ['SQL 注入', 'DDOS', 'XXS'],
              Index: '@integer',
              Date: '@date',
              'Hour|0-23': 0,
              CreatedAt: '@datetime',
            },
          ],
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'GET /console/GetIpEventsDistribution': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          Stat: [
            {
              Count: '@integer(1, 100)',
              Key: 'High',
            },
            {
              Count: '@integer(1, 100)',
              Key: 'Medium',
            },
            {
              Count: '@integer(1, 100)',
              Key: 'Low',
            },
            {
              Count: '@integer(1, 100)',
              Key: 'Info',
            },
          ],
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'GET /console/GetIpReuqestsTrends': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          'Trends|7': [
            {
              Count: '@integer(1, 100)',
              Index: '@integer',
              Date: '@date',
              'Hour|1-24': 0,
            },
          ],
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'GET /console/GetIpsTop': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          'Stat|10': [
            {
              Count: '@integer(1, 1000)',
              Key: '@ip',
            },
          ],
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'GET /console/GetIpTagsClustered': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          'Categories|10': [
            {
              Count: '@integer(1, 100)',
              'EntityType|1': ['手机号', '护照', '电子卡', '身份证', '银行卡'],
              Index: '@integer',
            },
          ],
          Total: 100,
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'GET /console/GetIpTagEntitiesClustered': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          'Entities|10': [
            {
              EntityValue: '@integer(1, 1000)',
              Index: '@integer',
              UpdatedAt: '@datetime',
            },
          ],
          Total: 100,
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'GET /console/GetIpRisks': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          'Risks|10': [
            {
              Apps: [
                {
                  AppId: 1,
                  Name: '视频业务',
                },
                {
                  AppId: 2,
                  Name: '游戏业务',
                },
              ],
              Index: '@integer',
              RiskName: '@cname 注入攻击',
              RiskId: '@integer',
              'Severity|1': ['High', 'Medium', 'Low'],
              'Status|1': ['Undisposed', 'Disposed', 'Ignored', 'FalsePositive'],
              UpdatedAt: '@datetime',
              Url: '@url',
            },
          ],
          Total: 100,
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'POST /console/ModifyIpRisksStatus': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {},
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'GET /console/GetIpEvents': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          'Events|10': [
            {
              Apps: [
                {
                  AppId: 1,
                  Name: '视频业务',
                },
                {
                  AppId: 2,
                  Name: '游戏业务',
                },
              ],
              EventId: '@integer',
              EventName: '@cname 注入攻击',
              Index: '@integer',
              'Severity|1': ['High', 'Medium', 'Low'],
              'Status|1': ['Undisposed', 'Disposed', 'Ignored', 'FalsePositive'],
              UpdatedAt: '@datetime',
              Url: '@url',
              SrcHost: '@ip',
            },
          ],
          Total: 100,
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'POST /console/ModifyIpEventsStatus': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {},
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
}
