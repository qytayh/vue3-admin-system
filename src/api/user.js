import instance from './request'
const apiBase = 'employee/'

export const Login = (data) =>{
    return instance({
        url:apiBase+'login',
        method: 'POST',
        data
    })
} 

export const UserInfo = (data) =>{
    return instance({
        url:apiBase + data.id,
        method: 'get',
    })
}

export default {Login,UserInfo}