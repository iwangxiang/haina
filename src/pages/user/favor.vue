<template>
    <div class="collection">
        <nav-bar :title="msg" v-if="!isWeixin" class="publicHeader"></nav-bar>
        <div class="publicContent">
            <div class="iList">
                <van-pull-refresh v-model="isDownLoading" @refresh="onDownRefresh">
                    <van-list v-model="isUpLoading" :finished="upFinished" finished-text="没有更多了" @load="onLoadList" :offset="offset">
                        <div class="iListContent" v-for="item in list" :key="item.id" @click="item.type == 1 ? saleDetail(item.source_id) : rentDetail(item.source_id)">
                            <van-swipe-cell :right-width="65" :left-width="65" class="van-swipe-cell2" :on-close="onClose">
                                <span slot="left" class="vanSwipeCell van-swipe-cell__left2" @click="setTop(item.id)">置顶</span>
                                <div class="iListCont">
                                    <div>
                                        <img :src="item.params.thumb" onerror="this.src='../../assets/home/listImg1.jpg'">
                                    </div>
                                    <div v-if="item.type == 1">
                                        <h2>{{item.params.title}} {{item.params.xiangq}}</h2>
                                        <p>{{item.params.jzmj ? item.params.jzmj +'㎡ | ' : ''}}{{item.params.cx ? item.cx + ' | ' : ''}}{{item.params.louceng}}</p>
                                        <div class="info1" v-if="item.tagsArr.length"><template v-for="(iitem,iindex) in item.tagsArr"><span :key="iindex" v-if="iindex < 3">{{iitem}}</span></template></div>
                                        <div class="info2"><i>{{item.params.unit_price}}</i><em>{{item.params.price}}</em></div>
                                    </div>
                                    <div v-else-if="item.type == 2">
                                        <h2>{{item.params.title}}</h2>
                                        <p>{{item.params.xiangq ? item.params.xiangq + '|' : ''}}{{item.params.area ? item.params.area +'㎡ | ' : ''}}{{item.params.cx}}</p>
                                        <div class="info1" v-if="item.tagsArr.length"><template v-for="(iitem,iindex) in item.tagsArr"><span :key="iindex" v-if="iindex < 3">{{iitem}}</span></template></div>
                                        <div class="info2"><i>{{item.params.price}}</i></div>
                                    </div>
                                </div>
                                <span slot="right" class="vanSwipeCell van-swipe-cell__right2" @click="del(item.id)">删除</span>
                            </van-swipe-cell>
                        </div>
                    </van-list>
                </van-pull-refresh>
            </div>
        </div>
    </div>
</template>

<script>
    import util from '../../config/util';
    import {collectionList,collectionTop,collectionDel,rowXiaoqu} from "../../config/api";
    import navBar from "../../components/common/navBar.vue";

    export default {
        data(){
            return{
                id:'',
                xiaoquId:'',
                isSearch:false,//是否搜索
                list:[],//列表数据
                page:1,//页码
                isDownLoading:false,//下拉刷新
                isUpLoading:false,//上拉加载
                upFinished:false,//上拉加载完毕
                offset:100,//滚动条与底部距离小于 offset 时触发load事件
                msg:"加入收藏"
            }
        },
        created(){
            this.xiaoquId = this.$route.query.xiaoquId;
        },
        mounted(){
            let user = JSON.parse(util.getStore('userInfo'))
            if(!user || !user.id){
                this.$toast('请微信登录收藏');
                this.getXiaoquInfo(user);  
            }else{
                this.getList();
            } 
        },
        components:{
            navBar
        },
        methods:{
            saleDetail(id){
                this.$router.push({path: '../sale/detail', query: {id: id}});
            },
            rentDetail(id){
                this.$router.push({path: '../rent/detail', query: {id: id}});
            },
            setTop(id){ //置顶
                this.id = id;
            },
            del(id){ //删除
                this.id = id;
            },
            onClose(clickPosition, instance) {
                switch (clickPosition) {
                    case 'left':
                        this.$dialog.confirm({
                            message: '确定置顶吗？'
                        }).then(() => {
                            let hash = util.getStore('uhash');
                            collectionTop(this.id,hash).then(res =>{
                                if(res.code == 0){
                                    this.$toast('置顶成功');
                                    this.page = 1;
                                    this.isSearch = true;
                                    this.getList();
                                }else this.$toast(res.msg);
                            })
                            instance.close();
                        }).catch(() => {
                            // on cancel
                        });
                        break;
                    case 'cell':
                    case 'outside':
                        instance.close();
                        break;
                    case 'right':
                        this.$dialog.confirm({
                            message: '确定删除吗？'
                        }).then(() => {
                            let hash = util.getStore('uhash');
                            collectionDel(this.id,hash).then(res =>{
                                if(res.code == 0){
                                    this.$toast('删除成功');
                                    this.page = 1;
                                    this.isSearch = true;
                                    this.getList();
                                }else this.$toast(res.msg);
                            })
                            instance.close();
                        }).catch(() => {
                            // on cancel
                        });
                        break;
                }
            },
            onLoadList(){ //上拉加载
                this.isUpLoading = true;
                this.page++;
                this.getList();
            },
            onDownRefresh(){ //下拉刷新
                this.page = 1;
                this.isDownLoading = true;
                this.getList();
            },
            async getXiaoquInfo(){
                await rowXiaoqu(this.xiaoquId).then(res =>{
                    if(res.code == 0){//请求成功
                        util.goXiaoqu({}, res.data.property_id)
                    }else{
                        this.$toast(res.msg);
                    }   
                })   
            },
            
            async getList(){
                let hash = util.getStore('uhash');
                await collectionList(hash,this.page).then(res =>{
                    if(res.code == 0){//请求成功
                        if(this.list.length){//当请求前有数据时 第n次请求
                            if(this.isUpLoading){// 上拉加载
                                this.list = this.list.concat(res.data.lists); //上拉加载新数据添加到数组中
                                this.$nextTick(()=>{ //在下次 DOM 更新循环结束之后执行延迟回调
                                    this.isUpLoading = false;  //关闭上拉加载中
                                })
                                if(this.list.length >= res.data.total){//没有更多数据
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
                            this.list = res.data.lists;
                            if(this.isDownLoading){//关闭下拉刷新
                                this.isDownLoading = false; //关闭下拉刷新中
                            }
                        }
                    }else{
                        this.$toast(res.msg);
                    }
                })               
            }
        }
    }
</script>

<style scoped lang="less">
    .collection{
        .iList{
            width: 92%;
            margin: 0 auto;
            position: relative;
            .iListContent{
                margin-top: 20px;
                border-bottom: 1px solid #E5E5E5;
                border-top: 1px solid #E5E5E5;
                .vanSwipeCell{
                    color: #fff;
                    font-size: 15px;
                    width: 65px;
                    height: 130px;
                    text-align: center;
                    display:flex;
                    text-align:center;
                    align-items:center;
                    justify-content:center;
                }
                .van-swipe-cell__left2{
                    background-color: #DEDEDE;
                    color: #333333;
                }
                .van-swipe-cell__right2{
                    background-color: #f44;
                    color: #ffffff;
                }
                .iListCont{
                    display: flex;
                    padding: 18px 0;
                    >div:nth-child(1){
                        width: 125px;
                        height: 90px;
                        img{
                            width: 125px;
                            vertical-align: top;
                        }
                    }
                    >div:nth-child(2){
                        margin-left: 17px;
                        h2{
                            font-size: 16px;
                            color: #222222;
                            font-weight: normal;
                            margin-bottom: 10px;
                        }
                        p{
                            font-size: 11px;
                            color: #999999;
                            margin-bottom: 10px;
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                        }
                        div.info1{
                            margin-bottom: 4px;
                            span{
                                padding: 1px 3px;
                                background-color: #C2E2FF;
                                border-radius: 2px;
                                font-size: 11px;
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
                                font-size: 11px;
                            }
                            em{
                                font-style: normal;
                                color: #f44336;
                                position: absolute;
                                right: 5px;
                                font-size: 15px;
                            }
                        }
                        div.info2Rent{
                            i{
                                color: #f44336;
                            }
                        }
                    }
                }
            }
        }
    }
</style>