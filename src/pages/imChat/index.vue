<template>
    <div class="imMessage">
        <nav-bar :title="msg" v-if="!isWeixin" class="publicHeader"></nav-bar>
        <div class="publicContent">
            <div class="imMessageContent">
                <!--/imMain:start/-->
                <div class="imMain">
                    <div class="xw-content" ref="xwBody" @click="inpoutTouch()">
                        <div class="xw-chat-wrap">
                            <ul ref="msgList">

                                <p class="data-nomore-text" @click="pullMore">
                                    <span class="noneMore" v-if="pullDisabled" >没有更多了</span>
                                    <span class="loadMore" v-else><img src="@/assets/clock.png"> 查看更多消息</span>
                                </p>
                                
                                <!-- 此处是模板消息 -->
                                <li v-for="item in records" :key="item.id">
                                    <div v-if="item.type=='tpla'"
                                         :class="[item.ufrom==tokey ? 'templateMessageCont templateMessageOther' : 'templateMessageCont templateMessageSelf']">
                                        <div class="templateMessageTime">
                                            <span v-html="viewTime(item)"></span>
                                        </div>
                                        <div :class="[ item.ufrom == tokey ? 'xw-chat-servicer' : 'xw-chat-customer' ]">
                                            <div class="xw-customer-avantar-wrap">
                                                <img :src="viewThumb(item)"
                                                     :class="[item.ufrom==tokey ? 'xw-servicer-avantar' : 'xw-customer-avantar']">
                                            </div>
                                            <div class="xw-chat-msg"
                                                 :class="[ item.ufrom == tokey ? 'xw-chat-msg-templateMessage-other' : 'xw-chat-msg-templateMessage-self' ]"
                                                 style="display:inline-block;">
                                                <div class="templateMessage">
                                                    <div v-if="item.btnSend" class="templateMessageInfoText">
                                                        <span @click="sendFy()">点击发送</span>
                                                    </div>
                                                    <div v-if="item.btnSend" class="templateMessageCover"></div>
                                                    <div class="templateMessageTitle" @click="viewUrl(item)">
                                                        <img :src="viewTpl1(item,'thumb')">
                                                    </div>
                                                    <div class="templatemMessageContent" @click="viewUrl(item)">
                                                        <h2><a v-html="viewTpl1(item,'title')"></a>
                                                        </h2>
                                                        <div class="templateMessageInfoContent">
                                                            <p v-html="viewTpl1(item,'tags')"></p>
                                                            <em v-html="viewTpl1(item,'price')"></em>
                                                            <span v-html="viewTpl1(item,'model')"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style="clear:both"></div>
                                    </div>
                                    <div v-else-if="item.ufrom==tokey">
                                        <div class="xw-chat-time">
                                            <span v-html="viewTime(item)"></span>
                                        </div>
                                        <div class="xw-chat-servicer">
                                            <div class="xw-servicer-avantar-wrap">
                                                <img :src="chats.touser.thumb ? chats.touser.thumb : defThumb" class="xw-servicer-avantar">
                                            </div>
                                            <div class="xw-chat-msg">
                                                <span v-html="replaceFace(item.msgs)"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- 用户发送的消息模板-->
                                    <div v-else>
                                        <div class="xw-chat-time">
                                            <span v-html="viewTime(item)"></span>
                                        </div>
                                        <div class="xw-chat-customer">
                                            <div class="xw-customer-avantar-wrap">
                                                <img :src="cnow.thumb ? cnow.thumb : defThumb" class="xw-customer-avantar">
                                            </div>
                                            <div class="xw-chat-msg" style="display:inline-block;">
                                                <span v-html="replaceFace(item.msgs)"></span>
                                            </div>
                                        </div>
                                    </div>
                                </li>

                            </ul>
                        </div>
                    </div> 

                    <div :class="[ isWeixin ? 'xw-footer-wechat' : 'xw-footer-wrap' ]">
                        <div class="xw-footer-content">
                            <div class="xw-vmodel-wrap">
                                <textarea class="xw-content-textarea" placeholder="请输入您的问题" 
                                          v-model="content" @keyup.13="sendMsg" @focus="onFocusText" 
                                          @blur.prevent="inputBlur('text')" ref="inputText" id='inputTarea'></textarea>
                            </div>
                            <div class="xw-chat-tool">
                                <div class="xw-chat-tool-item">
                                    <transition name="fade">
                                        <a href="javascript:void(0)" class="xw-send-btn-text"
                                           v-if="content.trim().length"
                                           @click="sendMsg">发送</a>
                                    </transition>
                                </div>
                                <div class="xw-chat-tool-item">
                                    <a href="javascript:;"
                                       :class="[showEmoji ? 'xw-face' :'xw-face-close','xw-chat-tool-btn']"
                                       @click="emojiFuc"></a>
                                </div>
                            </div>
                        </div>
                        <!-- 表情开始 -->
                        <transition name="slide-fade" style="display: none;">
                            <div class="xw-window-text xw-face-emoji-ul" v-if="showEmoji">
                                <div class="xw-chat-ul-box">
                                    <van-swipe class="vanSwipe">
                                        <van-swipe-item v-for="n in Math.ceil(EXPS.length/15)" :key="n">
                                            <li v-for="(item, index) in getEmotionData(n,15)" :key="index" class="xw-faceEmoji">
                                                <img :src="item.file" :data="item.code" v-on:click="content+=item.code">
                                            </li>
                                        </van-swipe-item>
                                    </van-swipe>
                                </div>
                            </div>
                        </transition>
                    </div>
                    <!-- 提示音 -->
                </div>
                <!--/imMain:end/-->
            </div>

        </div>
    </div>
</template>

<script>

    //var myScroll;

    import {mapMutations} from 'vuex';
    import {mapState} from 'vuex';
    //import iScroll from 'iscroll'; 
    //import iScroll from '../../config/iscroll-probe.js';
    import emoji from "../../config/emoji.js";
    import util from "../../config/util";
    import navBar from "../../components/common/navBar.vue";

    export default {
        components: {
            //iScroll,
            navBar
        },
        data() {
            return {

                msg: "...", // 在线会话
                //toid: '',
                hnadm: 0, // 标记是否与管理员聊
                tokey: '',
                mekey: '',
                user: {},
                cnow: {}, // 当前聊天用户 
                defThumb: require('@/assets/demo_60x60.gif'),//默认头像

                pullDisabled: false,
                last: 0, // 消息id，用于拉取更多消息
                xwBodyHeight: 0,

                comment: {},
                showEmoji: false,//是否显示表情
                showToast: false,//显示提示框
                toastText: '',
                //myaudio: require('../../assets/msg.mp3'),//铃音               
                content: '', //聊天记录
                records: [],
                EXPS: []
            }
        },

        computed: {
            ...mapState(['userInfo', 'adminInfo', 'chats', 'online'])
        },

        created() {
            this.tokey = this.$route.query.tokey;
            this.hnadm = this.$route.query.hnadm;
            this._loadEmojiData();
            this.userInit()
        },
        sockets: {
            doneInitUser: function () {
                //var user = this.user;
                setTimeout(() => {
                    this.$socket.emit('pullHistoryMessages', this.tokey, this.last);
                }, 500);
            },
            noinitUser: function () {
                this.$toast('初始化用户失败!');
                /*
                var user = this.user;
                if (!user.id) { // ==id
                    this.$toast('请重新登录!');
                    return;
                } else { 
                    this.$toast('自动重连!');
                }
                this.$socket.emit('initUser', this.cnow, 1); // 登录完用户时执行
                */
            },
            getMessage: function (data) {
                if (data.ufrom == this.tokey) {
                    this.records.push(data);
                } else {
                    //this.hint();
                }
                this.scrollToBottom();
            },
            getHistoryMessages: function (data) {
                // 信息添加到列表
                //this.isDownLoading = false;
                var last = data.lastid; //parseInt();
                var fymsg = this.chats.fymsg;
                if(!data.data || data.data.length==0){
                    if(!last && fymsg.msgs){
                        // btnSend:标记有发送按钮,且这个值是长度
                        fymsg.btnSend = 1;
                        this.records.push(fymsg);
                        //this.myScrollUpd();
                    }
                    this.pullDisabled = true;
                    return; 
                }
                if(last){
                    this.myScrollUpd('init');
                    var arr = data.data; //.reverse(),
                    //this.records.unshift(arr); 
                    for(var i=0; i<arr.length; i++) {
                        if(i==arr.length-1){
                            this.last = arr[i].id;
                        }
                        this.records.unshift(arr[i]);
                    }
                    setTimeout(() => { // ? 跳转到哪里?
                        this.myScrollUpd('end');
                    }, 500); //alert('请登录后聊天!');
                }else{
                    this.records = data.data.reverse();
                    // 模板消息-检测
                    var inlist = 0; // 是否在历史信息列表
                    for(let i=0; i<this.records.length; i++) {
                        var imsg = this.records[i];
                        if(i==0){
                            this.last = imsg.id;
                        }
                        if(imsg.msgs==fymsg.msgs){
                            inlist = 1;
                            break;
                        }
                    }
                    // 不在历史消息列表才提示发送
                    if(!inlist && fymsg.msgs){
                        // btnSend:标记有发送按钮,且这个值是长度
                        fymsg.btnSend = this.records.length+1;
                        this.records.push(fymsg);
                        //this.myScrollUpd();
                    }
                    this.scrollToBottom();
                }        
                //关闭上拉加载中
            }
        },
        mounted() {
            //
        },
        methods: {
            ...mapMutations(['SOCKET_setTouser','SOCKET_setTokey','SOCKET_setFymsg']),
            userInit() {
                this.user = JSON.parse(util.getStore('userInfo'))
                this.cnow = util.getCnow(this.user)
                let to = this.chats.touser ? this.chats.touser : {}
                if(this.cnow.uid==this.tokey){
                    alert('你要和自己聊天？不行，洗洗睡吧！');
                    this.$router.push({path:'/pages/imChat/lists?'})
                }
                if(!to.uname || !to.tokey) {
                    this.$toast('请选择聊天人')
                    setTimeout(() => { // ? 跳转到哪里?
                        var path = "/pages/imChat/lists";
                        this.$router.push({path});
                    }, 1200);
                }else{
                    this.mekey = this.cnow.uid;
                    this.$socket.emit('pullHistoryMessages', this.tokey, this.last);
                    this.SOCKET_setTokey(this.tokey);
                    this.msg = to.uname ? to.uname : to.tokey;
                } 
            },
            pullMore(){
                if(!this.pullDisabled){
                    this.$socket.emit('pullHistoryMessages', this.tokey, this.last);
                }
            },
            myScrollUpd(type){
                var nowHeight = this.$refs.msgList.offsetHeight;
                if(type=='init'){
                    this.xwBodyHeight = nowHeight;
                }
                if(type=='end'){
                    this.$refs.xwBody.scrollTop = nowHeight - this.xwBodyHeight;
                }
            },
            
            inpoutTouch(){
                if(this.$refs.inputText){
                    this.$refs.inputText.blur();
                } 
            },
            inputBlur(){
                setTimeout(function(){
                    var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                    window.scrollTo(0, Math.max(scrollHeight - 1, 0));
                }, 100);
            },

            //点击控制表情切换（显示和隐藏）
            emojiFuc() {
                this.showEmoji = !this.showEmoji;
            },
            viewThumb(item){
                var uinfo = item.ufrom==this.tokey ? this.chats.touser : this.cnow;
                return uinfo.thumb ? uinfo.thumb : this.defThumb;
            },
            viewUrl(item) {
                if(item.btnSend){
                    this.sendFy(); // 发送房源模板信息
                    return;
                } 
                var data = JSON.parse(item.msgs),
                    p = 'id=' + data['id']; //console.log(data);
                this.$router.push({path:'/pages/'+data['model']+'/detail?'+p});
            },
            sendFy() { // 发送房源模板信息
                var fymsg = this.chats.fymsg,
                    no = fymsg.btnSend-1;
                delete fymsg.btnSend; // 发给对方前，去掉这个属性
                fymsg['ufrom'] = this.mekey
                this.$socket.emit('sendMessage', fymsg);
                this.records.splice(no,1);
                this.records.push({
                    ufrom:this.mekey, uto:this.tokey,
                    fmtTime:util.fmtTime(), msgs:fymsg.msgs,
                    type:'tpla'
                }); //console.log(fymsg);
                this.SOCKET_setFymsg({});
                this.scrollToBottom();
            },
            sendMsg() {
                var content = this.content.trim();
                if (!content) return;
                this.records.push({
                    ufrom:this.mekey, uto:this.tokey,
                    fmtTime:util.fmtTime(), msgs:content,
                });
                var uto = this.chats.touser.tokey,
                    data = {ufrom:this.mekey, uname:this.cnow.uname, thumb:this.cnow.thumb, uto, 
                        msgs:content, type:'text', hnadm:this.hnadm};
                this.$socket.emit('sendMessage', data); //console.log(data);
                this.content = "";
                this.scrollToBottom();

            },
            getEmotionData(pageNow, pageSize) {
                return this.EXPS.slice((pageNow - 1) * pageSize, pageSize * pageNow)
            },
            viewTpl1(item, tag) { 
                var data = JSON.parse(item.msgs),
                    res = data[tag];
                if (tag == 'model') {
                    var tabs = {'sale': '出售', 'rent': '出租'};
                    res = tabs[res];
                }
                if (tag=='thumb' && !res){
                    res = this.defThumb;
                }
                return res;
            },
            viewTime(item) {
                if (item.fmtTime) return item.fmtTime;
                return util.fmtTime(item.atime);
            },
            replaceFace(con) {
                if (!con) {
                    return;
                }
                if (con.toString().indexOf('/:') > -1) {
                    var exps = this.EXPS;
                    for (var i = 0; i < exps.length; i++) {
                        con = con.replace(exps[i].reg, '<img src="' + exps[i].file + '"  alt="" />');
                    }
                }
                return con;
            },

            //滚动到底
            scrollToBottom() {
                setTimeout(() => {
                    //滚动条长度
                    var currentDistance = this.$refs.xwBody.scrollHeight - this.$refs.xwBody.clientHeight;
                    //当前滚动条距离顶部的距离
                    var currentScroll_y = this.$refs.xwBody.scrollTop;
                    if (currentDistance > 0 && currentDistance > currentScroll_y) {
                        currentScroll_y = Math.ceil((currentDistance - currentScroll_y) / 10) + currentScroll_y;
                        currentScroll_y = currentScroll_y > currentDistance ? currentDistance : currentScroll_y;
                        //微信和qq浏览器不支持 scrollTo？
                        //this.$refs.xwBody.scrollTo(0,currentScroll_y);
                        this.$refs.xwBody.scrollTop = currentScroll_y;
                        this.scrollToBottom();
                    }
                }, 13);
            },
            onFocusText() {
                this.scrollToBottom();
            },
            _loadEmojiData() {
                this.EXPS = emoji.EXPS.slice(0);
            }
        }
    }

</script>

<style>

    .loadMore{ color:#66F; border:0px solid #CCC; padding:0.2rem; border-radius:5px; }
    .loadMore img{ vertical-align: middle; }

    .data-nomore-text {
        color: #969799;
        font-size: 0.36rem;
        line-height: 1.3rem;
        text-align: center; 
    }
    .van-list__finished-text{ display:none; }
    .imMessage {
        width: 100vw;
        height: 100vh;
        position: absolute;
        left: 0;
        top: 0;
        overflow: hidden;
    }

    .imMessageContent {
        min-width: 320px;
        max-width: 640px;
        margin: 0 auto;
        height: 100vh;
        position: relative;
    }

    .imMain {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background-color: #F7F7F7;
        position: relative;
    }

    .xw-chat-ul-box .vanSwipe {
        height: 100%;
        text-align: center;
    }

    .xw-faceEmoji {
        margin-bottom: 7px;
        width: 20%;
        float: left;
    }

    .xw-chat-msg span img {
        vertical-align: middle;
    }

    textarea {
        width: 75%;
    }

    .xw-content {
        flex: 1;
        position: relative;
        overflow: auto;
        transition: height .8s;
    }

    .xw-footer-wechat {
        margin-bottom: 0; 
    }
    .xw-footer-wrap {
        margin-bottom: 46px;
    }

    .templateMessage {
        width: 245px;
        height: 218px;
        margin: auto;
        border-radius: 5px;
        position: relative;
        background-color: #ffffff;
        z-index: 99;
    }

    .templateMessageCover {
        width: 245px;
        height: 218px;
        background-color: #000000;
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0.3;
        border-radius: 5px;
        z-index: 100;
    }

    .templateMessageInfoText {
        width: 245px;
        height: 218px;
        line-height: 218px;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 101;
        color: #ffffff;
        font-size: 19px;
        text-align: center;
    }

    .templateMessageTitle {
        height: 105px;
        border-radius: 5px;
    }

    .templateMessageTitle img {
        width: 245px;
        height: 105px;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        vertical-align: top;
    }

    .templatemMessageContent {
        width: 213px;
        margin: 0 auto;
        position: relative;
    }

    .templatemMessageContent h2 {
        font-size: 15px;
        font-weight: normal;
        margin-top: 8px;
        line-height: 160%;
    }

    .templatemMessageContent h2 a {
        color: #0f0f0f;
    }

    .templateMessageInfoContent {
        margin-top: 6px;
    }

    .templateMessageInfoContent p, .templateMessageInfoContent em, .templateMessageInfoContent span {
        font-size: 12px;
        font-style: normal;
    }

    .templateMessageInfoContent p {
        color: #333333;
    }

    .templateMessageInfoContent em {
        color: #e83836;
        display: block;
        margin-top: 5px;
    }

    .templateMessageInfoContent span {
        width: 43px;
        height: 18px;
        display: block;
        position: absolute;
        bottom: 0;
        right: 0;
        border-radius: 20px;
        text-align: center;
        line-height: 18px;
        color: #e83836;
        border: 1px solid #e83836;
    }

    .templateMessageTime {
        width: 73px;
        height: 15px;
        background-color: #aeaeae;
        border-radius: 2px;
        text-align: center;
        line-height: 15px;
        margin: 0 auto 10px;
    }

    .templateMessageTime span {
        color: #ffffff;
        font-size: 12px;
    }

    .xw-chat-servicer:after,
    .xw-chat-servicer:before,
    .xw-chat-customer:after,
    .xw-chat-customer:before,
    .xw-chat-wrap:after,
    .xw-chat-wrap:before,
    .xw-chat-tool:after,
    .xw-chat-tool:before,
    .xw-chat-ul-box:after,
    .xw-chat-ul-box:before {
        display: table;
        content: "";
    }

    .xw-chat-wrap {
        overflow: hidden;
        padding-left: 16px;
        padding-bottom: 20px;
    }

    .xw-chat-wrap .xw-chat-time,
    .xw-chat-wrap time {
        line-height: 1;
        text-align: center;
        display: block;
        margin-bottom: 8px;
        margin-top: 8px;
        font-size: 12px;
        color: #999;
        text-shadow: 1px 1px 1px hsla(0, 0%, 100%, .6);
    }

    .xw-chat-servicer,
    .xw-chat-customer {
        position: relative;
        margin-bottom: 16px;
        padding: 0 10px 0 45px;
    }

    .xw-servicer-avantar-wrap {
        position: absolute;
        bottom: 0;
        line-height: 0;
    }

    .xw-send-btn-text {
        padding: 4px 8px;
        background-color: #3A66E9;
        color: #fff;
        border-radius: 5px;
    }

    .xw-customer-avantar-wrap {
        position: absolute;
        bottom: 0;
        right: 8px;
        line-height: 0;
    }

    .xw-chat-servicer .xw-servicer-avantar-wrap, .xw-customer-avantar-wrap {
        left: 0;
    }

    .xw-servicer-avantar {
        border-radius: 100%;
    }

    .xw-servicer-avantar-wrap img, .xw-customer-avantar-wrap img {
        height: 34px;
        width: 34px;
    }

    .xw-chat-msg {
        -webkit-font-smoothing: antialiased;
        hyphens: auto;
        word-wrap: break-word;
        word-break: normal;
        position: relative;
        clear: both;
        padding: 8px 16px;
        border: 1px solid transparent;
        max-width: 100%;
        min-width: 50px;
        min-height: 22px;
        line-height: 1.6em;
        max-width: 70%;
    }

    .xw-chat-servicer .xw-chat-msg {
        background: #fff;
        border-color: #efefef;
        float: left;
    }

    .xw-chat-msg :last-child {
        margin-bottom: 0;
    }

    .xw-chat-msg span {
        white-space: pre-line;
    }

    .xw-chat-servicer,
    .xw-chat-customer {
        position: relative;
        margin-bottom: 16px;
        padding: 0 10px 0 45px;
    }

    .xw-chat-customer {
        text-align: right;
    }

    .xw-chat-customer .xw-chat-msg {
        float: right;
        text-align: left;
        background: #3A66E9;
        border-color: #3A66E9;
        color: #fff;
        margin-right: 45px;
    }

    .templateMessageCont.templateMessageSelf .xw-chat-customer .xw-chat-msg-templateMessage-self {
        background: none;
        border: none;
        margin-right: 55px;
    }

    .templateMessageCont.templateMessageOther .xw-chat-servicer .xw-chat-msg-templateMessage-other {
        background: none;
        border: none;
        margin-left: -20px;
    }

    .xw-customer-avantar {
        border-radius: 50%;
    }

    .xw-chat-msg :last-child {
        margin-bottom: 0;
    }

    .xw-chat-wrap .xw-system-info-time,
    .xw-chat-wrap time {
        line-height: 1;
        text-align: center;
        display: block;
        margin-bottom: 8px;
        font-size: 12px;
        color: #999;
        text-shadow: 1px 1px 1px hsla(0, 0%, 100%, .6);
    }

    .xw-system-info {
        margin-bottom: 8px;
    }

    .xw-chat-wrap > :last-child {
        margin-bottom: 16px;
    }

    .xw-system-info {
        text-align: center;
        font-size: 12px;
    }

    .xw-system-info span {
        display: inline-block;
        background: rgba(0, 0, 0, .08);
        padding: 4px 8px;
        line-height: 1;
        color: #7c7c7c;
        border-radius: 2px;
        text-shadow: 1px 1px 1px hsla(0, 0%, 100%, .6);
    }

    .xw-footer-wrap, .xw-footer-wechat {
        justify-content: flex-end;
        width: 100%;
        box-shadow: 0 -1px 4px rgba(0, 0, 0, .05);
        background: #fff;
        z-index: 2;
    }

    .xw-footer-content {
        position: relative;
        height: 52px;
        display: flex;
        box-shadow: rgba(0, 0, 0, 0.05) 0px -1px 4px;
    }

    .xw-vmodel-wrap {
        flex: 1;
    }

    .xw-content-textarea {
        box-sizing: border-box;
        z-index: 1;
        overflow-y: auto;
        font-size: 14px;
        line-height: 14px;
        border: none;
        resize: none;
        padding: 16px 85px 16px 14px;
        font-family: inherit;
        white-space: pre;
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    .xw-chat-tool {
        position: absolute;
        right: 0px;
        bottom: 0;
        z-index: 2;
    }

    .xw-chat-tool-item {
        height: 52px;
        line-height: 52px;
        position: relative;
        float: left;
        background: #fff;
    }

    .xw-chat-tool-btn {
        display: block;
    }

    .xw-chat-tool-btn {
        margin-top: 7px;
        height: 38px;
        width: 38px;
        border-radius: 100%;
        text-indent: -9999px;
        opacity: .5;
        overflow: hidden;
        transform: translateZ(0);
        margin-left: 10px;
    }

    .xw-chat-tool-btn.xw-face {
        background: url(../../assets/smileOn.svg) no-repeat 50%;
    }

    .xw-chat-tool-btn.xw-face-close {
        background: url(../../assets/smileClose.svg) no-repeat 50%;
    }

    .xw-chat-tool-item .xw-window-text {
        position: absolute;
        bottom: 100%;
        left: 50%;
        margin-bottom: -3px;
        -webkit-transform: translateX(-60%);
        transform: translateX(-60%);
        white-space: nowrap;
        box-shadow: 0 3px 18px 2px rgba(0, 0, 0, .1), 0 0 1px rgba(0, 0, 0, .05);
        font-size: 12px;
        background: #fff;
        line-height: 1em;
    }

    .xw-chat-tool-item .xw-window-text.xw-face-emoji-ul {
        right: -23px;
        left: auto;
        -webkit-transform: none;
        transform: none;
    }

    .xw-chat-ul-box {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .xw-chat-ul-box {
        position: relative;
        z-index: 1;
        background: #fff;
        padding: 8px;
        height: 130px;
        overflow: hidden;
        width: 340px;
        margin: 0px auto;
    }

    .xw-chat-tool-item .xw-window-text .xw-chat-ul-box {
        padding: 8px;
    }

    .xw-chat-ul-box a {
        display: block;
        height: 40px;
        width: 40px;
    }

    .xw-chat-tool-item {
        height: 52px;
        position: relative;
        float: left;
    }

    .xw-chat-tool-item .xw-window-text span {
        display: block;
        padding: 10px 12px;
        background: #fff;
        position: relative;
        z-index: 1;
        font-size: 17px;
        line-height: 16px;
    }

    .xw-chat-servicer:after, .xw-chat-customer:after, .xw-chat-wrap:after, .xw-chat-tool:after, .xw-chat-ul-box:after {
        clear: both;
    }

    .xw-chat-msg:last-child:before {
        bottom: -1px;
    }

    .xw-chat-msg:last-child:after, .xw-chat-msg:last-child:before {
        content: "";
        position: absolute;
        height: 0;
        width: 0;
        display: block;
    }

    .xw-chat-customer .xw-chat-msg:last-child:before {
        display: inline-block;
        height: 0;
        width: 0;
        border: 10px solid transparent;
        border-bottom: 10px solid #3A66E9;
        right: -10px;
        border-left-width: 9px;
    }

    .xw-chat-customer .xw-chat-msg-templateMessage-self:last-child:before {
        border: none;
    }

    .xw-chat-servicer .xw-chat-msg:last-child:before {
        display: inline-block;
        height: 0;
        width: 0;
        border: 10px solid transparent;
        border-bottom: 10px solid #efefef;
        left: -10px;
        border-left-width: 9px;
    }

    .xw-chat-servicer .xw-chat-msg-templateMessage-other:last-child:before {
        border: none;
    }

    .xw-chat-servicer .xw-chat-msg:last-child:after {
        display: inline-block;
        height: 0;
        width: 0;
        border: 10px solid transparent;
        border-bottom: 10px solid #fff;
        left: -8px;
        border-left-width: 9px;
        bottom: 0px;
    }

    .xw-chat-servicer .xw-chat-msg-templateMessage-other:last-child:after {
        border: none;
    }


</style>
