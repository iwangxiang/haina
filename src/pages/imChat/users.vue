<template>
    <div class="message">
        <nav-bar :title="msg" v-if="!isWeixin" class="publicHeader"></nav-bar>
        <div class="publicContent">
            <div>
                <p>
                    <span v-if="user && user.id">
                        <b>{{ user.id +'/'+ user.username }}</b> 
                    </span>
                    <span v-else>
                        <b>游客，未登录！ </b>
                    </span>
                    <span style="float: right;">
                        左拉:登录/对话/进小区
                    </span>
                </p>
                <p style="text-align:center;">
                    <a href="#/pages/imChat/lists?test=1">会话列表</a> #
                    <a>返回首页</a>
                </p>
                <hr>
            </div>

            <div class="messageList">
                <div>

                    <van-swipe-cell v-for="item in lists" :key="'haina_'+item.id" :right-width="150" :left-width="65" class="van-swipe-cell2">
                        <span slot="left" class="vanSwipeCell van-swipe-cell__left2">操作1</span>
                        <div class="messageListCont">
                            <div>
                                <img :src="item.thumb ? item.thumb : defThumb">
                            </div>
                            <div>
                                <h2>{{item.admid ? item.realname : item.username}} ({{item.id}})</h2>
                                <p>{{item.thumb}}</p>
                            </div>
                            <div>
                                <span>{{item.create_time.substring(11,16)}}</span>
                            </div>
                        </div>
                        <span slot="right" class="vanSwipeCell van-swipe-cell__right2">
                            <b @click.stop="jumpXiaoqu(item)">小区</b> -
                            <b @click.stop="login(item,0)">登录</b> -
                            <b @click.stop="goChat(item,0)">对话</b>  
                        </span>
                    </van-swipe-cell>
                </div>
            </div>

            <div>
                <p>
                    <span style="float:right;">
                        (.f2) online:{{ chats.online }} 
                    </span>
                    <a href="javascript:void(0)" @click="csTest()">cs测试</a> | 
                    <a href="javascript:void(0)" @click="clearLogins()">清除:user/hash</a>
                </p>

                <p>
                    Msg : {{chats.message ? chats.message : '(Null)' }}
                </p>
                <p>

                    touser: {{ chats.touser ? chats.touser : '(Null)' }}
                </p>

                <p>
                    说明：略。 -end-
                </p>
            </div>

        </div>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex';
    import {mapState} from 'vuex';
    import util from '../../config/util'; 
    import {ulogin,rowXiaoqu} from "../../config/api";
    import navBar from "../../components/common/navBar.vue";

    export default {
        data(){
            return{
                user: {}, //用户信息
                lists: {},
                admins: {},
                umsg: '',
                isLocal: 0,
                klogin: '',
                tmp: {},
                defThumb: require('@/assets/demo_60x60.gif'),//默认头像
                msg: "管理认证,模拟登录"
            }
        },
        created(){  
            this.klogin = this.$route.query.klogin; 
        },
        sockets: {
            getUserLists: function (data) {
                this.lists = data.rows;
            },
            s2cTest: function (data) {
                this.tmp = data;
                alert('aa');
                //console.log(data);
            }
        },
        computed: {
            ...mapState(['chats']),
            //abc(){}
        },
        mounted(){           
            //this.isLocal = document.domain.indexOf('192.168.1.')===0;
            if(this.klogin){
                this.ulogin();
            }else if(util.isLocal()){ // 拉取用户 
                this.user = JSON.parse(util.getStore('userInfo'))
                this.$socket.emit('pullUserLists');
            }else{
                this.$router.push({path:'/pages/imChat/lists'});
            }
        },
        methods:{
            ...mapMutations(['RECORD_USERINFO','SOCKET_setTouser']),
            
            setLogin(user){ 
                if(!user || !user.id) return;
                this.$socket.emit('pullUnreads', user);
                this.umsg = '已登录；无聊？选一个聊聊'; 
                var uid = 'haina_' + user.id, // 用户前缀；
                    thumb = user.thumb ? user.thumb : '',
                    uname = user.admid ? user.realname : user.username,
                    cnow = {uid:uid, uname, thumb};
                this.$socket.emit('initUser', cnow); // 登录完用户时执行
            },
            login(item){ // 模拟用户,链接socket
                if(this.user && this.user.id==item.id){
                    alert('不能重复登录!');
                    return; 
                }
                this.RECORD_USERINFO(item);
                this.setLogin(item);
                this.user = item;
            }, // 

            async ulogin(){ // 模拟用户,链接socket
                await ulogin(this.klogin).then(res =>{         
                    if(res.code == 0){ 
                        this.user = res.data
                        this.RECORD_USERINFO(res.data);
                        this.$router.push({path:'/pages/home/index?id='+this.user.xqid});          
                    }else{
                        this.$toast(res.msg);
                        this.$router.push({path:'/pages/imChat/lists'});
                    }
                })
            },
            jumpXiaoqu(item){ 
                rowXiaoqu(item.id, 'uid').then(res =>{
                    if(res.code == 0){ 
                        this.$router.push({path:'/pages/home/index?id='+res.data.id});
                    }else{
                        this.$toast(res.msg);
                    }   
                })   
            },
            goChat(to){ // 可能是经纪人之间聊天？
                let uto = 'haina_'+to.id, 
                    cnow = util.getCnow(this.user) //;console.log(to, cnow)
                if(uto==cnow.uid){
                    alert('不能与自己对话!')
                    return;
                }
                this.$socket.emit('initUser', cnow); 
                setTimeout(()=>{
                    this.$socket.emit('setNowConversation', uto); 
                    this.$socket.emit('clearMessagesUnreadStatus', uto);
                    var touser = {tokey:uto, uname:to.username, thumb:to.thumb};
                    this.SOCKET_setTouser(touser); 
                    var p = 'tokey=' + uto //+ (this.admins[uto] ? '&hnadm=1' : '');
                    this.$router.push({path:'/pages/imChat/index?'+p});
                }, 1230)
            },
            clearLogins(){ 
                util.removeStore('userInfo');
                util.removeStore('uhash');
                this.user = null
            },
            csTest(){  // 测试 
                this.$socket.emit('c2sTest', this.user); 
            }
        },
        components:{
            navBar
        }
    }
</script>

<style scoped lang="less">
    p{ margin:0.3rem 0.5rem; }
    .message{
        .messageList{
            >div{
                border-bottom: 1px solid #E2E2E2;
            }
            .messageListCont{
                width: 90%;
                margin: 0 auto;
                display: flex;
                position: relative;
                >div:nth-child(1){
                    width: 45px;
                    height: 45px;
                    margin-top: 20px;
                    img{
                        width: 100%;
                        vertical-align: top;
                    }
                }
                >div:nth-child(2){
                    width: 90%;
                    height:45px;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    margin: 20px 0 0 15px;
                    h2{
                        font-size: 16px;
                        font-weight: normal;
                        color: #222222;
                    }
                    p{
                        color: #999999;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                        font-size: 14px;
                        margin:0.1rem 0.5rem;
                    }
                }
                >div:nth-child(3){
                    position: absolute;
                    top: 10px;
                    right: 0;
                    span{
                        font-size:14px;
                        color: #999999;
                    }
                }
            }
        }
    }
    .van-swipe-cell2{
        height: 85px;
    }
    .vanSwipeCell{
        color: #fff;
        font-size: 15px;
        width: 65px;
        height: 85px;
        text-align: center;
        display:flex;
        text-align:center;
        align-items:center;
        justify-content:center;
    }
    .van-swipe-cell__left2{
        background-color: #DEDEDE;
        color: #333333;
    }
    .van-swipe-cell__right2{
        width: 150px;
        background-color: #f44;
        color: #ffffff;
    }
</style>

