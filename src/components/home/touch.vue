<template>
    <div class="touch" ref="iTouch">
        <h2>
            <span v-show="chats.msgCnts && outInfo">{{chats.msgCnts}}</span>
            <img src="../../assets/iconUser.png" v-show="btn" @click="listShow">
        </h2>
        <transition name="bounce">
            <div v-show="list">
                <h2><img src="../../assets/iconSearch.png" @click="goSearch"></h2>
                <h2><img src="../../assets/iconCollection.png" @click="goCollection"></h2>
                <h2>
                    <span v-show="chats.msgCnts">{{chats.msgCnts}}</span>
                    <img src="../../assets/iconImchat.png" @click="goMessage">
                </h2>
                <h2><img src="../../assets/iconShutdown.png" @click="listHidden"></h2>
            </div>
        </transition>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import transform from "../../config/transform.js";
    import util from '../../config/util';

    export default {
        data(){
            return{
                user:{}, // 用户信息
                //msgCnts:0, // 消息数量
                btn:true,
                list:false,
                outInfo:true
            }
        },
        props:['cityId','xiaoquId'],
        mounted(){
            this.$nextTick(()=>{
                this.user = JSON.parse(util.getStore('userInfo'));
                if(this.user && this.user.id){
                    this.$socket.emit('pullUnreads', this.user);
                }
                let nowStart=this.$refs.iTouch;
                let startPoint=0;
                let startX=0;
                let startY=0;
                nowStart.addEventListener("touchstart",function(e){
                    document.documentElement.style.overflow='hidden';
                    startPoint=e.changedTouches[0];
                    startX=transform(nowStart,"translateX");
                    startY=transform(nowStart,"translateY");
                });
                nowStart.addEventListener("touchmove",function(e){
                    document.documentElement.style.overflow='hidden';
                    let nowPoint=e.changedTouches[0];
                    let disX=nowPoint.pageX-startPoint.pageX;
                    let disY=nowPoint.pageY-startPoint.pageY;
                    transform(nowStart,"translateX",startX+disX);
                    transform(nowStart,"translateY",startY+disY);
                    e.preventDefault();
                });
                nowStart.addEventListener("touchend",function(){
                    document.documentElement.style.overflow='auto';
                });
            })
        },
        computed: {
            ...mapState(['chats'])
        },
        methods:{
            //...mapMutations(['SOCKET_setTolist','SOCKET_setMsgCnts']),
            listShow(){
                this.btn=false;
                this.list=true;
                this.outInfo=false;
            },
            listHidden(){
                this.btn=true;
                this.list=false;
                this.outInfo=true;
            },
            goCollection(){
                this.$router.push({path:"/pages/user/favor",query: {xiaoquId: this.xiaoquId}});
            },
            goMessage(){
                this.$router.push({
                    path:"/pages/imChat/lists"
                })
            },
            goSearch(){
                this.$router.push({path:"/pages/home/search",query: {cityId: this.cityId}});
            }
        }
    }
</script>

<style scoped lang="less">
    .touch{
        position: fixed;
        right: 5%;
        top: 50%;
        margin-top: -24px;
        z-index: 1000;
        h2{
            width: 48px;
            height: 48px;
            margin-bottom: 10px;
            position: relative;
            span{
                width: 20px;
                height: 20px;
                display: block;
                background: url(../../assets/round.png) no-repeat;
                background-size: 100%;
                position: absolute;
                right: -5px;
                top: -5px;
                font-size: 12px;
                color: #ffffff;
                text-align: center;
                line-height: 20px;
                font-weight: normal;
            }
            img{
                width: 100%;
                vertical-align: top;
            }
        }
    }
    .bounce-enter-active,.bounce-leave-active{
        transition: all 1s;
        transform: translateY(0);
    }
    .bounce-enter,.bounce-leave-active{
        opacity: 0;
        transform: translateY(-100%);
    }
</style>
