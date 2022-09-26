const Classification = {
  namespace: 'classification',

  state: {
    apiTotal: 0,
  },

  effects: {
    *getApiTotal({ payload }, { put }) {
      const { apiTotal } = payload

      yield put({
        type: 'changeApiTotal',
        payload: {
          apiTotal,
        },
      })
    },
  },

  reducers: {
    changeApiTotal(state, { payload }) {
      return { ...state, ...payload }
    },
  },
}

export default Classification
