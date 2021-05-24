import axios from 'axios'

const baseURL = 'http://localhost:3000/api/'

const instance = axios.create({
  baseURL: baseURL,
  timeout: 6000    
})

instance.defaults.headers.post['Content-Type'] = 'application/json'
instance.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'

instance.interceptors.request.use(
  config => {
      // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
      // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
      const token =  sessionStorage.getItem('token');
      token && (config.headers.Authorization = token);
      console.log(config,'222')
      return config;
  },
  error => {
      return Promise.error(error);
  })



instance.interceptors.response.use(function (response) {
  console.log(response,'1111')
  // Do something with response data
  return response.data;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});


export default instance;