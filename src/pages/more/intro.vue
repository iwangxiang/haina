<template>
    <div class="houseIntroduce">
        <nav-bar :title="msg" v-if="!isWeixin" class="publicHeader"></nav-bar>
        <div class="publicContent">
            <div class="houseIntroduceContent">
                <h2>周边配置</h2>
                <p v-html="houseDetail.txtpt ? houseDetail.txtpt : '暂无'"></p>
                <h2>小区介绍</h2>
                <p v-html="houseDetail.txtxq ? houseDetail.txtxq : '暂无'"></p>
                <h2>交通出行</h2>
                <p v-html="houseDetail.txtjt ? houseDetail.txtjt : '暂无'"></p>
            </div>
            <footerContact></footerContact>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import util from '../../config/util';
    import footerContact from "../../components/common/footerContact.vue";
    import navBar from "../../components/common/navBar.vue";

    export default {
        data(){
            return{
                msg:"房源介绍"
            }
        },
        computed:
            /*...mapState([
                'houseDetail'
            ]),*/
            mapState({
                houseDetail:function(state){//箭头函数会有this的问题
                    let localData = JSON.parse(util.getStore('houseDetail'));
                    if(!state.houseDetail.txtpt && localData){
                        this.$store.commit('RECORD_HOUSEDETAIL',localData);//同步操作
                    }
                    return state.houseDetail;
                }
            }),
        components:{
            footerContact,
            navBar
        }
    }
</script>

<style scoped lang="less">
    .houseIntroduce{
        padding: 20px 0 80px 0;
        .houseIntroduceContent{
            width: 90%;
            margin: 0 auto;
            h2{
                font-size: 16px;
                padding-bottom: 20px;
                margin-top: 20px;
                border-bottom: 1px solid #E5E5E5;
                color: #222222;
            }
            p{
                color: #666666;
                margin-top: 10px;
                line-height: 200%;
                font-size: 16px;
            }
        }
    }
</style>
