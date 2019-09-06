<template>
    <div class="swiper">
        <swiper :options="swiperOption" v-if="saleRecommend.length>=1">
            <swiper-slide v-for="(slide, index) in saleRecommend" :key="index" class="swiperCont">
                <img :src="slide.thumb" @click="goHouseDetails(slide.id)">
                <div class="swiperDiv">
                    <h3>{{slide.xiangq}}</h3>
                    <p>
                        <span>{{slide.unit_price}}</span>
                        <i>{{slide.price}}</i>
                    </p>
                </div>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <div class="swiperInfo">
            <van-button type="info" size="large" @click="goSale">同小区在售{{saleCount}}套</van-button>
        </div>
    </div>
</template>

<script>
    export default {        
        data() {
            return {
                swiperOption: {
                    loop:true,
                    slidesPerView: 2,
                    loopedSlides: 6,
                    spaceBetween: 10,
                    centeredSlides: true
                }
            }
        },
        props:["saleRecommend",'saleCount','xiaoquId'],
        methods:{
            goHouseDetails(id){
                this.$router.push({path:'/pages/sale/detail', query: {id: id}});
            },
            goSale(){
                this.$router.push({path:"/pages/sale/lists",query: {xiaoqu_id: this.xiaoquId}});
            }
        }
    }
</script>

<style scoped lang="less">
    .swiper{
        position: relative;
        img{
            width: 100%;
            vertical-align: top;
            border-radius: 5px;
        }
        .swiperDiv{
            width: 90%;
            margin:0 auto;
            h3{
                color: #222222;
                font-weight: normal;
                margin: 5px 0;
                font-size:14px;
            }
            p{
                font-size:14px;
                span{
                    color: #999999;
                }
                i{
                    font-style: normal;
                    color: #e83836;
                    float: right;
                    font-size: 17px;
                }
            }
        }
        .swiper-pagination{
            position: absolute;
            bottom: 60px;
            left: 0;
        }
        .swiperInfo{
            width: 85%;
            margin: 20px auto 0;
        }
        .swiperInfo button{
            background-color: #f6f7fc;
            border: none;
        }
        .swiperInfo span{
            font-size: 16px;
            color: #3a66e9;
        }
    }
</style>
