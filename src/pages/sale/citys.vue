<template>
    <div class="saleList">
        <nav-bar :title="msg" v-if="!isWeixin" class="publicHeader"></nav-bar>
        <div class="publicContent">
            <div class="iNav">
                <div>
                    <h2 @click="chooseType('area')" :class="{selectH2:areaSelect}">
                        {{areaTitle}}
                        <span>
                        <van-icon v-if="areaFlag" name="arrow-down"/>
                        <van-icon v-else name="arrow-up"/>
                    </span>
                    </h2>
                    <h2 @click="chooseType('price')" :class="{selectH2:priceSelect}">
                        {{priceTitle}}
                        <span>
                        <van-icon v-if="priceFlag" name="arrow-down"/>
                        <van-icon v-else name="arrow-up"/>
                    </span>
                    </h2>
                    <h2 @click="chooseType('shi')" :class="{selectH2:shiSelect}">
                        {{shiTitle}}
                        <span>
                        <van-icon v-if="shiFlag" name="arrow-down"/>
                        <van-icon v-else name="arrow-up"/>
                    </span>
                    </h2>
                    <h2 @click="chooseType('mj')" :class="{selectH2:mjSelect}">
                        {{mjTitle}}
                        <span>
                        <van-icon v-if="mjFlag" name="arrow-down"/>
                        <van-icon v-else name="arrow-up"/>
                    </span>
                    </h2>
                </div>
            </div>

            <div class="iNavTan">
                <transition name="type">
                    <div v-show="sortBy == 'area'" class="showlistContent isType">
                        <virtual-list :size="50" :remain="8">
                            <p @click="getArea(0,'区域')">全部</p>
                            <p v-for="item in areas" :key="item.id" :class="{itemClass:selectAreaTitle==item.name}"
                               @click="getArea(item.id,item.name)">{{item.name}}</p>
                        </virtual-list>
                    </div>
                </transition>
                <transition name="price">
                    <div v-show="sortBy == 'price'" class="showlistContent isPrice">
                        <p @click="getPrice(0,'售价',0)">全部</p>
                        <p v-for="item in prices" :key="item.id" :class="{itemClass:selectPriceTitle == item.name}"
                           @click="getPrice(item.id,item.name,item.notes)">{{item.name}}</p>
                        <p>
                            自定义：
                            <input type="tel" placeholder="最低" v-model="lowest">
                            <input type="tel" placeholder="最高" v-model="highest">万
                            <button @click="getDefined()">搜索</button>
                        </p>
                    </div>
                </transition>
                <transition name="type">
                    <div v-show="sortBy == 'shi'" class="showlistContent isType">
                        <p @click="getRoom(0,'户型')">全部</p>
                        <p v-for="(item,index) in rooms" :key="index" :class="{itemClass:selectShiTitle==item}"
                           @click="getRoom(index,item)">{{item}}</p>
                    </div>
                </transition>
                <transition name="type">
                    <div v-show="sortBy == 'mj'" class="showlistContent isType">
                        <p @click="getMj(0,'面积',0)">全部</p>
                        <p v-for="item in mjs" :key="item.id" :class="{itemClass:selectMjTitle==item.name}"
                           @click="getMj(item.id,item.name,item.notes)">{{item.name}}</p>
                    </div>
                </transition>
            </div>

            <transition name="showcover">
                <div class="back_cover" v-show="sortBy" @click="onSortBy" ref="iSort"></div>
            </transition>
            <div class="iList">
                <van-pull-refresh v-model="isDownLoading" @refresh="onDownRefresh">
                    <van-list v-model="isUpLoading" :finished="upFinished" finished-text="没有更多了" @load="onLoadList"
                              :offset="offset">
                        <sale-lists :list="list"></sale-lists>
                    </van-list>
                </van-pull-refresh>
            </div>
            <div class="sort" @click="sortShow=true">
                <img src="../../assets/iconSort.png">
            </div>
            <van-popup v-model="sortShow" position="bottom">
                <van-picker :columns="columns" @change="onChange"/>
            </van-popup>
        </div>
    </div>
</template>

<script>
    import virtualList from 'vue-virtual-scroll-list';
    import saleLists from "../../components/common/saleLists.vue";
    import {cityList} from "../../config/api";
    import navBar from "../../components/common/navBar.vue";

    export default {
        data() {
            return {
                msg:"二手房列表",
                areaFlag: true,
                priceFlag: true,
                shiFlag: true,
                mjFlag: true,
                areaSelect: false,
                priceSelect: false,
                shiSelect: false,
                mjSelect: false,
                areaShow: false,
                priceShow: false,
                typeShow: false,
                mjShow: false,
                sortBy: '',// 筛选的条件
                areaTitle: '区域', //筛选区域标题
                selectAreaTitle: '',//筛选区域选中标题
                priceTitle: '售价', //筛选售价标题
                selectPriceTitle: '',//筛选售价选中标题
                priceNote: '',//价格筛选参数
                shiTitle: '户型', //筛选户型标题
                selectShiTitle: '',//筛选户型选中标题
                mjTitle: '面积', //筛选面积标题
                selectMjTitle: '',//筛选面积选中标题
                list: [],//列表数据
                city:'',//城市id
                lowest: '',//最低价格
                highest: '',//最高价格
                areas:[],//区域
                area:'',//区域筛选参数
                prices: [],//售价范围
                rooms: {},//室
                room: '',//室筛选参数
                mjs: [],//面积范围
                mj: '',//面积筛选参数
                type:1,//1代表二手房                
                page: 0,//页码
                isDownLoading: false,//下拉刷新
                isUpLoading: false,//上拉加载
                upFinished: false,//上拉加载完毕
                offset: 5,//滚动条与底部距离小于 offset 时触发load事件
                sortShow: false,
                isSort: 0,//排序
                columns: ['默认排序', '总价从低到高', '总价从高到低', '单价从低到高', '单价从高到低']
            }
        },
        components: {
            navBar,
            virtualList,
            saleLists
        },
        created() {
            this.city = this.$route.query.city;
        },
        methods: {
            onChange(picker, value, index) {
                this.sortShow = false;
                this.isSort = index;
                this.onDownRefresh();
            },
            onSortBy() {
                this.areaShow = false;
                this.priceShow = false;
                this.typeShow = false;
                this.mjShow = false;
                this.sortBy = false;
                this.areaFlag=true;
                this.areaSelect=false;
                this.priceFlag=true;
                this.priceSelect=false;
                this.shiFlag=true;
                this.shiSelect=false;
                this.mjFlag=true;
                this.mjSelect=false;
            },
            init() {
                let params = {
                    city:this.city,
                    type:this.type,
                    page: this.page + 1
                };
                if(this.area) params['area'] = this.area;
                if(this.priceNote) params['price'] = this.priceNote;
                if(this.room) params['room'] = this.room;
                if(this.mj) params['mj'] = this.mj;
                if(this.isSort) params['isSort'] = this.isSort;
                cityList(params).then(res => {
                    if(res.code == 0){//请求成功
                        this.list = res.data.lists;
                        this.isDownLoading = false; //关闭下拉刷新效果
                        this.page++;
                        if (this.list.length >= res.data.total) {
                            this.upFinished = true;
                        }
                    }else{
                        this.$toast(res.msg);
                    }
                });
            },
            //下拉刷新
            onDownRefresh() {
                this.list = [];
                this.page = 0;
                this.upFinished = false;
                this.init(); //加载数据
            },
            //页面初始化之后会触发一次，在页面往下加载的过程中会多次调用上拉加载
            onLoadList() {
                setTimeout(() => { //下拉刷新时必须要延迟加载
                    let params = {
                        city:this.city,
                        type:this.type,
                        page: this.page + 1
                    };
                    if(this.area) params['area'] = this.area;
                    if(this.priceNote) params['price'] = this.priceNote;
                    if(this.room) params['room'] = this.room;
                    if(this.mj) params['mj'] = this.mj;
                    if(this.isSort) params['isSort'] = this.isSort;
                    cityList(params).then(res => {
                        if(res.code == 0){//请求成功
                            if(this.page == 0){
                                this.areas = Object.values(res.data.areas);
                                this.prices = Object.values(res.data.prices);
                                this.rooms = res.data.rooms;
                                this.mjs = Object.values(res.data.mjs);
                            }
                            this.list = this.list.concat(res.data.lists);
                            this.isUpLoading = false;
                            this.page++;
                            if (this.list.length >= res.data.total) {
                                this.upFinished = true;
                            }
                        }else{
                            this.$toast(res.msg);
                        }
                    });
                }, 500);
            },          
            // 点击顶部四个选项，展示不同的列表，选中当前选项进行展示，同时收回其他选项
            async chooseType(type) {
                if (type == 'area') {
                    this.areaFlag = !this.areaFlag;
                    this.areaSelect = true;
                    this.priceFlag=true;
                    this.priceSelect = false;
                    this.shiFlag=true;
                    this.shiSelect = false;
                    this.mjFlag=true;
                    this.mjSelect = false;
                }
                if (type == 'price') {
                    this.priceFlag = !this.priceFlag;
                    this.priceSelect = true;
                    this.areaFlag=true;
                    this.areaSelect = false;
                    this.shiFlag=true;
                    this.shiSelect = false;
                    this.mjFlag=true;
                    this.mjSelect = false;
                }
                if (type == 'shi') {
                    this.shiFlag = !this.shiFlag;
                    this.shiSelect = true;
                    this.areaFlag=true;
                    this.areaSelect = false;
                    this.priceFlag=true;
                    this.priceSelect = false;
                    this.mjFlag=true;
                    this.mjSelect = false;
                }
                if (type == 'mj') {
                    this.mjFlag = !this.mjFlag;
                    this.mjSelect = true;
                    this.areaFlag=true;
                    this.areaSelect = false;
                    this.priceFlag=true;
                    this.priceSelect = false;
                    this.shiFlag=true;
                    this.shiSelect = false;
                }
                if (this.sortBy !== type) {
                    this.sortBy = type;
                    //选项中头部标题发生改变，需要特殊处理
                    if (type == "area") {
                        this.areaTitle = this.selectAreaTitle ? this.selectAreaTitle : this.areaTitle;
                    } else if (type == "price") {
                        this.priceTitle = this.selectPriceTitle ? this.selectPriceTitle : this.priceTitle;
                    } else if (type == "shi") {
                        this.shiTitle = this.selectShiTitle ? this.selectShiTitle : this.shiTitle;
                    } else if (type == "mj") {
                        this.mjTitle = this.selectMjTitle ? this.selectMjTitle : this.mjTitle;
                    }
                } else {
                    //再次点击相同选项时收回列表
                    this.sortBy = "";
                    if (type == "area") {
                        this.areaTitle = this.selectAreaTitle ? this.selectAreaTitle : this.areaTitle;
                    } else if (type == "price") {
                        this.priceTitle = this.selectPriceTitle ? this.selectPriceTitle : this.priceTitle;
                    } else if (type == "shi") {
                        this.shiTitle = this.selectShiTitle ? this.selectShiTitle : this.shiTitle;
                    } else if (type == "mj") {
                        this.mjTitle = this.selectMjTitle ? this.selectMjTitle : this.mjTitle;
                    }
                }
            },
            getArea(id, name) {//选中区域的某个选项时，进行筛选，重新获取数据并渲染
                this.sortBy = "";
                this.areaFlag = !this.areaFlag;
                if(id == this.area) return;
                this.area = id;                
                this.areaTitle = this.selectAreaTitle = name;
                this.list = [];
                this.page = 0;
                this.upFinished = false;
                this.init();
            },
            //选中price的某个选项时，进行筛选，重新获取数据并渲染
            getPrice(id, name, note) {
                this.sortBy = "";
                this.priceFlag = !this.priceFlag;
                if(note == this.priceNote) return;
                this.priceNote = note;                
                this.priceTitle = this.selectPriceTitle = name;                
                this.list = [];
                this.page = 0;
                this.upFinished = false;
                this.init();
            },
            getDefined() { //自定义价格
                if (!this.lowest || !this.highest) {
                    this.$toast('请输入最低和最高价格');
                    return;
                }
                if (Number.isNaN(Number(this.lowest))) {
                    this.$toast('请输入正确的最低价格');
                    return;
                }
                if (Number.isNaN(Number(this.highest))) {
                    this.$toast('请输入正确的最高价格');
                    return;
                }
                this.sortBy = "";
                this.priceFlag = !this.priceFlag;
                if(this.lowest + '~' + this.highest == this.priceNote) return;
                this.priceNote = this.lowest + '~' + this.highest;                
                this.priceTitle = this.selectPriceTitle = this.lowest + '-' + this.highest + '万';
                this.list = [];
                this.page = 0;
                this.upFinished = false;
                this.init();
            },
            getRoom(id, name) {//选中户型的某个选项时，进行筛选，重新获取数据并渲染
                this.sortBy = "";
                this.shiFlag = !this.shiFlag;
                if(id == this.room) return;
                this.room = id;                
                this.shiTitle = this.selectShiTitle = name;
                this.list = [];
                this.page = 0;
                this.upFinished = false;
                this.init();
            },            
            getMj(id, name, note) {//选中面积的某个选项时，进行筛选，重新获取数据并渲染
                this.sortBy = "";
                this.mjFlag = !this.mjFlag;
                if(note == this.mj) return;
                this.mj = note;                
                this.mjTitle = this.selectMjTitle = name;                
                this.list = [];
                this.page = 0;
                this.upFinished = false;
                this.init();
            },
        }
    }
</script>

<style scoped lang="less">
    .saleList {
        .iNavTan{
            width: 100%;
            min-width: 320px;
            max-width: 640px;
            position: absolute;
        }
        .price-enter-active, .price-leave-active, .type-enter-active, .type-leave-active, .more-enter-active, .more-leave-active {
            transition: all 0.3s;
            transform: translateY(0);
        }
        .price-enter, .price-leave-active, .type-enter, .type-leave-active, .more-enter, .more-leave-active {
            opacity: 0;
            transform: translateY(-100%);
        }
        .showcover-enter-active, .showcover-leave-active {
            transition: opacity 0.3s;
        }
        .showcover-enter, .showcover-leave-active {
            opacity: 0;
        }
        .showlistContent {
            width: 100%;
            background-color: #ffffff;
            position: absolute;
            top: 32px;
            left: 0;
            z-index: 9;
            padding-top: 10px;
            p.itemClass {
                color: #1989FA;
            }
        }
        .showlistContent p {
            border-top: 1px solid #E5E5E5;
            padding: 10px 15px;
            color: #666666;
            font-size: 14px;
        }
        .showlistContent p:first-child{
            border-top: none;
        }
        .showlistContent p input {
            width: 45px;
            margin-right: 5px;
            height: 22px;
            font-size: 14px;
            border: 1px solid #999999;
            padding-left: 5px;
            border-radius: 4px;
        }
        .showlistContent p button {
            border-radius: 0;
            -webkit-appearance: none;
            background-color: #f44336;
            border: none;
            font-size: 14px;
            color: #ffffff;
            width: 50px;
            height: 25px;
            position: relative;
            top: 1px;
            border-radius: 4px;
        }
        .showlistContent .isShowlistCont:first-child{
            border-top: none;
        }
        .isShowlistCont {
            border-top: 1px solid #E5E5E5;
            padding-bottom: 10px;
        }
        .isShowlistCont h2 {
            font-size: 16px;
            font-weight: normal;
            width: 90%;
            margin: 0 auto;
            padding-top: 5px;
            color: #666666;
        }
        .isShowBtnContent {
            display: flex;
            flex-wrap: wrap;
            width: 90%;
            margin: 0 auto;
        }
        .isShowBtn button {
            border-radius: 0;
            -webkit-appearance: none;
            background-color: #f7f7f7;
            border: none;
            font-size: 14px;
            color: #666666;
            width: 100px;
            height: 25px;
            position: relative;
            bottom: 1px;
            margin: 10px 10px 0 0;
        }
        .isShowBtn button.btnClass {
            background-color: #7c9bf6;
            color: #ffffff;
        }
        .iClear {
            border-top: 1px solid #e5e5e5;
            padding: 10px 0;
            .iClearContent {
                width: 90%;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                button {
                    width: 48%;
                    height: 41px;
                    color: #ffffff;
                    border: none;
                    border-radius: 6px;
                }
                > button:nth-child(1) {
                    background-color: #f7f7f7;
                    color: #666666;
                }
                > button:nth-child(2) {
                    background-color: #f44336;
                }
            }
        }
        .back_cover {
            position: fixed;
            width: 100%;
            height: 100%;
            max-width: 640px;
            z-index: 7;
            background-color: rgba(0, 0, 0, 0.3);
        }
        .iNav {
            border-bottom: 1px solid #E5E5E5;
            background-color: #ffffff;
            position: fixed;
            width: 100%;
            min-width: 320px;
            max-width: 640px;
            padding: 10px 0;
            z-index: 998;
            > div:nth-child(1) {
                width: 85%;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                h2 {
                    font-size: 16px;
                    font-weight: normal;
                    color: #222222;
                    span {
                        font-size: 16px;
                        position: relative;
                        top: 2px;
                    }
                }
                h2.selectH2 {
                    color: #1989FA;
                }
            }
        }
        .iList {
            width: 92%;
            margin: 0 auto;
            position: relative;
            padding-top: 44px;
            > div:last-child {
                border: none;
            }            
        }
        .sort {
            width: 50px;
            height: 50px;
            position: fixed;
            right: 10px;
            bottom: 40px;
            img {
                width: 100%;
                vertical-align: top;
            }
        }
    }
</style>
