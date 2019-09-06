<template>
    <div class="home">
        <nav-bar :title="msg" v-if="!isWeixin" class="publicHeader"></nav-bar>
        <div class="publicContent">
            <div class="iImg">
                <img :src="info.thumb">
            </div>
            <div class="info">
                <h2>{{info.title}}</h2>
                <p style="display:none" class="pFirst">区域：{{info.city}}-{{info.area}}</p>
                <div class="infoResult">
                    <div @click="goFy2('sale', info.id)">
                        <h3>{{saleCount}}<span>套</span></h3>
                        <p>在售房源<span><van-icon name="arrow" /></span></p>
                    </div>
                    <div @click="goFy2('rent', info.id)">
                        <h3>{{rentCount}}<span>套</span></h3>
                        <p>在租房源<span><van-icon name="arrow" /></span></p>
                    </div>
                </div>
            </div>
            <div class="desc">
                <h2>小区概况</h2>
                <div class="descContent">
                    <p>建成年代：<span>{{info.jznian ? info.jznian : '暂无'}}</span></p>
                    <p>产权年限：<span>{{info.cqnian ? info.cqnian : '暂无'}}</span></p>
                    <p>建筑类型：<span>{{info.jzlx ? info.jzlx : '暂无'}}</span></p>
                    <p>开发企业：<span>{{info.dev ? info.dev : '暂无'}}</span></p>
                    <div :class="{descDisplay:isActive}">
                        <p>交易权属：<span>{{info.jylx ? info.jylx : '暂无'}}</span></p>
                        <p>用水类型：<span>{{info.yongshui ? info.yongshui : '暂无'}}</span></p>
                        <p>用电类型：<span>{{info.yongdian ? info.yongdian : '暂无'}}</span></p>
                        <p>固定车位数：<span>{{info.parking_num ? info.parking_num : '暂无'}}</span></p>
                        <p>停车费用：<span>{{info.parking_price ? info.parking_price + '元/月' : '暂无'}}</span></p>
                        <p>燃气费用：<span v-if="info.gas_price">{{info.gas_price}}元/月/m<SUP>3</SUP></span><span v-else>待定</span></p>
                        <p>容积率：<span>{{info.rjl ? info.rjl + '%' : '暂无'}}</span></p>
                        <p>绿化率：<span>{{info.lhl ? info.lhl + '%' : '暂无'}}</span></p>
                        <p>物业公司：<span>{{info.wycorp ? info.wycorp : '暂无'}}</span></p>
                        <p>物业费用：<span>{{info.wyfee ? info.wyfee + '元/㎡·月' : '暂无'}}</span></p>
                        <p>物业电话：<span>{{info.wytel ? info.wytel : '暂无'}}</span></p>
                    </div>
                </div>
            </div>
            <div class="descShow" @click="show">
                {{isActive?iShow:iHidden}}
                <van-icon v-if="isActive" name="arrow-down" />
                <van-icon v-else name="arrow-up" />
            </div>
            <position v-if="lng && lat" :city="city" :area="area" :addr="addr" :xqTitle="title" :lng="lng" :lat="lat"></position>
            <recommend :saleRecommend="saleRecommend" :rentRecommend="rentRecommend" :saleCount="saleCount" :rentCount="rentCount" :xiaoquId="info.id"></recommend>
            <div class="more">
                <h2>更多选择</h2>
                <div class="moreCont">
                    <!--div @click="goMore('sale/citys?city='+info.city_id)">
                        <p class="iconfont icon-3"></p>
                        <span>二手房</span>
                    </div>
                    <div @click="goMore('rent/citys?city='+info.city_id)">
                        <p class="iconfont icon-4"></p>
                        <span>租房</span>
                    </div-->
                    <div @click="goMore('user/entrust')">
                        <p class="iconfont icon-9"></p>
                        <span>我要委托</span>
                    </div>
                    <div @click="goMore('calcu/index')">
                        <p class="iconfont icon-7"></p>
                        <span>计算器</span>
                    </div> 
                    <div @click="goMore(0)">
                        <p class="iconfont icon-3"></p>
                        <span>房掌柜</span>
                    </div>
                </div>
            </div>
            <!--side v-if="nearXiaoqu.length" :nearXiaoqu="nearXiaoqu"></side-->
            <touch :cityId="info.city_id"  :xiaoquId="info.id"></touch>
        </div>
    </div>
</template>

<script>
    import {mapMutations} from 'vuex';
    import position from "../../components/common/position.vue";
    import recommend from "../../components/home/recommend.vue";
    //import side from "../../components/home/side.vue";
    import touch from "../../components/home/touch.vue";
    import {home} from "../../config/api";
    import navBar from "../../components/common/navBar.vue";
    import util from '../../config/util';

    export default {
        data(){
            return{
                isActive:true,
                iShow:"展开",
                iHidden:"收起",
                id:'',//小区id
                info:{},//小区详情信息
                //pid:'',//海纳物业id
                city:'',
                area:'',
                addr:'',
                title:'',
                lng:'',
                lat:'',
                saleCount:0,//在售房源套数
                rentCount:0,//在租房源套数，
                saleRecommend:[],//同小区在售房源推荐
                rentRecommend:[],//同小区在租房源推荐
                nearXiaoqu:[],//周边小区
                msg:"首页",
                defaultBanner:require("../../assets/defaultBanner.jpg")
            }
        },
        created() {
            this.id = this.$route.query.id || '';         
        },
        mounted(){
            this.resetUser();
            this.getData();
        },
        components:{
            recommend,
            position,
            //side,
            touch,
            navBar
        },
        methods:{
            ...mapMutations(['RECORD_CONTACT','RECORD_USERINFO']),
            show(){
                this.isActive=!this.isActive;
            },
            goFy2(type, id){
                this.$router.push({path:"/pages/"+type+"/lists", query:{xiaoqu_id:id}});
            },
            getCookie: function (key) {
                if(document.cookie.length > 0) {
                    var arr = document.cookie.split('; ');
                    var value = '';  // 用于存储所需cookie值
                    for (var i = 0; i < arr.length; i++) {
                      var arr2 = arr[i].split('=');  // 再次切割
                      if (arr2[0] == key){
                        value = arr2[1];  
                        return value;
                      }
                    }
                }
                return null
            },
            resetUser() {
                let userInfo = JSON.parse(util.getStore('userInfo'));
                if(!userInfo || !userInfo.id){
                    let uinfo = this.getCookie('hnzs_userInfo');
                    uinfo && util.setStore(uinfo);
                    //alert('存:cookie:' + uinfo);
                }else{
                    //alert('有:store:' + userInfo.id);
                } // 开始测试getStore无内容,所以再cookie找一下; 后面测试又正常了; 不知道是不是缓存?
            },
            //初始化获取数据
            async getData() {
                await home(this.id).then(res => {
                    if(res.code == 0){
                        this.info = res.data.xiaoqu;
                        if(!this.info.thumb) this.info.thumb = this.defaultBanner;
                        this.city = res.data.xiaoqu.city;
                        this.area = res.data.xiaoqu.area;
                        this.addr = res.data.xiaoqu.addr;
                        this.title = res.data.xiaoqu.title;
                        let map = res.data.xiaoqu.map;
                        if(map){
                            this.lng = map.split(',')[0];
                            this.lat = map.split(',')[1];
                        }
                        this.saleCount = res.data.sale_count;
                        this.rentCount = res.data.rent_count;
                        this.saleRecommend = res.data.saleRecommend;
                        this.rentRecommend = res.data.rentRecommend;
                        this.nearXiaoqu = res.data.nearXiaoqu;
                        this.RECORD_CONTACT(res.data.admin);
                    }else{
                        this.$toast(res.msg);
                    }                    
                })                
            },
            goMore(path){
                if(!path){
                    window.open('http://m.fzg360.com/')
                    return;
                }
                this.$router.push({
                    path:"/pages/" + path
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .home{
        padding-bottom: 25px;
        .iImg{
            img{
                width: 100%;
                vertical-align: top;
            }
        }
        .info{
            width: 90%;
            height: 135px;
            border-radius: 10px;
            box-shadow: 0px 3px 10px #999;
            margin: -40px auto 0;
            position: relative;
            z-index: 2;
            background-color: #fff;
            text-align: center;
            h2{
                color: #222222;
                font-weight: normal;
                padding-top:15px;
                font-size: 17px;
            }
            p.pFirst{
                color: #999999;
                font-size: 14px;
                margin-top: 5px;
            }
            .infoResult{
                width: 80%;
                margin: 15px auto 0;
                div{
                    h3 {
                        color: #f44336;
                        font-weight: normal;
                        font-size: 20px;
                        span {
                            font-size: 14px;
                            color: #222222;
                            margin-left: 2px;
                        }
                    }
                    p{
                        color: #999999;
                        margin-left: 10px;
                        font-size: 14px;
                        span{
                            position: relative;
                            top: 3px;
                            left: 2px;
                        }
                    }
                }
                div:nth-child(1){
                    float: left;
                }
                div:nth-child(2){
                    float: right;
                }
            }
        }
        .desc{
            width: 90%;
            margin: 20px auto 0;
            h2{
                color: #222222;
                font-size: 19px;
            }
            div.descContent{
                margin-top: 20px;
                div.descDisplay{
                    display: none;
                }
                p{
                    margin-bottom: 20px;
                    font-size: 16px;
                    color: #999999;
                }
                span{
                    color: #222222;
                }
            }
        }
        .descShow{
            height: 49px;
            line-height: 49px;
            background-color: #f6f7fc;
            text-align: center;
            color: #6e94b6;
            margin-top: 20px;
            font-size: 14px;
        }
        .more{
            width:90%;
            margin: 20px auto 0;
            .moreCont{
                &>div{
                    span{
                        font-size: 14px;
                        color: #222222;
                    }
                }
            }
            h2{
                color: #222222;
                font-size: 19px;
            }
            &>div:after{
                clear:both;
                content:'.';
                display:block;
                width: 0;
                height: 0;
                visibility:hidden;
            }
            &>div{
                margin: 20px auto 0;
                display: flex;
                justify-content: space-between;
                & div{
                    text-align: center;
                    flex-grow:1;
                    p{
                        font-size: 20px;
                        margin-bottom: 10px;
                    }
                }
                & div:nth-child(3){

                }
            }
        }
    }
</style>
