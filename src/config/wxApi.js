/**
 * 微信js-sdk
 */
import wx from 'weixin-js-sdk';
import {getJssdk} from './api';

export default {
    wxShare:(title, desc, link, imgUrl) => {
        let url = window.location.href.split('#')[0]; //encodeURIComponent
        getJssdk(url).then(res =>{ // 获取签名
            if(res.code == 0){
                wx.config({
                    debug: false,
                    appId: res.data.appId,
                    timestamp: res.data.timestamp,
                    nonceStr: res.data.nonceStr,
                    signature: res.data.signature,
                    jsApiList: [
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'updateTimelineShareData',
                        'updateAppMessageShareData'
                    ]
                });
            }else{
                this.$toast(res.msg);
            }
        }).catch((res) => {
            this.$toast(res.msg);
        });
        wx.ready(function () {
            // 分享给朋友
            wx.onMenuShareAppMessage({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接
                imgUrl: imgUrl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    this.$toast('已分享给朋友');
                },
                cancel: function () {
                    this.$toast('取消分享朋友');// 用户取消分享后执行的回调函数
                },
                fail: function (res) {
                    this.$toast(JSON.stringify(res));
                }
            });
            // 分享到朋友圈
            wx.onMenuShareTimeline({
                title: title, // 分享标题
                link: link,
                imgUrl: imgUrl, // 分享图标
                success: function () {
                    this.$toast('已分享到朋友圈');
                },
                cancel: function () {
                    this.$toast('取消分享朋友圈');
                },
                fail: function (res) {
                    this.$toast(JSON.stringify(res));
                }
            });
            // 分享到QQ
            wx.onMenuShareQQ({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接
                imgUrl: imgUrl, // 分享图标
                success: function () {
                    this.$toast('已分享到qq');
                },
                cancel: function () {
                    this.$toast('取消分享到qq');
                }
            });
            // 分享到腾讯微博
            wx.onMenuShareWeibo({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接
                imgUrl: imgUrl, // 分享图标
                success: function () {
                    this.$toast('已分享到微博');
                },
                cancel: function () {
                    this.$toast('取消分享到微博');
                }
            });
            wx.updateAppMessageShareData({ //自定义“分享给朋友”及“分享到QQ”按钮的分享内容
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
                success: function () {// 设置成功
                    this.$toast('已分享给朋友');
                }
            });
            wx.updateTimelineShareData({ //自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
                title: title, // 分享标题
                link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
                success: function () { // 设置成功
                    this.$toast('已分享到朋友圈');
                }
            });            
        });
    }
}
