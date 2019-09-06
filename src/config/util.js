export default {
    setStore:(name, content) => { //存储localStorage
        if (!name) return;
        if (typeof content !== 'string') {
            content = JSON.stringify(content);
        }
        window.localStorage.setItem(name, content);
    },
    getStore:name => { //获取localStorage
        if (!name) return; 
        var res = window.localStorage.getItem(name),
            nuls = ["null", "undefined" ,"{}"]; // , ""
        if(typeof res=='string' && nuls.indexOf(res)>=0){
            res = null;
        }
        return res;
    },
    removeStore:name => { //删除localStorage
        if (!name) return;
        window.localStorage.removeItem(name);
    },
    isWeixin:() => { //判断是否是微信端
        var ua = navigator.userAgent.toLowerCase();
        var isWX = ua.match(/MicroMessenger/i) == "micromessenger";
        return isWX;
    },
    isLocal:() => {
        var domain = document.domain;
        var dtab = ['10.', '127.', '172.', '192.168.', 'localhost'];
        for(var i=0;i<dtab.length;i++){
            if(domain.indexOf(dtab[i])===0){ return true; }
        }
        return false;
    },
    getUrlCode:() => { //截取微信授权回调redirect_uri中的code方法
        let url = window.location.search;
        let theRequest = {};
        if (url.indexOf("?") != -1) {
            let str = url.substr(1);
            let strs = str.split("&");
            for(let i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    },
    getMsgs:(data) => { // 模板消息-内容提取
        var msgs = data.msgs;
        if(data.type=='tpla'){ 
            var tabs = {'sale': '出售', 'rent': '出租'},
                msga = JSON.parse(msgs),
                title = msga['title'],
                type = tabs[msga['model']] ? tabs[msga['model']] : '未知';
            msgs = type+':'+title;
        }
        return msgs;
    },
    fmtTime:(time) => { // 时间格式化
        if(!time) time = parseInt(Date.parse(new Date())/1000);
        var D0 = new Date((time+8*3600)*1000), // 增加8小时
            D1 = new Date(), d0 = D0.toJSON(), d1 = D1.toJSON(); 
        if(!d0) return '--:--'; 
        if(d0.substr(0,10)==d1.substr(0,10)){ // 13:46:37
            return d0.substr(11,8);
        }else if(d0.substr(0,5)==d1.substr(0,5)){ // 04-23 12:30
            return d0.substr(5,11).replace('T',' ');
        }else{ // 2019-04-23 12:30
            return d0.substr(0,16).replace('T',' ');
        }
    },
    getCnow:(user) => { // 组装一个初始化聊天会员
        let cnow = {}
        if(user && user.id){ // && user.username
            let uid = 'haina_' + user.id // uname = item.admid ? item.realname : item.username,
            cnow = {uid, uname:user.username, thumb:user.thumb}
        }else{
            //function S4(){ return(((1+Math.random())*0x10000)|0).toString(36) }
            let kid = 'haina_guest', uid = window.localStorage.getItem(kid),
                s4 = (((1+Math.random())*0x10000)|0).toString(36),
                thumb = '' // http://haina.fzg360.com/static/images/noimg/demo_60x60.gif
            if(!uid || uid.length<5){
                uid = 'guest_'+parseInt(Date.parse(new Date())/1000).toString(36)+s4
                window.localStorage.setItem(kid, uid)
            } 
            cnow = {uid, uname:'游客_...'+uid.substr(-5), thumb}
        }
        return cnow;
    },
    goXiaoqu:(user, pid) => { // 跳转到小区首页
        if(!user || !user.id){
            let url = "https://www.haina.com/m/"+pid+"/cp/agRjzamXHXqR167LRB"
            window.location.href = url; //console.log(url)
        }
    },
    end:'-end-'  
}

/*

*/
