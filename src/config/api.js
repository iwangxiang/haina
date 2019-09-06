import http from './request'

/**
 * 获取首页数据
 */
export const home = (id = '') => http.get('/mobile.php/mobapi/home', {
    params: {
        id
    }
});

/**
 * 获取房源列表
 */
export const saleList = (data) => http.get('/mobile.php/mobapi/saleList',  {
    params: data
});

/**
 * 获取当前城市的房源列表
 */
export const cityList = (data) => http.get('/mobile.php/mobapi/cityList',  {
    params: data
});

/**
 * 获取房源详情
 */
export const saleDetail = (id = 0,hash = '') => http.get('/mobile.php/mobapi/saleDetail', {
    params: {
        id,
        hash
    }
});

/**
 * 获取出租房源列表
 */
export const rentList = (data) => http.get('/mobile.php/mobapi/rentList',  {
    params: data
});

/**
 * 获取出租房源详情
 */
export const rentDetail = (id = 0,hash = '') => http.get('/mobile.php/mobapi/rentDetail', {
    params: {
        id,
        hash
    }
});

/**
 * 获取房源相册
 */
export const housePics = (pid,type) => http.get('/mobile.php/mobapi/housePics', {
    params: {
        pid,
        type
    }
});

/**
 * 微信登录
 */
export const wechatLogin = (path='') => http.get('/mobile.php/mobapi/wechatAuth', {
    params: {
        path
    }
});

/**
 * 获取用户信息
 */
export const userInfo = (code = '') => http.get('/mobile.php/mobapi/getUserInfo', {
    params: {
        code
    }
});

/**
 * 获取经纪人信息
 */
export const agentInfo = (code = '') => http.get('/mobile.php/mobapi/getAgentInfo', {
    params: {
        code
    }
});

/**
 * 获取海纳用户信息
 */
export const hnUserInfo = (resident_code = '') => http.get('/mobile.php/mobapi/getHnUserInfo', {
    params: {
        resident_code
    }
});

export const rowXiaoqu = (id='', pid='') => http.get('/mobile.php/mobapi/rowXiaoqu', {
    params: {
        id,
        pid
    }
});

/**
 * 收藏房源
 */
export const collect = (source_id,type,hash) => http.get('/mobile.php/mobapi/collect', {
    params: {
        source_id,
        type,
        hash
    }
});

/**
 * 获取收藏列表数据
 */
export const collectionList = (hash,page) => http.get('/mobile.php/mobapi/collectionList', {
    params: {
        hash,
        page
    }
});

/**
 * 收藏置顶
 */
export const collectionTop = (id,hash) => http.get('/mobile.php/mobapi/collectionTop', {
    params: {
        id,
        hash
    }
});

/**
 * 收藏删除
 */
export const collectionDel = (id,hash) => http.get('/mobile.php/mobapi/collectionDel', {
    params: {
        id,
        hash
    }
});

/**
 * 获取search页面搜索结果
 */
export const searchResult = (page,keyword,type,city) => http.get('/mobile.php/mobapi/searchResult', {
    params: {
        page,
        keyword,
        type,
        city
    }
});

/**
 * 获取search页面的热搜小区
 */
export const hotKeywords = (city) => http.get('/mobile.php/mobapi/hotKeywords', {
    params: {
        city
    }
});

/**
 * 获取Jssdk
 */
export const getJssdk = (url) => http.get('/mobile.php/mobapi/getJssdk', {
    params: {
        url
    }
});

/**
 * 获取后台模拟的用户登录信息
 */ 
export const ulogin = (klogin) => http.get('/admhn.php/member/ulogin',  {
    params: {
        klogin
    }
});
