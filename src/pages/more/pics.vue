<template>
    <div class="housePicture">
        <nav-bar :title="msg" v-if="!isWeixin" class="publicHeader"></nav-bar>
        <div class="publicContent">
            <div class="housePictureContent">
                <div class="housePictureContentTtile">
                    <h2 v-for="(item,index) in types" :key="index" @click="change(index,item.begin)" :class="type_id == index ? 'selected' : ''">{{item.title}} ({{item.count}})</h2>
                </div>
                <swiper :options="swiperOption" ref="mySwiper">
                    <template v-for="imgs in typeImgs">
                        <swiper-slide v-for="img in imgs" :key="img.id">
                            <div class="swiper-zoom-container">
                                <img :src="img.thumb" :alt="img.title">
                            </div>
                        </swiper-slide>
                    </template>
                </swiper>
            </div>
            <footerContact></footerContact>
        </div>
    </div>
</template>

<script>
    import footerContact from "../../components/common/footerContact.vue";
    import {housePics} from "../../config/api";
    import navBar from "../../components/common/navBar.vue";

    export default {
        data(){
            const that = this;
            return{
                msg:"房源相册",
                pid:'',//房源id
                key:0,//图片key
                type:'',//二手房或者租房
                types:{},//相册分类
                type_id:'',//相册分类id
                typeImgs:{}, //相册
                swiperOption: {
                    width: window.innerWidth,
                    zoom : true,
                    loop:true,
                    initialSlide: 0,
                    on: {
                        slideChangeTransitionEnd: function(){
                            for(let i in that.types){
                                //根据图片切换的索引值获取图片分类的id
                                if(this.activeIndex >= that.types[i].begin && this.activeIndex < that.types[i].end){
                                    that.type_id = i;
                                    break;
                                }
                            }
                        },
                    },
                }
            }
        },
        created(){
            this.pid = this.$route.query.pid;
            this.key = this.$route.query.key;
            this.type = this.$route.query.type;
        },
        computed: {
            swiper() {
                return this.$refs.mySwiper.swiper;
            }
        },
        mounted() {
            this.initData();
                        
        },
        components:{
            navBar,
            footerContact
        },
        methods:{
            change(type_id,index){
                this.type_id = type_id;
                this.swiper.slideTo(index, 200, false);
            },
            async initData(){
                await housePics(this.pid,this.type).then(res =>{
                    if(res.code == 0){
                        this.typeImgs = res.data.typeImgs;
                        let n = 0;
                        for(let i in res.data.typeImgs){
                            n += res.data.typeImgs[i].length;
                            this.types[i] = {id:i,title:res.data.types[i],count:res.data.typeImgs[i].length,begin:n-res.data.typeImgs[i].length,end:n};
                        }
                    }                                  
                })
                let m = 0,slideIndex = 0;
                for(let i in this.typeImgs){
                    for(let j in this.typeImgs[i]){
                        if(this.key == this.typeImgs[i][j].key){ //根据传值过来的key来获取相册分类id及该图片的索引
                            this.type_id = i;
                            slideIndex = m;
                        }
                        m++;
                    }
                }
                this.swiper.slideTo(slideIndex, 200, false);
            }
        }
    }
</script>

<style scoped lang="less">
    .housePicture{
        .housePictureContent{
            .housePictureContentTtile{
                width: 90%;
                margin: 0 auto;
                display: flex;
                justify-content: flex-start;
                h2{
                    font-size: 14px;
                    font-weight: normal;
                    padding: 10px 0;
                    text-align: center;
                    margin-right: 15px;
                    color: #999999;
                }
            }
            .swiper-zoom-container{
                width: 100%;
                height: 500px;
            }
            .selected{
                color: #3D68E9;
                border-bottom: 2px solid #3D68E9;
            }
            img{
                width: 100%;
                vertical-align: top;
            }
        }
    }
</style>
