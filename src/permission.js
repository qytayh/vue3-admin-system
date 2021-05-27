import router from "@/router"
// import store from './store'


router.beforeEach(async(to, from, next) => {
    if(to.path === '/login') {
      next()
    } else {
      let token = sessionStorage.getItem('token')
      if(!token) {
        next('/login')
      } else {
        next()
      }
    }
    
  })