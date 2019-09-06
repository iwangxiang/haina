<template>
    <div id="app" class="container">
        <transition name="router-fade" mode="out-in">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive" v-wechat-title="$route.meta.title"></router-view>
            </keep-alive>
        </transition>
        <transition name="router-fade" mode="out-in">
            <router-view v-if="!$route.meta.keepAlive" v-wechat-title="$route.meta.title"></router-view>
        </transition>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex';
    import {mapState} from 'vuex';
    import {Notify} from 'vant';
    import util from './config/util';

    export default {
        data(){
            return{
                message:{}
            }
        },
        sockets: {
            // 消息提醒：
            getMessage: function (data) {
                this.SOCKET_setMsgCnts(data);
                var path = this.$route.path,
                    parr = [
                        // '/pages/home/index', // 首页已有红点提示了,可以不要
                        '/pages/imChat/index',
                        '/pages/imChat/lists',
                        '0'
                    ];
                // 不提醒页：聊天页,经纪人页,列别表页
                if(parr.indexOf(path)>0){
                    return;
                } // console.log(path);
                // 与当前人聊,不提醒
                var tokey = this.chats.tokey;
                if(data.ufrom==tokey){
                    return;
                }
                /*/ 如果已经提醒,不再提醒
                if(this.chats.tolist.indexOf(data.ufrom)>=0){ 
                    return;
                }else{
                    this.SOCKET_setTolist(data.ufrom);
                }*/
                // 消息提醒(只提醒一次)
                var msgs = util.getMsgs(data);
                //this.$toast('收到消息['+data.uname+']\n'+msgs+'');
                Notify({
                    message: '收到消息['+data.uname+']\n'+msgs+'',
                    background: '#5bc0de',
                    duration: 2300
                });
            },
            // 未读消息-更新
            getUnreads: function (data) {
                this.chats.msgCnts = data.cnts;
            }
        },
        computed: {
            ...mapState(['userInfo','chats'])
        },
        methods:{
            ...mapMutations(['SOCKET_setTolist','SOCKET_setMsgCnts']),
            // for-
        },
        components:{}
    }
</script>

<style lang="less">
    * {
        margin: 0;
        padding: 0;
        .router-fade-enter-active, .router-fade-leave-active {
            transition: opacity .3s;
        }
        .router-fade-enter, .router-fade-leave-active {
            opacity: 0;
        }
        .container {
            width: 100%;
            min-width: 320px;
            max-width: 640px;
            margin: 0 auto;
            overflow: hidden;
            .publicHeader~.publicContent{
                margin-top: 46px;   
            }
        }
    }
</style>
