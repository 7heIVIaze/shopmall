export default async function ({ store, error, redirect, route, req }) {
  // For login.vue && signup.vue
  if(store.state.isLogin && (route.path === '/user/login' || route.path === '/user/signup')) return redirect('/')
  // For cart.vue && favorite.vue && mypage.vue
  else if(!store.state.isLogin && (route.path === '/user/cart' || route.path === '/user/favorite' || route.path === '/user/mypage')) return redirect('/user/login')  // if you don't login, you have to login first
  // For admin.vue
  else if(route.path === '/admin' && (!store.state.isLogin)) return redirect('/user/login')
  // For purchase/list.vue
  else if(route.path === '/user/purchase/list' && (!store.state.isLogin)) return redirect('/user/login')
}
