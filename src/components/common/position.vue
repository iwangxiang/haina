<template>
    <div class="position">
        <div>
            <h2 @click="goMap"><i>位置及周边配置</i><span><van-icon name="arrow" /></span></h2>
            <p style="display:none"><span>位置：</span>{{city}}{{area}}-{{xqTitle}}</p>
        </div>
        <div>
            <baidu-map class="bm-view" :center="center" :zoom="zoom" @ready="handler" @click="goMap" ref="Bmap">
                <bm-marker :position="center" :title="xqTitle" :dragging="false">
                    <bm-label :content="xqTitle" :labelStyle="{fontSize:'14px'}" :offset="{width:10,height:-12}"/>
                </bm-marker>
            </baidu-map>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                center: {lng:0, lat:0},
                zoom: 3,
                show: true,
                active: false
            }
        },
        props:['city','area','addr','xqTitle' ,'lng','lat'],
        methods:{
            handler({map}) {
                this.center.lng = this.lng;
                this.center.lat = this.lat;
                this.zoom = 15;
                map.disableDragging();
            },
            goMap(){
                this.$router.push({path:"/pages/home/map",query: {lng: this.lng,lat: this.lat}});
            }
        }
    }
</script>

<style type="text/css">
.BMapLabel{ margin-left:-50%; padding:1px 3px !important;
    border:1px solid #999 !important; border-radius:4px; border-bottom-left-radius:0px; }
</style>

<style scoped lang="less">
    .position{
        margin-top: 20px;
        >div:nth-child(1){
            width: 90%;
            margin: 0 auto;
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
                margin-top: 10px;
                font-size: 16px;
                color: #222222;
                span{
                    color: #999999;
                }
            }
        }
        .bm-view {
            width: 100%;
            height: 150px;
        }
        >div:nth-child(1){
            width: 90%;
            margin: 0 auto;
            h2{
                font-size: 19px;
                color: #222222;
            }
            p{
                margin-top: 10px;
                font-size: 16px;
                color: #222222;
                span{
                    color: #999999;
                }
            }
        }
        >div:nth-child(2){
            margin-top: 20px;
            position: relative;
            >div:nth-child(1) img{
                width: 100%;
                vertical-align: top;
            }
            >div:nth-child(2){
                width: 100%;
                height: 30px;
                line-height: 30px;
                background-color: #000;
                opacity: .8;
                position: absolute;
                bottom: 0;
                left: 0;
                h3{
                    width: 16.666666%;
                    float: left;
                    color: #fffefe;
                    font-weight: normal;
                    text-align: center;
                }

            }
        }
    }
</style>
