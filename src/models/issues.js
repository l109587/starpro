import {
  getTableData,
  getTrendsData,
  getTopListData,
  getIssuesDetails,
  getIssuesStat,
  modifyStatus,
} from '@/services/issues.js'
import { message } from 'antd'
import { getIntl } from 'umi'
import moment from 'moment'

const Issues = {
  namespace: 'issues',
  state: {
    tableData: {},
    currentQuery: {
      PageSize: 10,
      PageNum: 1,
    },
    issuesDetails: {},
    tableLoading: false,
  },
  effects: {
    *getTableData({ payload }, { call, put, select }) {
      const res = yield call(getTableData, payload)

      // 更新currentQuery
      yield put({
        type: 'changeCurrentQuery',
        payload,
      })

      const { Code, Data = [], Message } = res
      if (Code === 'Succeed') {
        // 更新table中数据
        yield put({
          type: 'changeTableData',
          payload: Data,
        })
      } else {
        message.error(Message)
      }
    },

    *getIssuesStat({ payload }, { call, put, select }) {
      const res = yield call(getIssuesStat)
      const { Code, Data = [], Message } = res
      if (Code === 'Succeed') {
        yield put({
          type: 'changeIssuesStatData',
          payload: Data || [],
        })
      } else {
        message.error(Message)
      }
    },

    *getTrendsData({ payload }, { call, put, select }) {
      const res = yield call(getTrendsData, payload)
      const { Code, Data = [], Message } = res
      Data.forEach((e) => {
        e.Time = moment(e.Time).format('YYYY-MM-DD')
      })
      if (Code === 'Succeed') {
        yield put({
          type: 'changeTrendsData',
          payload: {
            trendData: Data,
          },
        })
      } else {
        message.error(Message)
      }
    },
    *getTopListData({ payload }, { call, put, select }) {
      const res = yield call(getTopListData, payload)
      const { Code, Data = {}, Message } = res
      if (Code === 'Succeed') {
        yield put({
          type: 'changeTopListData',
          payload: {
            topListData: Data.Stat || [],
          },
        })
      } else {
        message.error(Message)
      }
    },
    *getIssuesDetails({ payload }, { call, put, select }) {
      const res = yield call(getIssuesDetails, payload)
      const { Code, Data = {}, Message } = res
      if (Code === 'Succeed') {
        yield put({
          type: 'changeIssuesDetailsData',
          payload: {
            issuesDetails: Data || {},
          },
        })
      } else {
        message.error(Message)
      }
    },
    *modifyStatus({ payload }, { call, put, select }) {
      const res = yield call(modifyStatus, payload)
      const { Code, Data = {}, Message } = res
      if (Code === 'Succeed') {
        const intl = getIntl()
        message.success(intl.formatMessage({ id: 'pages.issues.status.modify.success' }))
        const query = yield select((state) => state.issues.currentQuery) // 测试输出state
        yield put({ type: 'getTableData', payload: query })
      } else {
        message.error(Message)
      }
    },
  },
  reducers: {
    changeTableData(state, { payload }) {
      return { ...state, tableData: payload }
    },
    changeCurrentQuery(state, { payload }) {
      return { ...state, currentQuery: payload }
    },
    changeIssuesStatData(state, { payload }) {
      return { ...state, issuesStatData: payload }
    },
    changeTrendsData(state, { payload }) {
      return { ...state, ...payload }
    },
    changeTopListData(state, { payload }) {
      return { ...state, ...payload }
    },
    changeIssuesDetailsData(state, { payload }) {
      return { ...state, ...payload }
    },
  },
}
export default Issues
