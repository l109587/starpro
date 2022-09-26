import { getApiTrafficTrends, getApiTopIps } from '@/services/apiPortrait'
import moment from 'moment'

const ApiPortrait = {
  namespace: 'apiPortrait',

  state: {
    trends: [],
    topList: [],
  },

  effects: {
    *getTrends({ payload }, { call, put }) {
      const {
        Code,
        Data: { Trends },
      } = yield call(getApiTrafficTrends, payload)
      if (Code !== 'Succeed') return

      Trends.forEach((e) => {
        e.Time = moment(e.Time).format('YY-MM-DD')
      })

      yield put({
        type: 'changeTrafficTrends',
        payload: {
          trends: Trends,
        },
      })
    },

    *getTopList({ payload }, { call, put }) {
      const {
        Code,
        Data: { Stat },
      } = yield call(getApiTopIps, payload)
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
    changeTrafficTrends(state, { payload }) {
      return { ...state, ...payload }
    },
    changeTopList(state, { payload }) {
      return { ...state, ...payload }
    },
  },
}

export default ApiPortrait
