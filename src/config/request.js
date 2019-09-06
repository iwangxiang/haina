import axios from "axios";
import { Toast } from 'vant';
import {baseUrl} from './env';
import router from '../router';
import util from './util';

/****** 创建axios实例 ******/
const service = axios.create({
    baseURL: baseUrl,
    timeout: 5000,  // 请求超时时间
});


/****** request拦截器==>对请求参数做处理 ******/
service.interceptors.request.use(config => {
    Toast.loading({
        mask: false,
        message: '加载中...'
    });
    
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    if(util.isWeixin() && util.getStore('uhash')){
        config.headers['Authorization'] = util.getStore('uhash');
    }

    return config;
}, error => {  //请求错误处理
    Toast.fail(error);
    Promise.reject(error)
});


/****** respone拦截器==>对响应做处理 ******/
service.interceptors.response.use(
    response => {  //成功请求到数据
        Toast.clear();
        //return response.data;
        if (response.data.code == 0) {
            return response.data;
        } else {
            Toast.fail(response.data.msg);
            return response.data;
        }
    },
    error => {  //响应错误处理
        /*console.log('error');
        console.log(error);
        console.log(JSON.stringify(error));*/

        if (error.response) {
            if(error.response.status == 401){
                Toast.fail('用户不存在');
                util.removeStore('uhash');
                router.replace('/');
                window.location.reload();
            }else{
                let text = JSON.parse(JSON.stringify(error)).response.status === 404
                ? '404'
                : '网络异常，请重试';        
                Toast.fail(text);
            }
        }

        return Promise.reject(error)
    }
);
export default service;