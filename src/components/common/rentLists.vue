<template>
    <div>
        <div class="iListCont" v-for="item in list" :key="item.id" @click="detail(item.id)">
            <div>
                <img :src="item.thumb?item.thumb:defaultListImage">
            </div>
            <div>
                <h2>{{item.title}}</h2>
                <p>{{item.xiangq ? item.xiangq + '|' : ''}}{{item.area ? item.area +'㎡ | ' : ''}}{{item.cx}}</p>
                <div class="info1" v-if="item.tagsArr.length"><template v-for="(iitem,iindex) in item.tagsArr"><span :key="iindex" v-if="iindex < 3">{{iitem}}</span></template></div>
                <div class="info2"><i>{{item.price}}</i></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props:["list"],
        data(){
            return{
                defaultListImage:require("../../assets/defaultListImage.png")
            }
        },
        methods:{
            detail(id){
                this.$router.push({path: '../rent/detail', query: {id: id}});
            },
        }
    }
</script>

<style scoped lang="less">
    .iListCont{
        display: flex;
        justify-content:flex-start;
        margin-top: 20px;
        border-bottom: 1px solid #E5E5E5;
        padding-bottom: 18px;
        >div:nth-child(1){
            width: 125px;
            img{
                width: 125px;
                vertical-align: top;
            }
        }
        >div:nth-child(2){
            margin-left: 10px;
            position: relative;
            width: 205px;
            h2 {
                font-size: 16px;
                margin-bottom: 7px;
                color: #222222;
                font-weight: normal;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            p{
                font-size: 11px;
                margin-bottom: 6px;
                color: #999999;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            div.info1{
                margin-bottom: 2px;
                span{
                    background-color: #C2E2FF;
                    border-radius: 2px;
                    font-size: 11px;
                    color: #5FACFB;
                    margin-right: 8px;
                    padding: 0 5px;
                }
                >span:nth-child(1){
                    background-color: #FFCDD2;
                    color:#FA6C62;
                }
            }
            div.info2{
                display: flex;
                justify-content:space-between;
                width: 100%;
                position: absolute;
                bottom: 0;
                i{
                    color: #999999;
                    font-style: normal;
                    font-size: 11px;
                }
                em{
                    font-style: normal;
                    color: #f44336;
                    position: absolute;
                    right: 0px;
                    bottom: -2px;
                    font-size: 15px;
                }
            }
        }
    }
</style>
