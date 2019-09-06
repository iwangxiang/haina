<template>
    <div class="map">
        <nav-bar :title="msg" v-if="!isWeixin" class="publicHeader"></nav-bar>
        <div class="publicContent">
            <div class="mapContent">
                <baidu-map class="bm-view" :center="{lng: lng, lat: lat}" :zoom="zoom" @ready="handler">
                    <bm-marker :position="{lng: lng, lat: lat}" :dragging="false" :icon="{url: fox, size: {width: 20, height: 27}}"></bm-marker>
                    <template v-for="(items,index) in list">
                        <bm-local-search :key="index" v-if="keywords_types[index].status" :keyword="items.type" :auto-viewport="false" :panel="false" :nearby="{center:location,radius:1000}" :location="location"></bm-local-search>
                    </template>
                </baidu-map>
                <div class="mapTitle">
                    <div class="mapTitleCont">
                        <h2 v-for="(items,index) in list" :key="index" :class="keywords_types[index].status ? 'active':''" @click="getItem(items.type,index)">
                            <i class="iconfont" :class="items.class"></i>
                            {{items.type}}
                        </h2>
                    </div>
                </div>
            </div>
            <footer-contact></footer-contact>
        </div>
    </div>
</template>

<script>
    import footerContact from "../../components/common/footerContact.vue";
    import navBar from "../../components/common/navBar.vue";

    export default {
        data(){
            return{
                msg:"百度地图",
                hasError:true,
                isActive:false,
                center: {lng: 0, lat: 0},
                lng:0,
                lat:0,
                zoom: 3,
                location:'',
                fox:require("../../assets/fox.png"),
                keywords_types:[],
                list:[
                    {type:"公交",class:"icongongjiao"},
                    {type:"地铁",class:"iconditie"},
                    {type:"学校",class:"iconxuexiao"},
                    {type:"医院",class:"iconyiyuan"},
                    {type:"银行",class:"iconyinghang"},
                    {type:"娱乐",class:"iconyule"},
                    {type:"购物",class:"icongouwu"}
                ]
            }
        },
        created(){
            this.lng = this.$route.query.lng;
            this.lat = this.$route.query.lat;
            this.location = {lng:this.lng,lat:this.lat} //this.lng+ ','+this.lat;
            //记录keywords_types的状态，默认不选中，点击状态取反，status为true时为选中状态(第一个公交为选中状态)
            this.list.forEach((item, index) => {
                this.keywords_types[index] = { status: index == 0 ? true: false, type: item.type };
            });
        },
        components:{
            navBar,
            footerContact
        },
        methods:{
            handler(){
                this.center.lng = this.lng;
                this.center.lat = this.lat;
                this.zoom = 15
            },
            getItem(type,index){
                //数组替换新的值
                this.keywords_types.splice(index, 1, {
                    status: !this.keywords_types[index].status,
                    type
                });
            }
        }
    }
</script>

<style scoped lang="less">
    .map{
        width: 100vw;
        height: 100vh;
        .mapContent{
            position: relative;
            .bm-view{
                width: 100vw;
                height: 100vh;
            }
            .mapTitle{
                width: 100%;
                height: 70px;
                background-color: #ffffff;
                position: fixed;
                bottom: 60px;
                left: 0;
                .mapTitleCont{
                    min-width: 320px;
                    max-width: 640px;
                    margin: 15px auto 0;
                    display: flex;
                    justify-content: space-between;
                    h2{
                        color: #666666;
                        font-size: 12px;
                        font-weight: normal;
                        display: flex;
                        flex-direction: column;
                        flex: 1;
                        align-items:center;
                        justify-content: center;
                        i{
                            font-size: 22px;
                        }
                    }
                    .active{
                        color: #3A66E9;
                    }
                }
            }
        }
    }
</style>
