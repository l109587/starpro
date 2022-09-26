import { mock } from 'mockjs'

export default {
  'GET /console/GetApiPortraitDetails': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          ActivedAt: '@datetime',
          Api: '@url',
          Apps: [
            {
              AppId: 1,
              Name: '视频业务',
            },
            {
              AppId: 2,
              Name: '游戏业务',
            },
            {
              AppId: 3,
              Name: '娱乐业务',
            },
          ],
          FoundAt: '@datetime',
          'Method|1': ['GET', 'POST', 'DELETE', 'PUT'],
          TagsCount: '@integer(0, 100)',
          TrafficCount: '@integer(0, 10000)',
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'GET /console/GetApiTagsDistribution': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          Distributions: [
            {
              Count: 30,
              Key: '身份证',
              Proportion: '15.00%',
            },
            {
              Count: 200,
              Key: '护照',
              Proportion: '45.00%',
            },
            {
              Count: 100,
              Key: '手机号',
              Proportion: '25.00%',
            },
            {
              Count: 50,
              Key: '电子卡',
              Proportion: '35.00%',
            },
          ],
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'GET /console/GetApiTopTags': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          Stat: [
            {
              Count: 100,
              Key: '身份证',
            },
            {
              Count: 80,
              Key: '护照',
            },
            {
              Count: 60,
              Key: '手机号',
            },
            {
              Count: 30,
              Key: '电子卡',
            },
            {
              Count: 20,
              Key: '银行卡',
            },
          ],
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'GET /console/GetApiTrafficTrends': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          'Trends|10': [
            {
              'Count|1-1000': 0,
              Index: '@integer',
              Time: '@date',
            },
          ],
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'GET /console/GetApiTopIps': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          'Stat|10': [
            {
              'Count|1-100': 0,
              Key: '@ip',
            },
          ],
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'GET /console/GetApiIssues': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          'Issues|10': [
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
              IssueId: '@integer',
              IssueName: '@cname 漏洞',
              'Severity|1': ['High', 'Medium', 'Low'],
              'Status|1': ['Undisposed', 'Disposed', 'Ignored', 'FalsePositive'],
              UpdatedAt: '@datetime',
              Url: '@url',
            },
          ],
          Total: '100',
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'POST /console/ModifyApiIssueStatus': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {},
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'GET /console/GetApiRisks': (req, res) => {
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
  'POST /console/ModifyApiRiskStatus': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {},
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'GET /console/GetApiEvents': (req, res) => {
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
  'POST /console/ModifyApiEventStatus': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {},
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'GET /console/GetApiTagsClustered': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          'Categories|10': [
            {
              Count: '@integer(1, 100)',
              EntityType: '@cname',
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
  'GET /console/GetApiTagEntitiesClustered': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          'Entities|10': [
            {
              Index: '@integer',
              UpdatedAt: '@datetime',
              EntityValue: '@integer(1, 100)',
            },
          ],
          Total: 30,
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
}
