import {
  getTableData,
  getEventsStateTrend,
  getTrendsData,
  getTopListData,
  GetEventDetails,
  modifyStatus,
  getStatusEvents,
  createWhiteStrategys,
  getWhiteStrategys,
  updateWhiteStrategys,
  deleteWhiteStrategys,
} from '@/services/secureEvents.js'
import { getLocaleForAPI } from '@/utils/utils'
import { message } from 'antd'
import moment from 'moment'

const SecureEvents = {
  namespace: 'secure_events',
  state: {
    regularData: {},
    tableData: {},
    statusEventData: {},
    currentQuery: {
      PageSize: 10,
      PageNum: 1,
    },
    disposedTrendData: [],
    threatTrendData: [],
    eventDetails: {},
    feedbackDetails: {},
  },
  effects: {
    *getTableData({ payload }, { call, put, select }) {
      const res = yield call(getTableData, payload)

      // 更新currentQuery
      yield put({
        type: 'changeCurrentQuery',
        payload,
      })

      const { Code, Data = {} } = res
      if (Code === 'Succeed') {
        // 更新table中数据
        yield put({
          type: 'changeTableData',
          payload: Data,
        })
      }
    },
    *getStatusEvents({ payload }, { call, put, select }) {
      const res = yield call(getStatusEvents, payload)
      const { Code, Data = {} } = res
      if (Code === 'Succeed') {
        // 更新table中数据
        yield put({
          type: 'changeStatusEvent',
          payload: Data,
        })
      }
    },
    *getWhiteStrategys({ payload }, { call, put, select }) {
      const res = yield call(getWhiteStrategys, payload)
      const { Code, Data = {} } = res
      if (Code === 'Succeed') {
        // 更新table中数据
        yield put({
          type: 'changeRegularData',
          payload: Data,
        })
      }
    },

    *createWhiteStrategys({ payload, callback }, { call, put, select }) {
      const res = yield call(createWhiteStrategys, payload)
      const { Code } = res
      if (res.status === 423) {
        message.error('该加白规则已存在')
        callback && callback(res.status)
      }
      if (Code === 'Succeed') {
        callback && callback()
      }
    },

    *getEventsStateTrend({ payload }, { call, put, select }) {
      const High = yield call(getEventsStateTrend, { ...payload, Stat: 'High' })
      const Medium = yield call(getEventsStateTrend, { ...payload, Stat: 'Medium' })
      const Disposed = yield call(getEventsStateTrend, { ...payload, Stat: 'Disposed' })
      const Undisposed = yield call(getEventsStateTrend, { ...payload, Stat: 'Undisposed' })
      yield put({
        type: 'changeEventsStateData',
        payload: {
          high: High && High.Data,
          medium: Medium && Medium.Data,
          disposed: Disposed && Disposed.Data,
          unDisposed: Undisposed && Undisposed.Data,
        },
      })
    },

    *getTrendsData({ payload }, { call, put, select }) {
      const res = yield call(getTrendsData, payload)
      const { Code, Data = [] } = res
      Data.forEach((e) => {
        e.Time = moment(e.Time).format('YY-MM-DD')
      })
      if (Code === 'Succeed') {
        const { Stat } = payload
        if (Stat === 'DisposedTrend') {
          yield put({
            type: 'changeTrendsData',
            payload: {
              disposedTrendData: Data || [],
            },
          })
        } else {
          yield put({
            type: 'changeTrendsData',
            payload: {
              threatTrendData: Data || [],
            },
          })
        }
      }
    },
    *getTopListData({ payload }, { call, put, select }) {
      const res = yield call(getTopListData, payload)
      const { Code, Data = {} } = res
      if (Code === 'Succeed') {
        yield put({
          type: 'changeTopListData',
          payload: {
            topListData: Data.Stat || [],
          },
        })
      }
    },
    *GetEventDetails({ payload }, { call, put, select }) {
      const res = yield call(GetEventDetails, payload)
      const { Code, Data = {} } = res
      if (Code === 'Succeed') {
        yield put({
          type: 'changeEventDetailsData',
          payload: {
            eventDetails: Data || {},
          },
        })
      }
    },
    *modifyStatus({ payload }, { call, put, select }) {
      const res = yield call(modifyStatus, payload)
      const { Code, Data, Message } = res
      if (Code === 'Succeed') {
        message.success('修改成功！')
        console.log(Data, '反馈详情信息')
        const query = yield select((state) => state.secure_events.currentQuery) // 测试输出state
        yield put({ type: 'getTableData', payload: query })
        yield put({
          type: 'GetEventDetails',
          payload: { EventId: payload.EventIds[0], Lang: getLocaleForAPI() },
        })
        yield put({
          type: 'changeFeedbackDetails',
          payload: Data,
        })
      } else {
        message.error(Message)
      }
    },
  },
  reducers: {
    changeTableData(state, { payload }) {
      return { ...state, tableData: payload }
    },
    changeRegularData(state, { payload }) {
      return { ...state, regularData: payload }
    },
    changeStatusEvent(state, { payload }) {
      return { ...state, statusEventData: payload }
    },
    changeCurrentQuery(state, { payload }) {
      return { ...state, currentQuery: payload }
    },
    changeEventsStateData(state, { payload }) {
      return { ...state, eventsStateData: payload }
    },
    changeTrendsData(state, { payload }) {
      return { ...state, ...payload }
    },
    changeTopListData(state, { payload }) {
      return { ...state, ...payload }
    },
    changeEventDetailsData(state, { payload }) {
      return { ...state, ...payload }
    },
    changeFeedbackDetails(state, { payload }) {
      return { ...state, feedbackDetails: payload }
    },
  },
}
export default SecureEvents
