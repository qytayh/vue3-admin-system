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

export const employeeList = (data) =>{
    return instance({
        url:apiBase + 'employeeList',
        method: 'POST',
        data
    })
}
export const delEmployee = (data) =>{
    return instance({
        url:apiBase + data.id,
        method: 'DELETE',
    })
}
export const createEmployee= (data) =>{
    return instance({
        url:apiBase + 'create',
        method: 'POST',
        data
    })
}

export const editEmployee= (data) =>{
    return instance({
        url:apiBase + 'edit',
        method: 'PUT',
        data
    })
}

export default {Login,UserInfo,employeeList}