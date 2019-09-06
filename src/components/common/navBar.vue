<template>
    <div class="navBar">
        <van-nav-bar class="iNavBar" :title="title" left-text="返回" left-arrow @click-left="onClickLeft" />
    </div>
</template>

<script>

    import {mapMutations} from 'vuex';
    //import util from "../../config/util";

    export default {
        props:["title"],
        methods:{
            ...mapMutations(['SOCKET_setTokey']),
            onClickLeft(){ 
                /*/ 注意这个click只是在pc中才有...，微信里不能以这为依据
                var path = this.$route.path; 
                if(path=='/pages/imChat/index'){ // 从聊天页退出
                    this.SOCKET_setTokey(''); // 清除会话标记
                    this.$socket.emit('setNowConversation', ''); // 通知服务端
                    //alert('2'); console.log(path);
                }//*/
                this.$router.go(-1);
            }
        }
    }
</script>

<style scoped lang="less">
    .navBar{
        width: 100%;
        height: 46px;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
        .iNavBar{
            min-width: 320px;
            max-width: 640px;
            margin: 0 auto;
        }
    }
</style>
