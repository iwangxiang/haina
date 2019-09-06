<template>
    <div class="message">
        <nav-bar :title="msg" v-if="!isWeixin" class="publicHeader"></nav-bar>
        <div class="publicContent">
            <div class="messageList">
                <div>
                    <van-swipe-cell v-for="(item,index) in lists" :key="item.id" :right-width="65" :left-width="65" class="van-swipe-cell2">
                        <span v-if="(item.top==500)" slot="left" class="vanSwipeCell van-swipe-cell__left2" @click="setTopConversation(item,index)">
                            设置<br>置顶
                        </span>
                        <span v-if="(item.top<500)" slot="left" class="vanSwipeCell van-swipe-cell__left2" @click="unTopConversation(item,index)">
                            取消<br>置顶
                        </span>
                        <div class="messageListCont" @click="goChat(item)">
                            <div>
                                <img :src="item.thumb ? item.thumb : defThumb">
                                <span v-if="cnts[item.ufrom]">{{cnts[item.ufrom]}}</span>
                            </div>
                            <div>
                                <h2>{{item.uname ? item.uname : item.ufrom}}</h2>
                                <p>{{item.msgs ? item.msgs : '(无留言)'}}</p>
                            </div>
                            <div>
                                <span>{{item.fmtTime}}</span>
                            </div>
                        </div>
                        <span slot="right" class="vanSwipeCell van-swipe-cell__right2" @click="delConversation(item,index)">删除</span>
                    </van-swipe-cell>
                    <div v-if="vtemp" style="text-align:center;">临时会话 左拉导入</div>
                    <van-swipe-cell v-for="(item,index) in ltmps" :key="'tmp_'+item.id" :right-width="65" :left-width="65" class="van-swipe-cell2">
                        <div class="messageListCont">
                            <div>
                                <img :src="item.thumb ? item.thumb : defThumb">
                                <span v-if="item.ufrom==tmpuid">发</span>
                                <span v-if="item.uto==tmpuid">收</span>
                            </div>
                            <div>
                                <h2>{{item.uname ? item.uname : item.ufrom}}</h2>
                                <p>
                                    {{item.ufrom==tmpuid?'(我)':item.ufrom}} -=> 
                                    {{item.uto==tmpuid?'(我)':item.uto}} : 
                                    {{item.msgs ? item.msgs : '(无留言)'}}
                                </p>
                            </div>
                            <div>
                                <span>{{item.fmtTime}}</span>
                            </div>
                        </div>
                        <span slot="right" class="vanSwipeCell van-swipe-cell__right2" @click="importChats(item,index)">导入</span>
                    </van-swipe-cell>
                </div>
            </div>
                <p style="display:none;">
                    <span v-if="user && user.id">用户<b>[{{ user.username ? user.username : '('+user.id+')' }}]</b>已登录！</span>
                    <span v-else>未登录普通用户，请授权登录使用！</span>
                </p>

        </div>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex';
    import {mapState} from 'vuex';
    import util from '../../config/util';
    import navBar from "../../components/common/navBar.vue";

    export default {
        data(){
            return{
                user_id: 0,
                user: {}, //用户信息
                cnow: {}, // 当前聊天用户 
                cnts: {},
                lists: {},
                admins: {},
                ltmps: [],
                tmpuid: '',
                vtemp: 0,
                umsg: '',
                defThumb: require('@/assets/demo_60x60.gif'), //默认头像
                msg: "在线咨询"
            }
        },
        sockets: {
            getAdmins: function (data){ 
                this.admins = data.adms; 
            },
            /*getBindAdmid: function (data){
                this.admid = data; 
            },*/
            getMessage: function (data) {
                let inlist = 0; // 更新列表
                for(let i=0;i<this.lists.length;i++){ 
                    var itm = this.lists[i];
                    if(data.ufrom==itm.ufrom){
                        if(this.cnts[itm.ufrom]){ this.cnts[itm.ufrom] = this.cnts[itm.ufrom]+1; }
                        else{ this.cnts[itm.ufrom] = 1; }
                        itm.msgs = data.msgs;
                        itm.fmtTime = data.fmtTime;
                        inlist = 1;
                        break;
                    }
                }
                if(!inlist){ // 无列表，添加一个会话
                    this.cnts[data.ufrom] = 1;
                    this.lists.push(data);
                }
            },
            getConversationList: function (data) {
                this.cnts = data.cnts;
                this.lists = data.list;
                if(this.lists.length==0){
                    this.$toast('没有聊天会话列表。'); // ，请从房源信息，点击经纪人进行会话
                }
                this.SOCKET_setFymsg({});
                this.SOCKET_setTokey(''); // 清除会话标记
                this.$socket.emit('setNowConversation', ''); // 通知服务端
                /*/ 导入临时会话:我觉得也够麻烦，没必要
                if(this.user && this.user.id){ // .indexOf('haina_')==0
                    let tmpuid = window.localStorage.getItem('haina_guest')
                    if(!tmpuid || tmpuid.length>5){ //console.log(tmpuid)
                        this.tmpuid = tmpuid
                        this.$socket.emit('pullTempChatList', tmpuid);
                    }
                }*/
            },
            getTempChatList: function (data) {
                this.ltmps = data.list; 
                if(this.ltmps.length){
                    this.vtemp = 1;
                    this.$toast('含有临时会话列表'); // ，请从房源信息，点击经纪人进行会话
                }
            } 
        },
        computed: { 
            ...mapState(['chats']),
        },
        mounted(){ 
            this.initUser();
        },
        methods:{ // ,'RECORD_USERINFO'
            ...mapMutations([
                'SOCKET_setTouser', 'SOCKET_setFymsg', 'SOCKET_setTokey',
                'SOCKET_getMessage', 'RECORD_USERINFO'
            ]),
            initUser() { // 登录完用户时执行
                this.user = JSON.parse(util.getStore('userInfo'))
                this.cnow = util.getCnow(this.user)
                this.$socket.emit('pullUnreads', this.cnow); 
                this.$socket.emit('initUser', this.cnow); 
                setTimeout(() => { // 拉取会话列表 
                    this.$socket.emit('pullConversationList', this.cnow);
                }, 500);
            },            
            getUserInfo(){
                /*
                if(util.getStore('uhash')){ //已经登录
                    this.user = JSON.parse(util.getStore('userInfo')); 
                    if(this.user && this.user.id){
                        this.initUser();
                    }
                }*/         
            },
            goChat(item){ // 可能是经纪人之间聊天？
                this.$socket.emit('setNowConversation', item.ufrom); 
                this.$socket.emit('clearMessagesUnreadStatus', item.ufrom);
                var thumb = item.thumb ? item.thumb : this.defThumb;
                var touser = {tokey:item.ufrom, uname:item.uname, thumb};
                this.SOCKET_setTouser(touser); 
                var p = 'tokey=' + item.ufrom + (this.admins[item.ufrom] ? '&hnadm=1' : '');
                this.$router.push({path:'/pages/imChat/index?'+p});
            },
            delConversation(item,index){
                this.lists.splice(index, 1);
                this.$socket.emit('delConversation', item.ufrom);
            },
            setTopConversation(item,index){ 
                item.top = 300;
                this.lists.splice(index, 1);
                this.lists.unshift(item);
                this.$socket.emit('setTopConversation', item.ufrom);
            },
            unTopConversation(item,index){ 
                item.top = 500;
                this.lists.splice(index, 1);
                this.lists.push(item);
                this.$socket.emit('resetTopConversation', item.ufrom);
            },
            gologin(){
                this.$router.push({path:"/pages/imChat/users"});
            }
        },
        components:{
            navBar
        }
    }
</script>

<style scoped lang="less">
    p{ margin:0.2rem 0.5rem; }
    .message{
        .messageList{
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
                    span{
                        width: 17px;
                        height: 17px;
                        background: url(../../assets/round.png) no-repeat;
                        background-size: 17px 17px;
                        line-height: 17px;
                        text-align: center;
                        color: #ffffff;
                        position: absolute;
                        left: 35px;
                        top: 11px;
                    }
                }
                >div:nth-child(2){
                    width: 230px;
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
                        font-size: 14px;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                        margin: 5px 0 0 0;
                    }
                }
                >div:nth-child(3){
                    position: absolute;
                    top: 20px;
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
        border-bottom: 1px solid #E2E2E2;
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
        font-size: 14px;
        i{
            font-style: normal;
            display: block;
        }
    }
    .van-swipe-cell__right2{
        background-color: #f44;
        color: #ffffff;
        font-size: 14px;
    }
</style>
