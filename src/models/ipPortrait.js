import { getIpReuqestsTrends, getIpsTop } from '@/services/ipPortrait'
import { fillRequestTrends } from '@/utils/utils'
import moment from 'moment'

const ApiPortrait = {
  namespace: 'ipPortrait',

  state: {
    trends: [],
    topList: [],
  },

  effects: {
    *getTrends({ payload }, { call, put }) {
      const {
        Code,
        Data: { Trends },
      } = yield call(getIpReuqestsTrends, payload)
      if (Code !== 'Succeed') return

      Trends.forEach((e) => {
        const dateTime = e.Date
        const date = moment(dateTime).format('YYYY-MM-DD')
        const hour = moment(dateTime).format('HH')

        e.Date = date
        e.Hour = hour
      })

      // 补齐数据 保证图表美观
      const trends = fillRequestTrends(Trends, payload)

      yield put({
        type: 'changeRequestTrends',
        payload: {
          trends,
        },
      })
    },

    *getTopList({ payload }, { call, put }) {
      const {
        Code,
        Data: { Stat },
      } = yield call(getIpsTop, payload)
      if (Code !== 'Succeed') return

      yield put({
        type: 'changeTopList',
        payload: {
          topList: Stat,
        },
      })
    },
  },

  reducers: {
    changeRequestTrends(state, { payload }) {
      return { ...state, ...payload }
    },
    changeTopList(state, { payload }) {
      return { ...state, ...payload }
    },
  },
}

export default ApiPortrait
