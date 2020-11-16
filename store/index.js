export const state = () => ({
    env: {}
  })
  
  export const mutations = {
    setEnv (state, env) {
      state.env = env
    }
  }
  
  export const actions = {
    nuxtServerInit ({ commit }) {
      if (process.server) {
        commit('setEnv', {
          API_PORT: process.env.API_PORT || '5001',
          APP_ENV: process.env.APP_ENV || 'prod',
          API_DEV_URL: 'http://c21support.cires21.com:5001/videoAnalysis/'
        })
      }
    }
}