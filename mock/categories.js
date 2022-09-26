import { mock } from 'mockjs'

export default {
  'GET /console/GetTopLevelCategories': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          Categories: [
            {
              CategoryName: '身份证@cname',
              CategoryId: 1,
              Index: 1,
              ParentId: 0,
            },
            {
              CategoryName: '居住证@cname',
              CategoryId: 2,
              Index: 2,
              ParentId: 0,
            },
          ],
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'GET /console/GetCategories': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          Categories: [
            {
              CategoryId: () => parseInt(mock('@id')),
              CategoryName: '身份信息@cname',
              ChildrenList: [
                {
                  CategoryId: () => parseInt(mock('@id')),
                  CategoryName: '身份证@cname',
                  ChildrenList: [
                    {
                      CategoryId: () => parseInt(mock('@id')),
                      CategoryName: '身份证号@cname',
                      ChildrenList: [],
                      Count: '@integer(1, 100)',
                      ParentId: 197,
                    },
                    {
                      CategoryId: () => parseInt(mock('@id')),
                      CategoryName: '身份证名字@cname',
                      ChildrenList: [],
                      Count: '@integer(1, 100)',
                      ParentId: 197,
                    },
                  ],
                  Count: '@integer(1, 100)',
                  ParentId: 196,
                },
                {
                  CategoryId: () => parseInt(mock('@id')),
                  CategoryName: '护照@cname',
                  ChildrenList: [],
                  Count: '@integer(1, 100)',
                  ParentId: 196,
                },
                {
                  CategoryId: () => parseInt(mock('@id')),
                  CategoryName: '户口本@cname',
                  ChildrenList: [],
                  Count: '@integer(1, 100)',
                  ParentId: 196,
                },
                {
                  CategoryId: () => parseInt(mock('@id')),
                  CategoryName: '社保@cname',
                  ChildrenList: [
                    {
                      CategoryId: () => parseInt(mock('@id')),
                      CategoryName: '社保卡@cname',
                      ChildrenList: [
                        {
                          CategoryId: () => parseInt(mock('@id')),
                          CategoryName: '社保信息@cname',
                          ChildrenList: [
                            {
                              CategoryId: () => parseInt(mock('@id')),
                              CategoryName: '社保ID@cname',
                              ChildrenList: [],
                              Count: '@integer(1, 100)',
                              ParentId: 204,
                            },
                          ],
                          Count: '@integer(1, 100)',
                          ParentId: 203,
                        },
                      ],
                      Count: '@integer(1, 100)',
                      ParentId: 200,
                    },
                  ],
                  Count: '@integer(1, 100)',
                  ParentId: 196,
                },
              ],
              Count: '@integer(1, 100)',
              ParentId: 0,
            },
          ],
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'GET /console/GetCategoriesCountStat': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          EntitiesCount: mock('@natural(1000, 100000)'),
          ApiCount: mock('@natural(1000, 100000)'),
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'GET /console/GetTopTags': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          Stat: [
            {
              Count: '@integer(60, 500)',
              Entities: 'Cate 1',
            },
            {
              Count: '@integer(60, 500)',
              Entities: 'Cate 2',
            },
            {
              Count: '@integer(60, 500)',
              Entities: 'Cate 3',
            },
            {
              Count: '@integer(60, 500)',
              Entities: 'Cate 4',
            },
            {
              Count: '@integer(60, 500)',
              Entities: 'Cate 5',
            },
          ],
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'GET /console/GetCategoryApisDistribution': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          Distributions: [
            {
              Count: '@integer(60, 500)',
              Key: 'C1',
              Proportion: '10%',
            },
            {
              Count: '@integer(60, 500)',
              Key: 'C2',
              Proportion: '20%',
            },
            {
              Count: '@integer(60, 500)',
              Key: 'C3',
              Proportion: '30%',
            },
            {
              Count: '@integer(60, 500)',
              Key: 'C4',
              Proportion: '40%',
            },
          ],
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'GET /console/GetCategoryApis': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          Total: 100,
          'Apis|10': [
            {
              ApiId: () => parseInt(mock('@id')),
              Index: () => parseInt(mock('@id')),
              Api: '@url',
              'Level|1': ['C1', 'C2', 'C3', 'C4'],
              CategoryId: () => parseInt(mock('@id')),
              CategoryName: '@cname 分类',
              UpdatedAt: '@datetime',
              TrafficCount: '@integer(0, 300)',
              EntitiesCount: '@integer(0, 100)',
              Apps: [
                {
                  AppId: () => parseInt(mock('@id')),
                  AppName: '@cname 系统',
                },
                {
                  AppId: () => parseInt(mock('@id')),
                  AppName: '@cname 系统',
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
  'GET /console/GetCategoryApiTagsClustered': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          'Categories|2-5': [
            {
              Count: '@integer(0, 100)',
              EntityType: '身份信息',
              Index: '@integer(1, 100)',
            },
          ],
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'GET /console/GetCategoryApiTagEntitiesClustered': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          Entities: [
            {
              Index: '@integer(1, 100)',
              UpdatedAt: '@datetime',
              EntityValue: '身份信息@cname',
            },
          ],
          Total: 100,
        },
        Message: 'Succeed',
        RequestId: '',
      }),
    )
  },
  'GET /console/GetUnclassifiedApis': (req, res) => {
    res.send(
      mock({
        Code: 'Succeed',
        Data: {
          ApiTotal: 20,
          'Apis|10': [
            {
              Api: '@url',
              ApiId: () => parseInt(mock('@id')),
              EntitiesCount: '@integer(0, 100)',
              Index: () => parseInt(mock('@id')),
              'Level|1': ['C1', 'C2', 'C3', 'C4'],
              UpdatedAt: '@datetime',
              TrafficCount: '@integer(0, 300)',
              Apps: [
                {
                  AppId: 1,
                  AppName: '物流系统',
                },
                {
                  AppId: 2,
                  AppName: '商城系统',
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
}
