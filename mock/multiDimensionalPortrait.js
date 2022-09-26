import { mock } from 'mockjs'

export default {
  'GET /console/GetApis': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          ApiTotal: 200,
          Apis: [
            {
              Index: 1,
              Api: 'http:foobar.com',
              ApiId: 10,
              TagsCount: 30,
              Level: 'C1',
              Category: '身份信息',
              Method: 'GET',
              TrafficCount: 300,
              ActivedAt: '2021-07-14T06:26:36',
              FoundAt: '2021-07-14T06:26:36',
              Apps: [
                {
                  AppId: 1,
                  Name: '物流系统',
                },
                {
                  AppId: 1,
                  Name: '商城系统',
                },
              ],
            },
            {
              Index: 2,
              Api: 'http:foobar.com',
              ApiId: 11,
              TagsCount: 30,
              Level: 'C1',
              Category: '身份信息',
              Method: 'GET',
              TrafficCount: 300,
              ActivedAt: '2021-07-14T06:26:36',
              FoundAt: '2021-07-14T06:26:36',
              Apps: [
                {
                  AppId: 1,
                  Name: '物流系统',
                },
                {
                  AppId: 1,
                  Name: '商城系统',
                },
              ],
            },
          ],
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'GET /console/GetIps': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          IpTotal: 100,
          'Ips|100': [
            {
              ActivedAt: '@datetime',
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
              Index: '@integer',
              Ip: '@ip',
              Location: '@city',
              'NetworkType|1': ['内网', '公网'],
              RequestsCount: '@integer(1, 100)',
              TagsCount: '@integer(1, 100)',
            },
          ],
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
}
