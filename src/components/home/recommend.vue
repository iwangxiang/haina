<template>
    <div class="recommend">
        <div>
            <h2>小区房源推荐</h2>
            <p>
                <span @click="change" :class="{active:isActive}">二手房</span>
                <i @click="change" :class="{active:!isActive}">租房</i>
            </p>
        </div>
        <div>
            <swiper-old v-if="show" :saleRecommend="saleRecommend" :saleCount="saleCount" :xiaoquId="xiaoquId"></swiper-old>
            <swiper-rent v-else :rentRecommend="rentRecommend" :rentCount="rentCount" :xiaoquId="xiaoquId"></swiper-rent>
        </div>
    </div>
</template>

<script>
    import swiperOld from "../common/swiperOld.vue";
    import swiperRent from "../common/swiperRent.vue";

    export default {
        data(){
            return {
                show:true,
                isActive:true,                
            }
        },
        props:['saleRecommend','rentRecommend','saleCount','rentCount','xiaoquId'],
        components:{
            swiperOld,
            swiperRent
        },
        methods:{
            change(){
                this.show=!this.show;
                this.isActive=!this.isActive;
            }
        }
    }
</script>

<style scoped lang="less">
    .recommend{
        margin-top: 20px;
        >div:nth-child(1){
            width: 90%;
            margin: 0 auto;
            h2{
                font-size: 19px;
                color: #222222;
                float: left;
            }
            p{
                float: right;
                font-size: 16px;
                span{
                    margin-right: 10px;
                }
                i{
                    font-style: normal;
                    color: #999999;
                }
                .active{
                    color: #3a66e9;
                }
            }
        }
        >div:nth-child(1):after{
            clear:both;
            content:'.';
            display:block;
            width: 0;
            height: 0;
            visibility:hidden;
        }
        >div:nth-child(2){
            margin-top: 20px;
        }
    }
</style>
