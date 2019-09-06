<template>
    <div class="houseInfo">
        <nav-bar :title="msg" v-if="!isWeixin" class="publicHeader"></nav-bar>
        <div class="publicContent">
            <div class="houseInfoContent">

                <h2>基础信息</h2>
                <p>房源户型：{{houseDetail.xiangq ? houseDetail.xiangq : '暂无'}}</p>
                <p>建筑面积：{{houseDetail.jzmj}}</p>
                <p>套内面积：{{houseDetail.taonei}}</p>
                <p>户型结构：{{houseDetail.hxjg}}</p>
                <p>梯户比例：{{houseDetail.tihu ? houseDetail.tihu : '暂无'}}</p>
                <p>供暖方式：{{houseDetail.nuanqi ? houseDetail.nuanqi : '暂无'}}</p>
                <p>产权年限：{{houseDetail.cqnian ? houseDetail.cqnian + '年' : '暂无'}}</p>

                <h2>交易属性</h2>
                <p>上次交易：{{houseDetail.jysj}}</p>
                <p>房屋年限：{{houseDetail.fwnian ? houseDetail.fwnian + '年' : '暂无'}}</p>
                <p>房屋用途：{{houseDetail.yongtu ? houseDetail.yongtu : '暂无'}}</p>
                <p>交易权属：{{houseDetail.jylx ? houseDetail.jylx : '暂无'}}</p>
                <p>产权所属：{{houseDetail.suoshu ? houseDetail.suoshu : '暂无'}}</p>
                <p>抵押信息：{{houseDetail.diya ? houseDetail.diya : '暂无'}}</p>
                <p>房本备件：{{houseDetail.fangben ? '已上传房本照片' : '暂无'}}</p>
                <p>土地年限：详见业主土地证明材料或相关政府部门登记文件</p>

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
                msg:"房源信息"
            }
        },
        computed:mapState({
            houseDetail:function(state){//箭头函数会有this的问题
                let localData = JSON.parse(util.getStore('houseDetail'));
                if(!state.houseDetail.txtpt && localData){
                    this.$store.commit('RECORD_HOUSEDETAIL',localData);//同步操作
                }
                return state.houseDetail;
            }
        }),
        components:{
            navBar,
            footerContact
        }
    }
</script>

<style scoped lang="less">
    .houseInfo{
        padding-bottom: 80px;
        .houseInfoContent{
            width: 90%;
            margin: 0 auto;
            padding-top: 10px;
            h2{
                font-size: 16px;
                padding-bottom: 20px;
                border-bottom: 1px solid #E5E5E5;
                color: #222222;
                margin-top:20px;
            }
            p{
                color: #666666;
                margin-top: 15px;
                font-size: 16px;
            }
            &>p:nth-child(2){
                margin-top: 20px;
            }
        }
    }
</style>
