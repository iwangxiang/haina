<template>
    <div class="houseDetails">
        <nav-bar :title="msg" v-if="!isWeixin" class="publicHeader"></nav-bar>
        <div class="publicContent">
            <div class="houseDetailsImg">
                <div class="iconLinkBg"></div>
                <div class="iconLink" @click.stop="toIconLike(info.id)">
                    <van-icon :name="isCollect ? 'like' : 'like-o'" />
                </div>
                <van-swipe v-if="images.length" :autoplay="3000" :height="slideH" indicator-color="white" @change="onChange">
                    <van-swipe-item v-for="item in images" :key="item.id" @click="goHousePicture(info.id,item.key)" class="img-wrap">
                        <img :src="item.thumb" onLoad="this.width>this.height?(this.style.width='100%',this.style.top='50%',this.style.marginTop=-this.height/2+'px'):(this.style.height='100%',this.style.left='50%',this.style.marginLeft=-this.width/2+'px')">
                    </van-swipe-item>
                    <div class="custom-indicator" slot="indicator">
                        {{ current + 1 }} / {{images.length}}
                    </div>
                </van-swipe>
            </div>
            <div class="detailsContent">
                <h2>{{info.title}}</h2>
                <div class="detailsInfo">
                    <div>
                        <p>{{info.price}}</p>
                        <h3>房租</h3>
                    </div>
                    <div>
                        <p>{{info.xiangq ? info.xiangq : '暂无'}}</p>
                        <h3>户型</h3>
                    </div>
                    <div>
                        <p>{{info.jzmj}}</p>
                        <h3>建筑面积</h3>
                    </div>
                </div>
                <div class="detailsLabel" v-if="tags.length">
                    <span v-for="(item,index) in tags" :key="index">{{item}}</span>
                    <!--<span>近地铁</span>
                    <span>随时可看</span>-->
                </div>
                <div class="detailsList">
                    <div>
                        <p><span>发布: </span>{{info.publish_time}}</p>
                        <p><span>入住：</span>{{info.ruzhu ? info.ruzhu : '待定'}}</p>
                    </div>
                    <div>
                        <p><span>看房：</span>{{info.kanfang ? info.ruzhu : '待定'}}</p>
                        <p><span>楼层：</span>{{info.louceng ? info.louceng : '暂无'}}</p>
                    </div>
                    <div>
                        <p><span>电梯：</span>{{info.dianti ? info.dianti : '暂无'}}</p>
                        <p><span>车位：</span>{{info.chewei ? info.chewei : '暂无'}}</p>
                    </div>
                    <div>
                        <p><span>用水：</span>{{info.yongshui ? info.yongshui : '暂无'}}</p>
                        <p><span>用电：</span>{{info.yongdian ? info.yongdian : '暂无'}}</p>
                    </div>
                    <div>
                        <p><span>燃气：</span>{{info.meiqi ? info.meiqi : '暂无'}}</p>
                        <p><span>采暖：</span>{{info.luanqi ? info.luanqi : '暂无'}}</p>
                    </div>
                    <div>
                        <p><span>年付：</span>{{info.price ? info.price : '暂无'}}</p>
                        <p><span>押金：</span>{{info.deposit ? info.deposit : '暂无'}}</p>
                    </div>
                </div>
            </div>
            <div class="pay">
                <h2>付款方式</h2>
                <p><span>年付：</span><i>4000元/月</i><em>押金8000元</em></p>
            </div>
            <position :city="city" :area="area" :addr="addr" :xqTitle="xqTitle" :lng="lng" :lat="lat"></position>
            <div class="houseIntroduce" @click="goHouseIntroduce">
                <h2><i>房源介绍</i><span><van-icon name="arrow" /></span></h2>
                <p v-html="info.txtfy ? info.txtfy : '暂无'"></p>
            </div>
            <div class="iRecommend">
                <recommend :saleRecommend="saleRecommend" :rentRecommend="rentRecommend" :saleCount="saleCount" :rentCount="rentCount"></recommend>
            </div>
            <footerContact :fyType="'rent'" :fyId="this.id" :fyInfo="info"></footerContact>
        </div>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex';
    import util from '../../config/util';
    import position from "../../components/common/position.vue";
    import recommend from "../../components/home/recommend.vue";
    import footerContact from "../../components/common/footerContact.vue";
    import {rentDetail,collect} from "../../config/api";
    import Vue from 'vue';
    import { Lazyload } from 'vant';
    Vue.use(Lazyload);
    import navBar from "../../components/common/navBar.vue";
    import wxApi from '../../config/wxApi';

    export default {
        data(){
            return{
                msg:"出租房详情",
                active: 0,
                id:'',
                info:{},//房源详情
                city:'',//城市
                area:'',//区域
                addr:'',//地址
                xqTitle:'',//小区名
                lng:'',
                lat:'',
                tags:[],//标签
                slideH:window.innerWidth/1.5,
                images:[],//相册轮播图
                saleRecommend:[], //小区出售房源推荐
                saleCount:0, //小区在售房源数
                rentRecommend:[], //小区出租房源推荐
                rentCount:0, //小区在租房源数
                isCollect:0,
                current:0
            }
        },
        created(){
            this.id = this.$route.query.id;
        },
        mounted(){
            this.initData();
        },
        components:{
            navBar,
            position,
            recommend,
            footerContact
        },
        methods:{
            onChange(index){
                this.current=index;
            },
            ...mapMutations(['RECORD_HOUSEDETAIL','RECORD_CONTACT']),
            async initData(){
                let hash = util.getStore('uhash') || '';
                await rentDetail(this.id,hash).then(res =>{
                    if(res.code == 0){
                        wxApi.wxShare(res.data.info.title,res.data.info.txtfy,window.location.href,res.data.info.thumb);
                        this.info = res.data.info;
                        this.city = res.data.info.city;
                        this.area = res.data.info.area;
                        this.addr = res.data.info.addr;
                        this.xqTitle = res.data.info.xqTitle;
                        let map = res.data.info.map;
                        if(map){
                            this.lng = map.split(',')[0];
                            this.lat = map.split(',')[1];
                        }                    
                        this.tags = res.data.info.tags;
                        this.images = res.data.photo;
                        this.saleRecommend = res.data.saleRecommend;
                        this.saleCount = res.data.sale_count;
                        this.rentRecommend = res.data.rentRecommend;
                        this.rentCount = res.data.rent_count;
                        if(res.data.info.isCollect) this.isCollect = 1;
                        this.RECORD_HOUSEDETAIL(this.info);
                        this.RECORD_CONTACT(res.data.admin);
                    }else{
                        this.$toast(res.msg);
                    }                    
                })
            },
            /*goHouseInfo(){
                this.$router.push({path:"/pages/more/info"});
            },*/
            goHouseIntroduce(){
                this.$router.push({path:"/pages/more/intro"});
            },
            goHousePicture(rent_id,key){
                this.$router.push({path:"/pages/more/pics", query: {pid: rent_id,key: key,type: 'rent'}});
            },
            async toIconLike(id){
                let hash = util.getStore('uhash'),
                    user = JSON.parse(util.getStore('userInfo'))
                util.goXiaoqu(user, this.info.property_id)               
                await collect(id,2,hash).then(res =>{                        
                    if(res.code == 0){
                        this.isCollect = res.data;
                        this.isCollect ? this.$toast('收藏成功') : this.$toast("取消收藏");
                    }else this.$toast("收藏出错");
                })
            }  
        }
    }
</script>

<style scoped lang="less">
    .houseDetails{
        .pay{
            width: 90%;
            margin: 20px auto 0;
            h2{
                font-size: 19px;
                margin-bottom: 10px;
                color: #222222;
            }
            p{
                font-size: 15px;
                color: #999999;
                i{
                    color: #222222;
                    font-style: normal;
                    margin-right: 20px;
                }
                em{
                    color: #222222;
                    font-style: normal;
                }
            }
        }
        .houseDetailsImg{
            position: relative;
            .img-wrap{
                overflow: hidden;
                position: relative;
                img{
                    position: absolute;
                }
            }
            .custom-indicator{
                position: absolute;
                bottom: 10px;
                right: 10px;
                color: #fff;
                background-color:rgba(000,000,000,0.5);
                padding: 5px;
                border-radius: 50%;
            }
            .iconLinkBg{
                background-color: #000;
                opacity:0.5;
                width: 38px;
                height: 38px;
                position: absolute;
                right: 10px;
                top: 10px;
                border-radius: 50%;
                text-align: center;
                line-height: 55px;
                z-index: 11;
            }
            .iconLink{
                font-size: 20px;
                color: #ffffff;
                position: absolute;
                right: 19px;
                top: 18px;
                z-index: 12;
            }
        }
        .detailsContent{
            width: 90%;
            margin: 20px auto 0;
            h2{
                font-size: 19px;
                font-weight: normal;
            }
            .detailsInfo{
                display: flex;
                justify-content : space-between;
                div{
                    text-align: center;
                    margin-top: 20px;
                    h3{
                        color: #999999;
                        font-weight: normal;
                        font-size: 12px;
                        margin-top: 5px;
                    }
                    p{
                        color: #e8373d;
                        font-size:17px;
                        font-weight: bold;
                    }
                }
                >div:nth-child(2){
                    border-left: 1px solid #E9E9E9;
                    border-right: 1px solid #E9E9E9;
                    padding: 0 30px;
                }
            }
            .detailsLabel{
                margin-top: 20px;
                span{
                    padding: 1px 3px;
                    background-color: #C2E2FF;
                    color: #5FACFB;
                    float: left;
                    border-radius: 2px;
                    margin-right: 10px;
                    font-size: 11px;
                }
                >span:nth-child(1){
                    background-color: #FFCDD2;
                    color: #FB7971;
                }
            }
            .detailsLabel:after{
                clear:both;
                content:'.';
                display:block;
                width: 0;
                height: 0;
                visibility:hidden;
            }
        }
        .detailsList{
            margin-top: 20px;
            div{
                display: flex;
                justify-content:space-between;
                margin-bottom: 10px;
                p{
                    width: 50%;
                    text-overflow:ellipsis;
                    white-space:nowrap;
                    overflow:hidden;
                    font-size:15px;
                    color: #222222;
                    span{
                        color: #999999;
                    }
                }
            }
            >div:last-child{
                p{
                    width: 100%;
                }
            }
        }
        .houseIntroduce{
            width: 90%;
            margin: 20px auto 0;
            h2{
                font-size: 19px;
                margin-bottom: 10px;
                display: flex;
                justify-content: space-between;
                color: #222222;
                i{
                    font-style: normal;
                }
                span{
                    position: relative;
                    top: 3px;
                    color: #999999;
                    font-size: 16px;
                }
            }
            p{
                margin-bottom: 10px;
                line-height: 150%;
                font-size: 15px;
                color: #666666;
            }
        }
        .iRecommend{
            margin-bottom: 80px;
        }
    }
</style>
