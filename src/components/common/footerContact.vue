<template>
    <div class="footerContact">
        <div class="contactCont">
            <div>
                <div>
                    <img :src="contact.thumb">
                </div>
                <div>
                    <h3>{{contact.realname}}</h3>
                    <p>联系经纪人</p>
                </div>
            </div>
            <div>
                <p @click="goChats(contact)">聊天</p>
                <p @click="openCall">拨打电话</p>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex';
    //import {mapState} from 'vuex';
    import util from '../../config/util';
    //import {wechatLogin,userInfo} from "../../config/api";

    export default {
        data(){
            return{
                user: {}, // 用户信息
                showToast: false,//显示提示框
                toastText: '',
                contact:{},
                cnow:{},
                umsg: ''
            }
        },
        // fyInfo是异步信息,使用fyId时可能fyInfo还没得到
        props:['fyType','fyId','fyInfo'], 
        /*computed:mapState({
            contact:function(state){//箭头函数会有this的问题
                let localData = JSON.parse(util.getStore('contact'));
                if(!state.contact.realname && localData){
                    this.$store.commit('RECORD_CONTACT',localData);//同步操作
                }
                console.log(localData)
                return state.contact;
            }
        }),*/
        mounted(){ 
            let contact = JSON.parse(util.getStore('contact'));
            this.contact = contact ? contact : {}
            this.initUser();
        },
        methods:{
            ...mapMutations(['RECORD_USERINFO','SOCKET_setTokey','SOCKET_setTouser','SOCKET_setFymsg']), // 'SOCKET_getMessage',
            openCall(){
                if(!this.contact.mobile){
                    this.$toast('暂无联系电话');
                    return;
                }
                this.$dialog.confirm({
                    title: '温馨提示',
                    message: '是否拨打电话:' + this.contact.mobile
                    }).then(() => {
                        window.location.href = 'tel://' + this.contact.mobile;
                    }).catch(() => {
                        // on cancel
                });
            },
            initUser() { // 登录完用户时执行
                this.user = JSON.parse(util.getStore('userInfo'))
                this.cnow = util.getCnow(this.user)
                this.$socket.emit('initUser', this.cnow)
                this.SOCKET_setTokey('') // 清除会话标记
                this.$socket.emit('setNowConversation', '') // 通知服务端
            },
            tplMsg(to) { // 发模板消息
                var uto = to.tokey,
                    tags = this.fyInfo.xiangq + '|' + this.fyInfo.jzmj + '|' + (this.fyInfo.cx ? this.fyInfo.cx : this.fyInfo.louceng),
                    arr = {
                        "id": this.fyInfo.id,
                        "model": this.fyType,
                        "thumb": this.fyInfo.thumb,
                        "title": this.fyInfo.title,
                        "price": this.fyInfo.price,
                        "tags": tags
                    },
                    msgs = JSON.stringify(arr),
                    data = {uid:this.cnow.uid, uname:this.cnow.uname, thumb:this.cnow.thumb, 
                        uto, msgs, type:'tpla', hnadm:1}; 
                this.SOCKET_setFymsg(data); // 仅保存,到了聊天页才点击发送
                //this.$socket.emit('sendMessage', data); 
            },
            goChats(user){ 
                if(!user.id){ // !user || 
                    alert('未设置聊天通知，请联系管理员！');
                    return;
                } 
                if(this.user && this.user.id==user.id){
                    alert('你要和自己聊天？不行，洗洗睡吧！');
                    return;
                }
                let tokey = 'haina_'+user.id
                var to = {tokey, uname:user.username, thumb:user.thumb};
                this.$socket.emit('setNowConversation', to.ufrom); 
                this.$socket.emit('clearMessagesUnreadStatus', to.ufrom);
                this.SOCKET_setTouser(to); //console.log(to);
                // tpl-message
                this.tplMsg(to); // 发模板消息
                setTimeout(() => { 
                    var p = 'tokey='+tokey+'&hnadm=1'; // 
                    this.$router.push({path:'/pages/imChat/index?'+p});
                }, 300);
            }
        }
    }
</script>

<style scoped lang="less">
    .footerContact{
        width: 100%;
        height: 60px;
        background-color:#ffffff;
        z-index: 20;
        position: fixed;
        bottom: 0;
        left: 0;
        .contactCont{
            min-width: 300px;
            max-width: 640px;
            margin: 0 auto;
            padding: 7px 10px;
            border-top: 1px solid #e2e2e2;
            display: flex;
            justify-content:space-between;
            >div:nth-child(1){
                display: flex;
                >div:nth-child(1){
                    width: 45px;
                    height: 45px;
                    img{
                        width: 100%;
                        vertical-align: top;
                    }
                }
                >div:nth-child(2){
                    margin-left: 10px;
                    p{
                        font-size: 12px;
                        color: #999999;
                    }
                    h3{
                        font-size: 15px;
                        color: #222222;
                        margin-top: 5px;
                    }
                }
            }
            >div:nth-child(2){
                display: flex;
                >p{
                    width: 90px;
                    height: 45px;
                    line-height: 45px;
                    text-align: center;
                    border-radius: 5px;
                    float: left;
                    color: #ffffff;
                    font-size: 16px;
                }
                >p:nth-child(1){
                    background-color: #3A66E9;
                    margin-right: 10px;
                }
                >p:nth-child(2){
                    background-color: #F44336;
                }
            }
        }
    }
</style>
