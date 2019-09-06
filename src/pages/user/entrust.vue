<template>
    <div class="entrust">
        <div>
            <h2>一键成交热线</h2>
            <p>{{contact.tel ? contact.tel : '暂无'}}</p>
            <h3><a @click="openCall">立即拨打</a></h3>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import util from '../../config/util';
    
    export default {
        computed:mapState({
            contact:function(state){//箭头函数会有this的问题
                let localData = JSON.parse(util.getStore('contact')) || {};
                if(!state.contact.real_name && localData){
                    this.$store.commit('RECORD_CONTACT',localData);//同步操作
                }
                return state.contact;
            }
        }),
        methods:{
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
            }
        }
    }
</script>


<style scoped lang="less">
    .entrust{
        width: 100vw;
        height: 100vh;
        background:url(../../assets/entrust.jpg);
        background-size: cover;
        position: relative;

        display: flex;
        justify-content:center;
        align-items:flex-end;
        >div:nth-child(1){
            position: absolute;
            bottom: 40px;
            color: #ffffff;
            width: 190px;
            text-align: center;
            h2{
                font-size: 25px;
                font-weight: normal;
                margin-bottom: 10px;
            }
            p{
                font-size: 25px;
            }
            h3{
                height: 40px;
                line-height: 40px;
                background-color:#ffffff;
                border-radius: 50px;
                margin-top: 20px;
                a{
                    color: #2C5BE7;
                    font-size: 21px;
                    font-weight: normal;
                }
            }
        }
    }
</style>
