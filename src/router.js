import Vue from 'vue';
import Router from 'vue-router';
import home from '@/pages/home/index';
//import store from './store';
//import {hnUserInfo} from "./config/api";
//import util from './config/util';
//import { Toast } from 'vant';

Vue.use(Router);

const router = new Router({    
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            if (from.meta.keepAlive) {
                from.meta.savedPosition = document.body.scrollTop;
            }
            return {x: 0, y: to.meta.savedPosition || 0};
        }
    },
    routes: [
        {
            path: '/',
            name: 'index',
            redirect: '/pages/home/index'
        },
        {
            path: '/pages/home/index',
            name: 'homeIndex',
            meta: {
                //keepAlive: true,
                title: '首页',
                auth:true
            },
            component: home
        },
        {
            path: '/pages/calcu/index',
            name: 'calc',
            meta: {
                keepAlive: true,
                title: '贷款计算器'
            },
            component: () => import(/* webpackChunkName: "calc" */ '@/pages/calcu/index' )
        },
        {
            path: '/pages/calcu/res',
            name: 'calcResult',
            meta: {
                title: '计算结果'
            },
            component: () => import(/* webpackChunkName: "calcResult" */ '@/pages/calcu/res' )
        },
        {
            path: '/pages/sale/lists',
            name: 'saleList',
            meta: {
                keepAlive: true,
                title: '在售房源'
            },
            component: () => import(/* webpackChunkName: "saleList" */ '@/pages/sale/lists' )
        },
        {
            path: '/pages/sale/citys',
            name: 'saleCityList',
            meta: {
                keepAlive: true,
                title: '二手房列表'
            },
            component: () => import(/* webpackChunkName: "saleCityList" */ '@/pages/sale/citys' )
        },
        {
            path: '/pages/rent/lists',
            name: 'rentList',
            meta: {
                keepAlive: true,
                title: '在租房源'
            },
            component: () => import(/* webpackChunkName: "rentList" */ '@/pages/rent/lists' )
        },
        {
            path: '/pages/rent/citys',
            name: 'rentCityList',
            meta: {
                keepAlive: true,
                title: '租房列表'
            },
            component: () => import(/* webpackChunkName: "rentCityList" */ '@/pages/rent/citys' )
        },
        {
            path: '/pages/home/map',
            name: 'map',
            meta: {
                title: '位置与周边'
            },
            component: () => import(/* webpackChunkName: "map" */ '@/pages/home/map' )
        },
        {
            path: '/pages/sale/detail',
            name: 'houseDetails',
            meta: {
                title: '二手房详情',
                auth:true
            },
            component: () => import(/* webpackChunkName: "houseDetails" */ '@/pages/sale/detail' )
        },
        {
            path: '/pages/user/entrust',
            name: 'entrust',
            meta: {
                title: '我要委托'
            },
            component: () => import(/* webpackChunkName: "entrust" */ '@/pages/user/entrust' )
        },
        {
            path: '/pages/user/favor',
            name: 'collection',
            meta: {
                title: '我的收藏',
                auth:true
            },
            component: () => import(/* webpackChunkName: "collection" */ '@/pages/user/favor' )
        },
        {
            path: '/pages/more/intro',
            name: 'houseIntroduce',
            meta: {
                title: '房源介绍'
            },
            component: () => import(/* webpackChunkName: "houseIntroduce" */ '@/pages/more/intro' )
        },
        {
            path: '/pages/more/info',
            name: 'houseInfo',
            meta: {
                title: '房源信息'
            },
            component: () => import(/* webpackChunkName: "houseInfo" */ '@/pages/more/info' )
        },
        {
            path: '/pages/more/pics',
            name: 'housePicture',
            meta: {
                title: '房源相册'
            },
            component: () => import(/* webpackChunkName: "housePicture" */ '@/pages/more/pics' )
        },
        {
            path: '/pages/rent/detail',
            name: 'rentDetails',
            meta: {
                title: '租房详情',
                auth:true
            },
            component: () => import(/* webpackChunkName: "houseDetails" */ '@/pages/rent/detail' )
        },
        {
            path: '/pages/home/search',
            name: 'search',
            meta: {
                title: '搜索'
            },
            component: () => import(/* webpackChunkName: "search" */ '@/pages/home/search' )
        },
        {
            path: '/pages/imChat/lists',
            name: 'chatList',
            meta: {
                // keepAlive: true, 需要刷新列表
                auth:true,
                title: '聊天会话列表'
            },
            component: () => import(/* webpackChunkName: "chatList" */ '@/pages/imChat/lists' )
        },
        {
            path: '/pages/imChat/users',
            name: 'chatUser',
            meta: {
                title: '聊天用户列表'
            },
            component: () => import(/* webpackChunkName: "chatUser" */ '@/pages/imChat/users' )
        },
        {
            path: '/pages/imChat/index',
            name: 'chatMessage',
            meta: {
                title: '即时聊天窗口'
            },
            component: () => import(/* webpackChunkName: "chatMessage" */ '@/pages/imChat/index' )
        }
    ]
})
/*
router.beforeEach((to,from,next)=>{
  if(to.meta.auth){
    //登陆逻辑判断
    //util.removeStore('uhash');
    if(util.isWeixin()){ //微信端
        let resident_code = to.query.resident_code; // 海纳回调链接里的resident_code
        let uhash = util.getStore('uhash');
        //let userInfo = JSON.parse(util.getStore('userInfo'));
        if(resident_code){
            hnUserInfo(resident_code).then(res =>{
                if(res.code == 0){
                    store.commit('RECORD_USERINFO', res.data);
                    next();
                }else{
                    util.removeStore('uhash');
                    util.removeStore('userInfo');
                    Toast.fail('获取用户信息失败');
                }
            })
        }else{ // 非授权页面
            if(uhash){
                next();
            }else{
                Toast.fail('获取用户信息失败');
            }
        }
    }else{ //手机端
        next();
    }
  }else{
    next();
  }
})
*/
export default router;