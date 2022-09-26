import { mock } from 'mockjs'

const allUsers = mock({
  'Users|104': [
    {
      Index: '@id',
      UserId: '@id',
      Name: '@cword(2, 4)科技',
      'Role|1': ['Auditor', 'Guest', 'Admin'],
      Email: '@email',
      'Status|1': ['Activate', 'Unactivate'],
      LastLogin: '@datetime',
      Avatar: 'http:127.0.0.1/static/user/1234.jpg',
      Description: '这是一个管理员',
      Password: '*****************',
      CreateAt: '2021-10-1T8:00:00',
      UpdateAt: '2021-10-1T8:00:00',
    },
  ],
}).Users

export default {
  'GET /console/ListUsers': (req, res) => {
    const { PageNum, PageSize } = req.query

    setTimeout(() => {
      res.send(
        mock({
          Code: 'Succeed',
          Data: {
            Total: 104,
            Users: allUsers.slice(
              (Number(PageNum) - 1) * Number(PageSize),
              Number(PageNum) * Number(PageSize),
            ),
          },
          Message: 'Succeed',
          RequestId: '',
        }),
      )
    }, 300)
  },
  'GET /console/GetUserSettings': mock({
    Code: 'Succeed',
    Data: {
      UserId: '@id',
      Accounts: '@name',
      'Role|1': ['Admin', 'Editor', 'Auditor', 'Tester'],
      Email: '@email',
      UpdatePasswordAt: '@datetime',
      LoginedAt: '@datetime',
    },
    Message: 'Succeed',
    RequestId: '',
  }),
  'POST /console/EditEmail': {
    Code: 'Succeed',
    Data: {
      UserId: '@id',
      Email: '123@163.com',
    },
    Message: 'Succeed',
    RequestId: '',
  },
  'POST /console/ModifyPassword': {
    Code: 'Succeed',
    Data: {},
    Message: 'Succeed',
    RequestId: '',
  },
  'POST /console/CreateUser': {
    Code: 'Succeed',
    Data: {
      UserId: 1,
    },
    Message: 'Succeed',
    RequestId: '',
  },
  'POST /console/EditUser': {
    Code: 'Succeed',
    Data: {
      UserId: 1,
      Name: 'xx科技',
      Role: 'Admin',
    },
    Message: 'Succeed',
    RequestId: '',
  },
  'POST /console/DeleteUsers': {
    Code: 'Succeed',
    Data: {},
    Message: 'Succeed',
    RequestId: '',
  },
}
