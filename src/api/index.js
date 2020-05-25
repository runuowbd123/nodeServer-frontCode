import axios from 'axios';
import Vue from 'vue'

axios.defaults.timeout = 10000;

// 请求拦截器
axios.interceptors.request.use(
    config => {
        let userInfo = sessionStorage.getItem("userInfo");
        userInfo = userInfo ? JSON.parse(userInfo) : {};
        userInfo.token && (config.headers.token = userInfo.token);
        return config;
    })

// 响应拦截器
axios.interceptors.response.use(
    response => {
        if (response.status === 200) {
            if (response.data.code === 200) {
                return Promise.resolve(response);
            } else {
                if (response.request.responseType == "arraybuffer") {
                    return Promise.resolve(response);
                } else {
                    if (response.data.code === 403) {
                        window.sessionStorage.removeItem("userInfo")
                        new Vue({}).$message.info("登录状态已超时，请前往企蜂云重新打开企蜂商城", 5)
                    } else {
                        new Vue({}).$message.error(response.data.message, 5);
                    }
                    return Promise.reject(response);
                }
            }
        } else {
            new Vue({}).$message.error(`Internet ${response.status} ~`, 5);
            return Promise.reject(response);
        }
    });