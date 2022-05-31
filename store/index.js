export const state = () => ({
  isLogin: false,
})

export const mutations = {
  isLogin_to_True(state) {
    state.isLogin = true
  },
  isLogin_to_False(state){
    state.isLogin = false
  }
}

export const getters = {
  isLogin(state){
    return state.isLogin
  }
}

export const actions = {
  async nuxtServerInit ({ commit }, { req }) {
    if(req.session.passport && Object.keys(req.session.passport).length !== 0){  // req.session.passport는 인증받기 전이면 undefined, 인증통과(로그인 성공)했으면 { user: _id } 반환. || 로그아웃(세션 삭제) 이후에는 passport는 빈 객체({})가 된다.
      console.log(req.session)
      await commit('isLogin_to_True')                                            // passport 인증을 통과한(로그인한) 세션이 있으면, isLogin = true
    }
    else await commit('isLogin_to_False')                                        // 세션이 없으면, isLogin = false
  }
}