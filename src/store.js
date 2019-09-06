import Vue from 'vue'
import Vuex from 'vuex'
import util from './config/util'

Vue.use(Vuex)

const RECORD_USERINFO = 'RECORD_USERINFO'
const RECORD_ADMININFO = 'RECORD_ADMININFO'
const RECORD_HOUSEDETAIL = 'RECORD_HOUSEDETAIL'
const RECORD_CONTACT = 'RECORD_CONTACT'
const socketPrefix = 'SOCKET_'

export default new Vuex.Store({
    state: {
        userInfo:{}, //用户信息
        adminInfo:{}, //经纪人信息
        houseDetail:{}, //房源详情
        contact:{}, //房源联系人
        chats:{ // 聊天相关
            //conlist:{}, // 会话列表 ? 
            //msglist:{}, // 聊天列表
            message:{}, // 最后信息
            touser:{}, // 当前与谁聊天
            tokey:'', // (缓存/不用本地存储)聊天对方的key: haina_12, hnadm_34
            tolist:[], // (缓存/不用本地存储)提醒列表，用于一个人只提醒一次
            fymsg:{}, // 房源信息
            msgCnts:0,
            online:0 // 在线人数
        }
    },
    mutations: {        
        [RECORD_USERINFO](state, info) {// 记录用户信息
            state.userInfo = info;
            util.setStore('uhash', encodeURIComponent(info.hash));
            util.setStore('userInfo', info);
        },
        [RECORD_ADMININFO](state, info) {// 记录经纪人信息
            state.adminInfo = info;
            util.setStore('ahash', encodeURIComponent(info.hash));
            util.setStore('adminInfo', info);
        },
        [RECORD_HOUSEDETAIL](state, detail) {
            state.houseDetail = detail;
            util.setStore('houseDetail', detail);
        },
        [RECORD_CONTACT](state, detail) {
            state.contact = detail ? detail : {};
            util.setStore('contact', detail ? detail : {});
        },
        [socketPrefix+'setTouser'](state, data){
            state.chats.touser = data;
        },
        [socketPrefix+'setTokey'](state, tokey){
            state.chats.tokey = tokey;
            // from:delTolist
            for(var i=0; i<state.chats.tolist.length-1; i++) {
                if(state.chats.tolist[i]==tokey){
                    state.chats.tolist.splice(i,1);
                }
            }            
        },
        [socketPrefix+'setTolist'](state, tokey){
            state.chats.tolist.push(tokey);
        },
        [socketPrefix+'setMsgCnts'](state, data){
            if(!data.show){
                state.chats.msgCnts++;
            }
        },
        [socketPrefix+'setFymsg'](state, fymsg){
            state.chats.fymsg = fymsg;
        },
        /*[socketPrefix+'delTolist'](state, tokey){
            //
        },*/
        [socketPrefix+'getMessage'](state, data){
            state.chats.message = data;
        },
        [socketPrefix+'online'](state, data){
            state.chats.online = data[0];
        }
    },
    actions: {
        /*[socketPrefix+'s2cTest']({commit}, data) {
            console.log('act:s2cTest:', data);
        }*/
    }
})
