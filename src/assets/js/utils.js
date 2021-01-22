import originAxios from 'axios'
import qs from 'qs'
import _this from "../../main.js"


export function http(url, data = {}, method = 'post') {
  let option = {
    url,
    data,
    method,
    transformRequest
  }
  function transformRequest(data) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (typeof data[key] == "object") {
          data[key] = JSON.stringify(data[key])
        }
      }
    }
    // 对 data 进行任意转换处理,将对象序列化成URL的形式，以&进行拼接
    return qs.stringify(data)
  }
  return new Promise((resolve, reject) => {
    const instance = originAxios.create({});
    // 配置请求和响应拦截
    instance.interceptors.request.use(config => {
      if (getStore("token")) {
        config.headers.token = getStore("token");
      }
      return config;
    }, err => {
      return err;
    })
    instance.interceptors.response.use(response => {
      if(response.data.code==501){
     
        _this.$router.push('/login')
      }
      return response.data;
    }, err => {
      if (err && err.response) {
        switch (err.response.status) {
          case 501:
            err.message = '请求错误'
            break
          case 401:
            err.message = '未授权的访问'
            break
        }
      }
      return err
    })
    // 2.传入对象进行网络请求
    instance(option).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}
export function download(url, data) {
  console.log(data)
  let option = {
    url,
    data,
    responseType:'blob',
    
  }

  return new Promise((resolve, reject) => {
    // 1.创建axios的实例
    const instance = originAxios.create({
      method: 'post',
    });
    // 配置请求和响应拦截
    instance.interceptors.request.use(config => {
      if (getStore("token")) {
        config.headers.token = getStore("token");
      }
      return config
    }, err => {
      return err
    })
    instance.interceptors.response.use(response => {
  
      return response.data
    }, err => {
      if (err && err.response) {
     
        switch (err.response.status) {
          case 400:
            err.message = '请求错误'
            break
          case 401:
            err.message = '未授权的访问'
            break
        }
      }
      return err
    })
    // 2.传入对象进行网络请求
    instance(option).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err)
    })
  })
}

/* 验证手机号 */
export function isPhone(phone) {
  let isPhone = /^[1][0-9][0-9]{9}$/;//手机号码
  if (!isPhone.test(phone)) {
    return false;
  };
  return true;
}
export function setStore(key, value) {
  window.localStorage.setItem(key, value);
}

export function getStore(key) {
  return window.localStorage.getItem(key);
}
export function removeStore(key) {
  return window.localStorage.removeItem(key);
}

