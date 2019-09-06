<template>
    <div class="search">
        <nav-bar :title="msg" v-if="!isWeixin" class="publicHeader"></nav-bar>
        <div class="publicContent">
            <div class="searchCont">
                <div class="iSearch">
                    <div>
                        <h2 @click.stop="iPriceFlag">
                            <i>{{selectItem}}</i>
                            <span>
                                <van-icon v-if="priceFlag" name="arrow-down" />
                                <van-icon v-else name="arrow-up" />
                            </span>
                        </h2>
                        <ul class="iToggleMenu" v-show="iToggleMenu">
                            <li v-for="(item,index) in items" :key="index" @click="getItem(index,item)">{{item}}</li>
                            <div class="iToggleArrow"></div>
                        </ul>
                    </div>
                    <div>
                        <input type="text" placeholder="请输入小区名称" v-model="searchValue" @input="checkInput" @keyup.13="getKeyUp('')">
                    </div>
                </div>
            </div>
            <div class="iList" v-if="resultList.length">
                <van-pull-refresh v-model="isDownLoading" @refresh="onDownRefresh">
                    <van-list v-model="isUpLoading" :finished="upFinished" finished-text="没有更多了" @load="onLoadList" :offset="offset">
                        <sale-lists v-if="type == 1" :list="resultList"></sale-lists>
                        <rent-lists v-else :list="resultList"></rent-lists>
                    </van-list>
                </van-pull-refresh>
            </div>
            <div v-if="emptyResult" class="nothing">
                <img src="../../assets/nothing.png">
                <span>没有任何搜索结果</span>
            </div>
            <div class="historySearch" v-if="searchHistory.length && showHistory">
                <div>
                    <h3>历史搜索</h3>
                    <span @click="clearAllHistory">清空历史</span>
                </div>
                <div>
                    <h4 v-for="(item, index) in searchHistory" :key="index" @click="getKeyUp(item)">{{item}}</h4>
                </div>
            </div>
            <div class="hotSearch" v-show="showHotKeywords" v-if="hotKeywords.length">
                <div>
                    <h3>热搜房源</h3>
                </div>
                <div>
                    <h4 v-for="(item, index) in hotKeywords" :key="index" @click="getKeyUp(item.title)">{{item.title}}</h4>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import saleLists from "../../components/common/saleLists.vue";
    import rentLists from "../../components/common/rentLists.vue";
    import {searchResult,hotKeywords} from "../../config/api";
    import util from '../../config/util';
    import navBar from "../../components/common/navBar.vue";

    export default {
        data(){
            return{
                msg:"搜索",
                priceFlag:true,
                iToggleMenu:false,
                cityId:'',//城市id
                type: 1, //1代表二手房,2为租房
                items:["二手房","租房"],
                selectItem:'二手房',
                searchValue:"", //搜索关键词
                sortBy:false,
                resultList: [], // 搜索返回的结果
                hotKeywords:[], // 热搜小区数组
                showHotKeywords: true, // 是否显示热搜小区，只有在返回搜索结果后隐藏
                searchHistory: [], // 搜索历史记录                
                showHistory: true, // 是否显示历史记录，只有在返回搜索结果后隐藏
                emptyResult: false, // 搜索结果为空时显示,
                isSearch:false,//是否搜索
                page:1,//页码
                isDownLoading:false,//下拉刷新
                isUpLoading:false,//上拉加载
                upFinished:false,//上拉加载完毕
                offset:100,//滚动条与底部距离小于 offset 时触发load事件
            }
        },
        created(){
            this.cityId = this.$route.query.cityId;
        },
        mounted(){
            document.onclick =()=> {
                this.iToggleMenu = false;
                this.sortBy = false;
                this.priceFlag=true;
            }
            //获取搜索历史记录
            if (util.getStore('searchHistory')) {
                this.searchHistory = JSON.parse(util.getStore('searchHistory'));
            }
            //获取热搜小区
            this.initData();
        },
        components: {
            navBar,
            saleLists,
            rentLists
        },
        methods:{
            iPriceFlag(){
                this.priceFlag=!this.priceFlag;
                this.iToggleMenu=!this.iToggleMenu;
                this.sortBy=true;
            },
            getItem(index,name){
                this.page = 1;
                this.type = index + 1;
                this.selectItem = name;
                this.iToggleMenu = false;
                this.resultList = [];
                this.getKeyUp(this.searchValue);
            },
            saleDetail(id){
                this.$router.push({path: '../sale/detail', query: {id: id}});
            },
            rentDetail(id){
                this.$router.push({path: '../rent/detail', query: {id: id}});
            },
            onLoadList(){ //上拉加载
                this.isUpLoading = true;
                this.page++;
                this.getKeyUp(this.searchValue);
            },
            onDownRefresh(){ //下拉刷新
                this.page = 1;
                this.isSearch = false;
                this.isDownLoading = true;
                this.getKeyUp(this.searchValue);
            },
            async initData(){
                await hotKeywords(this.cityId).then(res =>{
                    this.hotKeywords = res.data.list;
                })
            },
            async getKeyUp(historyValue){
                // 这里是要点击之后再搜索框里面按回车键之后要发生的事情...
                if (historyValue) {
                    this.searchValue = historyValue;
                }else if (!this.searchValue) {
                    return 
                }
                //隐藏历史记录
                this.showHistory = false;
                //隐藏热搜小区
                this.showHotKeywords = false;
                //获取搜索结果
                await searchResult(this.page,this.searchValue,this.type,this.cityId).then(res =>{
                    if(res.code == 0){//请求成功
                        if(this.resultList.length){//当请求前有数据时 第n次请求
                            if(this.isUpLoading){// 上拉加载
                                this.resultList = this.resultList.concat(res.data.lists); //上拉加载新数据添加到数组中
                                this.$nextTick(()=>{ //在下次 DOM 更新循环结束之后执行延迟回调
                                    this.isUpLoading = false;  //关闭上拉加载中
                                })
                                if(this.resultList.length >= res.data.total){//没有更多数据
                                    this.upFinished = true;   //上拉加载完毕
                                }
                            }else{
                                this.list = res.data.lists;  //重新给数据赋值 
                                if(!this.isSearch && this.isDownLoading){//关闭下拉刷新
                                    this.isDownLoading = false; //关闭下拉刷新中                                                                                                    
                                    if(this.upFinished){ //如果上拉加载完毕为true则设为false。解决上拉加载完毕后再下拉刷新就不会执行上拉加载问题
                                        this.upFinished = false;
                                    }
                                }
                            }                                                        
                        }else{//当请求没有数据时 第一次请求
                            this.resultList = res.data.lists;
                            if(this.isDownLoading){//关闭下拉刷新
                                this.isDownLoading = false; //关闭下拉刷新中
                            }
                            /*this.prices = Object.values(res.prices);
                            this.rooms = res.rooms;
                            this.mjs = Object.values(res.mjs);
                            this.towards = Object.values(res.towards);
                            this.wylxs = Object.values(res.wylxs);
                            this.zxzks = Object.values(res.zxzks);
                            this.elevators = res.elevators;
                            this.tags = Object.values(res.tags);*/
                        }
                        this.emptyResult = !this.resultList.length;
                    }else{
                        //this.$toast(res.msg);
                        this.emptyResult = !this.resultList.length;
                    }
                })
                /**
                 * 点击搜索结果进入下一页面时进行判断是否已经有一样的历史记录
                 * 如果没有则新增，如果有则不做重复储存，判断完成后进入下一页
                 */
                let history = util.getStore('searchHistory');
                if (history) { 
                    let checkrepeat = false;
                    this.searchHistory = JSON.parse(history);
                    this.searchHistory.forEach(item => {
                        if (item == this.searchValue) {
                            checkrepeat = true;
                        }
                    })
                    if (!checkrepeat) {
                        this.searchHistory.push(this.searchValue);
                    }
                }else {
                    this.searchHistory.push(this.searchValue);
                }
                util.setStore('searchHistory',this.searchHistory);
            },
            //搜索结束后，删除搜索内容直到为空时清空搜索结果，并显示历史记录
            checkInput(){
                if (this.searchValue === '') {
                    this.page = 1;
                    this.showHistory = true; //显示历史记录
                    this.showHotKeywords = true; //显示热搜小区
                    this.resultList = []; //清空搜索结果
                    this.emptyResult = false; //隐藏搜索为空提示
                } 
            },
            //清除所有历史记录
            clearAllHistory(){
                this.searchHistory = [];
                util.setStore('searchHistory',this.searchHistory);
            }
        }
    }
</script>

<style scoped lang="less">
    .search{
        height: 100vh;
        .nothing{
            width: 143px;
            height: 107px;
            margin: 100px auto 0;
            text-align: center;
            img{
                width: 100%;
                vertical-align: top;
            }
            span{
                display: block;
                color: #999999;
                margin-top: 20px;
                font-size: 16px;
            }
        }
        .searchCont{
            height: 45px;
            border-bottom: 1px solid #E5E5E5;
            .iSearch:after{
                clear:both;
                content:'.';
                display:block;
                width: 0;
                height: 0;
                visibility:hidden;
            }
            .iSearch:after{
                clear:both;
                content:'.';
                display:block;
                width: 0;
                height: 0;
                visibility:hidden;
            }
            .iSearch{
                width: 90%;
                top: 2px;
                margin: 0 auto;
                display: flex;
                >div:nth-child(1){
                    width: 23%;
                    margin-top: 10px;
                    position: relative;
                    h2{
                        font-size: 14px;
                        font-weight: normal;
                        display: flex;
                        position: relative;
                        color: #222222;
                        i{
                            font-style: normal;
                            position: relative;
                            top: 2px;
                        }
                        span{
                            position: absolute;
                            top: 4px;
                            left: 50px;
                        }
                    }
                    ul.iToggleMenu{
                        width: 70px;
                        position: absolute;
                        top: 35px;
                        left: 0px;
                        z-index: 10;
                        padding: 10px 0;
                        background-color: #fff;
                        border: 1px solid #999;
                        border-radius: 4px;
                        li{
                            text-align: center;
                            height: 30px;
                            line-height: 30px;
                            font-size: 14px;
                        }
                        div.iToggleArrow{
                            position: absolute;
                            left: 50%;
                            top: -6px;
                            margin-left: -5px;
                            width:10px;
                            height: 10px;
                            border-right: 1px solid #999;
                            border-bottom: 1px solid #999;
                            -webkit-transform: rotate(-135deg);
                            background: #fff;
                        }
                    }
                }
                div:nth-child(2){
                    width: 77%;
                    margin-top: 10px;
                    input{
                        width: 100%;
                        height: 25px;
                        border: none;
                        font-size: 14px;
                    }
                }
            }
        }
        .iList{
            width: 92%;
            margin: 0 auto;
            position: relative;
            //padding-top: 90px;
            >div:last-child{
                border: none;
            }
            .iListCont{
                display: flex;
                justify-content:flex-start;
                margin-top: 20px;
                border-bottom: 1px solid #E5E5E5;
                padding-bottom: 18px;
                >div:nth-child(1){
                    width: 125px;
                    height: 90px;
                    img{
                        width: 100%;
                        vertical-align: top;
                    }
                }
                >div:nth-child(2){
                    margin-left: 5%;
                    h2{
                        font-size: 16px;
                        color: #222222;
                        font-weight: normal;
                        margin-bottom: 3px;
                    }
                    p{
                        font-size: 14px;
                        margin-bottom: 1px;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                    }
                    div.info1{
                        margin-bottom: 1px;
                        span{
                            padding: 2px 5px;
                            background-color: #C2E2FF;
                            border-radius: 5px;
                            font-size: 12px;
                            color: #5FACFB;
                            margin-right: 10px;
                        }
                        >span:nth-child(1){
                            background-color: #FFCDD2;
                            color:#FA6C62;
                        }
                    }
                    div.info2{
                        display: flex;
                        justify-content:space-between;
                        i{
                            color: #999999;
                            font-style: normal;
                        }
                        em{
                            font-style: normal;
                            color: #f44336;
                            position: absolute;
                            right: 5px;
                        }
                    }
                }
            }
        }
        .historySearch:after{
            clear:both;
            content:'.';
            display:block;
            width: 0;
            height: 0;
            visibility:hidden;
        }
        .historySearch{
            width: 90%;
            margin: 15px auto 0;
            >div:nth-child(1){
                display: flex;
                justify-content: space-between;
                h3{
                    font-size: 14px;
                    color: #222222;
                    font-weight: normal;
                }
                span{
                    color: #999999;
                    font-size: 14px;
                }
            }
            >div:nth-child(2){
                margin-top: 20px;
                h4{
                    width: 30%;
                    height: 32px;
                    background-color: #7C9BF6;
                    border-radius: 5px;
                    text-align: center;
                    line-height: 32px;
                    font-weight: normal;
                    font-size: 14px;
                    color: #ffffff;
                    float: left;
                    margin: 0 10px 10px 0;
                }
            }
        }
        .hotSearch{
            width: 90%;
            margin: 20px auto 0;
            >div:nth-child(1){
                display: flex;
                justify-content: space-between;
                h3{
                    font-size: 14px;
                    color: #222222;
                    font-weight: normal;
                }
            }
            >div:nth-child(2){
                margin-top: 20px;
                h4{
                    width: 30%;
                    height: 32px;
                    background-color: #7C9BF6;
                    border-radius: 5px;
                    text-align: center;
                    line-height: 32px;
                    font-weight: normal;
                    font-size: 14px;
                    color: #ffffff;
                    float: left;
                    margin: 0 10px 10px 0;
                }
            }
        }
    }
</style>
