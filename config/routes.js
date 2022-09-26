export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: '登录',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            routes: [
              {
                path: '/',
                redirect: '/assets/api',
              },
              // {
              //   path: '/overview',
              //   name: 'overview',
              //   icon: 'icon-zonglan',
              //   component: './overview/index',
              // },
              {
                name: '资产管理',
                path: '/assets',
                icon: 'icon-zichan',
                routes: [
                  {
                    path: '/assets/api',
                    name: 'API 资产',
                    access: 'permission',
                    routes: [
                      {
                        path: '/assets/api',
                        component: './assetManagement/index',
                      },
                      {
                        path: 'app',
                        name: '应用详情',
                        hideInMenu: true,
                        component: './assetManagement/appDetails',
                      },
                    ],
                  },
                  {
                    path: '/assets/portraits',
                    name: '行为画像',
                    access: 'permission',
                    // icon: 'icon-duoweidu',
                    routes: [
                      {
                        path: '/assets/portraits',
                        component: './multiDimensionalPortrait/index',
                      },
                      {
                        path: 'api',
                        name: 'API 画像',
                        hideInMenu: true,
                        component: './apiPortrait/index',
                      },
                      {
                        path: 'ip',
                        name: 'IP 画像',
                        hideInMenu: true,
                        component: './ipPortrait/index',
                      },
                    ],
                  },
                  // {
                  //   path: 'graph',
                  //   name: '资产拓扑',
                  //   hideInMenu: true,
                  //   component: './graph/index',
                  // },
                ],
              },
              {
                name: '数据管理',
                path: '/data',
                icon: 'icon-apartment',
                routes: [
                  {
                    path: 'classify',
                    name: '分类分级',
                    access: 'permission',
                    component: './classification/index',
                  },
                ],
              },
              // {
              //   path: '/leak',
              //   name: '漏洞管理',
              //   icon: 'icon-fengxianbaogao',
              //   routes: [
              //     {
              //       path: 'task',
              //       name: '任务管理',
              //       component: './taskManagement/index',
              //     },
              //     {
              //       path: 'issues',
              //       name: '漏洞风险',
              //       component: './issues/index.jsx',
              //     },
              //   ],
              // },
              {
                path: '/threat',
                name: '威胁检测',
                icon: 'icon-fengxianbaogao',
                routes: [
                  {
                    path: 'secure',
                    name: '安全风险',
                    access: 'permission',
                    component: './secureEvents/index',
                  },
                ],
              },
              {
                path: '/operate',
                name: '安全运营',
                icon: 'icon-target-full',
                routes: [
                  {
                    path: 'sourcing',
                    name: '事件溯源',
                    access: 'permission',
                    component: './eventSourcing/index',
                  },
                  {
                    path: 'push',
                    name: '告警推送',
                    access: 'permission',
                    component: './alarmPush/index',
                  },
                  {
                    path: 'systemOperationLog',
                    access: 'permission',
                    name: '系统日志',
                    component: './systemOperationLog/index',
                  },
                ],
              },
              {
                path: '/config',
                name: '配置',
                icon: 'icon-shezhi',
                routes: [
                  {
                    path: 'strategy',
                    name: '策略配置',
                    access: 'permission',
                    component: './strategy/index',
                  },
                  {
                    path: 'setting',
                    name: '系统配置',
                    access: 'permission',
                    component: './setting/index',
                  },
                ],
              },
              {
                path: '/personal',
                name: '个人设置',
                hideInMenu: true,
                component: './setting/PersonalSetting',
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
]
