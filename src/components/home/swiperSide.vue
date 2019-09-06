<template>
    <div class="swiperSide">
        <swiper :options="swiperOption" v-if="nearXiaoqu.length>1">
            <swiper-slide class="iSwiper" v-for="(slide, index) in nearXiaoqu" :key="index" @click="goDetail(slide.property_id)">
                <img :src="slide.thumb" @click="goDetail(slide.id)">
                <p>{{slide.title}}</p>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
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
        props:["nearXiaoqu"],
        methods:{
            goDetail(property_id){
                this.$router.push({path:'/pages/home/index', query: {property_id: property_id}});
                window.location.reload();
            }
        }
    }
</script>

<style scoped lang="less">
    .swiperSide{
        .iSwiper{
            position: relative;
        }
        img{
            width: 100%;
            vertical-align: top;
            border-radius: 5px;
        }
        p{
            position: absolute;
            top: 10px;
            left: 10px;
            width: 79px;
            height: 29px;
            background-color: #ffffff;
            border-radius: 20px;
            font-size: 12px;
            line-height: 29px;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #666666;
        }
    }
</style>
