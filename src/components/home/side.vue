<template>
    <div class="side">
        <h2>周边小区</h2>
        <div>
            <swiper-side :nearXiaoqu="nearXiaoqu"></swiper-side>
        </div>
    </div>
</template>

<script>
    import swiperSide from "../home/swiperSide.vue";

    export default {
        props:['nearXiaoqu'],
        components:{
            swiperSide
        }
    }
</script>

<style scoped lang="less">
    .side{
        margin-top: 20px;
        h2{
            width: 90%;
            color: #222222;
            font-size: 19px;
            margin: 0 auto;
        }
        & div{
            margin-top: 20px;
        }
    }
</style>