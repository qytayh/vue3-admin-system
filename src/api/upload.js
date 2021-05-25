import instance from './request'
const apiBase = 'upload/'

export const importEmployee = (data) =>{
    return instance({
        url:apiBase+'importEmployee',
        method: 'POST',
        data
    })
} 

export default {importEmployee}