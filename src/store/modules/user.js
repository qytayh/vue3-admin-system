import {Login} from '@/api/user'
// import router from '@/router'


const user = {
    namespaced: true,
    state:{
        token:sessionStorage.getItem('token'),
        avatar:'',
        username:'',
        // menus:[]
    },
    mutations:{
        SET_TOKEN:(state,token) =>{
            state.token = token
        },
        SET_AVATAR:(state,avatar) =>{
            state.avatar = avatar
        },
        SET_USERNAME:(state,username) =>{
            state.username = username
        },
        // SET_MENUS: (state, menus) => {
        //     state.menus = menus
        // }
    },
    actions:{
        /* login */
        LoginResult({commit}, userInfo) {
            return new Promise((resolve,reject) =>{
                Login(userInfo).then(response =>{
                    const {code ,data} = response
                    const {token} = data
                    if(code == 1) {
                        sessionStorage.setItem('token',token)
                        commit('SET_TOKEN',token)
                    }
                    resolve(response)
                }).catch(error =>{
                    reject(error)
                })
            })
        },

       

        /* 用户登出 */
        LogoutResult({commit}) {
            commit('SET_TOKEN','')
            commit('SET_AVATAR','')
            commit('SET_USERNAME','')
            // commit('SET_MENUS','')
            // const Routes = router.getRoutes()
            /* 清楚动态路由 */
            // asyncRoutes.forEach((item) => {
            //     router.removeRoute(item.name)
            // })
            
            sessionStorage.removeItem('token')
        
        }
      
    },

 
}

export default user