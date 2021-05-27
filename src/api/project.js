import instance from './request'
const apiBase = 'project/'


export const projectList = (data) => {
    return instance({
        url: apiBase + 'projectList',
        method: 'POST',
        data
    })
}

export const projectAdd = (data) => {
    return instance({
        url: apiBase + 'project',
        method: 'POST',
        data
    })
}

export const projectDel = (data) => {
    return instance({
        url: apiBase + 'project/'+data.id,
        method: 'DELETE',
    })
}

export const projectEdit = (data) => {
    return instance({
        url: apiBase + 'project',
        method: 'PUT',
        data
    })
}


export default { projectList, projectAdd, projectDel, projectEdit }