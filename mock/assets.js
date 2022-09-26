import { mock, Random } from 'mockjs'

export default {
  'GET /console/ListApps': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          Total: 100,
          'Apps|10': [
            {
              ApiCount: '@integer(0, 200)',
              AppId: '@integer(0, 100000)',
              CreatedAt: '2021-05-30T23:02:06',
              Description: '这是一个专门用于视频的应用',
              EventsCount: '@integer(0, 20)',
              IssuesCount: 0,
              Name: '视频应用',
              Range: '@ip',
              'RangeType|1': ['domain_range', 'ip_segment', 'keyword_match'],
            },
          ],
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'POST /console/SearchDomainMatch': (req, res) => {
    const { AssetTypeValue } = req.body || {}

    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          keyword_match: [
            `www.${AssetTypeValue}.com`,
            `www.${AssetTypeValue}.cn`,
            `www.${AssetTypeValue}.tech`,
          ],
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'POST /console/ModifyApp': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {},
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'GET /console/GetApiDetailsInfo': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          Scheme: 'http',
          Method: ['GET', 'POST'],
          Host: 'www.baidu.com',
          Path: '/{N_CHAR_LOW}/{N_CHAR_LOW}/{N_CHAR_LOW}',
          RequestdAt: '2021-05-30T23:02:06',
          CreatedAt: '2021-05-30T23:02:06',
          Apps: [
            {
              AppId: 1,
              Name: '视频应用',
            },
          ],
          RequestRaw: '',
          ResponseRaw: '',
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'GET /console/GetAssetsVisualization': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          nodes: [
            {
              id: 'node-0',
              host: 'www.baidu.com',
            },
            {
              id: 'node-1',
              host: 'www.douban.com',
            },
            {
              id: 'node-2',
              host: 'www.feishu.com',
            },
            {
              id: 'node-3',
              host: 'www.feishu.com',
            },
            {
              id: 'node-4',
              host: 'www.feishu.com',
            },
            {
              id: 'node-5',
              host: 'www.feishu.com',
            },
            {
              id: 'node-6',
              host: 'www.feishu.com',
            },
            {
              id: 'node-7',
              host: 'www.feishu.com',
            },
            {
              id: 'node-8',
              host: 'www.feishu.com',
            },
          ],
          edges: [
            {
              source: 'node-0',
              target: 'node-1',
              apis: ['http://www.baidu.com/{string}', 'http://www.douban.com/{string}'],
              eventsCount: 30,
            },
            {
              source: 'node-1',
              target: 'node-2',
              apis: ['http://www.baidu.com/{string}', 'http://www.feishu.com/{string}'],
              eventsCount: 40,
            },
            {
              source: 'node-2',
              target: 'node-3',
              apis: ['http://www.baidu.com/{string}', 'http://www.feishu.com/{string}'],
              eventsCount: 40,
            },
            {
              source: 'node-2',
              target: 'node-4',
              apis: ['http://www.baidu.com/{string}', 'http://www.feishu.com/{string}'],
              eventsCount: 40,
            },
            {
              source: 'node-3',
              target: 'node-5',
              apis: ['http://www.baidu.com/{string}', 'http://www.feishu.com/{string}'],
              eventsCount: 40,
            },
            {
              source: 'node-4',
              target: 'node-6',
              apis: ['http://www.baidu.com/{string}', 'http://www.feishu.com/{string}'],
              eventsCount: 40,
            },
            {
              source: 'node-5',
              target: 'node-7',
              apis: ['http://www.baidu.com/{string}', 'http://www.feishu.com/{string}'],
              eventsCount: 40,
            },
            {
              source: 'node-7',
              target: 'node-8',
              apis: ['http://www.baidu.com/{string}', 'http://www.feishu.com/{string}'],
              eventsCount: 40,
            },
          ],
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
}
