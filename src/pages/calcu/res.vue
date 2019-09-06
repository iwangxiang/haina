<template>
    <div class="calcResult">
        <nav-bar :title="msg" v-if="!isWeixin" class="publicHeader"></nav-bar>
        <div class="publicContent">
            <van-tabs @click="switchItem">
                <van-tab title="等额本息">
                    <interest :calcResults="calcResults"></interest>
                </van-tab>
                <van-tab title="等额本金">
                    <cash v-if="index == 1" :calcResults="calcResults"></cash>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script>
    import interest from "../../components/calc/ResInterest.vue";
    import cash from "../../components/calc/ResCash.vue";
    import navBar from "../../components/common/navBar.vue";

    export default {
        data(){
            return{
                loanMoney:'', //贷款金额
                months:'', //贷款年限
                rate:'', //贷款利率
                index: 0, //等额本息或等额本金
                isZuhe: 0, //是否组合贷款
                totalMoney:'', //组合贷款总额
                businessLoanMoney:"", //组合贷款的商业贷款金额
                businessMonths:'', //组合贷款的商业贷款年限
                businessRate:'', //组合贷款的商业贷款利率
                calcResults:{}, //计算结果
                msg:"计算结果"
            }
        },
        components:{
            interest,
            cash,
            navBar
        },
        mounted(){
            this.loanMoney = this.$route.query.loanMoney;
            this.months = this.$route.query.months;
            this.rate = this.$route.query.rate;
            if(this.$route.query.isZuhe){
                this.isZuhe = this.$route.query.isZuhe;
                this.businessLoanMoney = this.$route.query.businessLoanMoney;
                this.businessMonths = this.$route.query.businessMonths;
                this.businessRate = this.$route.query.businessRate;
            }
            if(this.isZuhe){
                let fundResults = {},businessResults = {};
                fundResults = this.benxiResult(this.loanMoney,this.rate,this.months);
                businessResults = this.benxiResult(this.businessLoanMoney,this.businessRate,this.businessMonths);
                this.calcResults = this.getZuheResult(fundResults, businessResults);                
            }else this.calcResults = this.benxiResult(this.loanMoney,this.rate,this.months);
        },
        methods:{
            switchItem(index){
                this.index = index;
                if(this.isZuhe){ //组合贷款
                    let fundResults = {},businessResults = {};
                    if(index == 1){//切换tab为等额本金
                        fundResults = this.benjinResult(this.loanMoney,this.rate,this.months);
                        businessResults = this.benjinResult(this.businessLoanMoney,this.businessRate,this.businessMonths);
                    }else{//切换tab为等额本息
                        fundResults = this.benxiResult(this.loanMoney,this.rate,this.months);
                        businessResults = this.benxiResult(this.businessLoanMoney,this.businessRate,this.businessMonths);                        
                    }
                    this.calcResults = this.getZuheResult(fundResults, businessResults);                              
                }else{ //商业贷款或公积金贷款
                    this.calcResults = index == 1 ? this.benjinResult(this.loanMoney,this.rate,this.months) : this.benxiResult(this.loanMoney,this.rate,this.months);
                }
            },
            benxiResult(loanMoney,rate,months) { //等额本息
                let calcResults = {};
                let rateMonth = rate / 12;
                let vagPay = (loanMoney * 10000 * rateMonth * Math.pow(1 + rateMonth, months) / (Math.pow(1 + rateMonth, months) - 1));
                calcResults.anjie = months / 12 + "年(" + months + "期)";
                calcResults.lilv = rate;//贷款利率
                calcResults.loan_mon = months;//贷款期数
                calcResults.totalLoan = loanMoney; //贷款总额
                calcResults.perMonPay = this.getBenxiMonthMoney(loanMoney,rate,months); //月供
                calcResults.totalPay = (vagPay * months / 10000).toFixed(2); //还款总额
                calcResults.totalRate = (calcResults.totalPay - calcResults.totalLoan).toFixed(2); //支付利息
                calcResults.perMonCap = this.getPerMonCap(loanMoney*10000, rate, months, vagPay); //月供本金
                calcResults.perMonRate = this.getDengxPerRate(months, vagPay, calcResults.perMonCap); //月供利息
                calcResults.lavaLoan = this.getDengxLavaLoan(loanMoney*10000, calcResults.perMonCap); //剩余贷款
                calcResults.perMonAvg = vagPay.toFixed(2); //月均还款
                return calcResults;
            },
            benjinResult(loanMoney,rate,months) { //等额本金
                let calcResults = {};
                /*let rateMonth = rate / 12;
                let vagPay = (loanMoney * 10000 * rateMonth * Math.pow(1 + rateMonth, months) / (Math.pow(1 + rateMonth, months) - 1));*/              
                calcResults.anjie = months / 12 + "年(" + months + "期)";                
                calcResults.lilv = rate; //贷款利率
                calcResults.loan_mon = months;//贷款期数
                calcResults.totalLoan = loanMoney; //贷款总额
                calcResults.perMonPay = this.getBenjinMonthMoney(loanMoney,rate,months); //月供
                calcResults.perMonRate = this.getBenjPerMonRate(calcResults.perMonPay, loanMoney*10000); //月供利息
                calcResults.totalRate = (this.getBenjTotalRate(calcResults.perMonRate)/10000).toFixed(2); //支付利息
                calcResults.totalPay = Number.parseFloat((loanMoney * 10000 + this.getBenjTotalRate(calcResults.perMonRate))/10000).toFixed(2); //还款总额
                calcResults.perMonCap = this.getBenjPerMonCap(loanMoney,months); //月供本金
                calcResults.perMonAvg = (Number.parseFloat(loanMoney * 10000 + this.getBenjTotalRate(calcResults.perMonRate)) / months).toFixed(2); //月均还款
                calcResults.lavaLoan = this.getBenjLavaLoan(loanMoney * 10000, calcResults.perMonCap, months); //剩余贷款
                return calcResults;
            },
            getBenxiMonthMoney(loanMoney,rate,months) { //计算等额本息月供，返回值为数组
                let result = [];
                let rateMonth = rate / 12;
                let rel = (loanMoney * 10000 * rateMonth * Math.pow(1 + rateMonth, months) / (Math.pow(1 + rateMonth, months) - 1)).toFixed(2);
                for (let i = 0; i < months; i++) {
                    result[i] = rel;
                }
                return result;
            },
            getPerMonCap(totalLoan, lilv, mon, yueg) {//获取每月支付本金额的函数，返回值为数组
                let result = [];
                result[0] = (yueg - totalLoan * lilv / 12).toFixed(2);
                for (let i = 1; i < mon; i++) {
                    totalLoan = totalLoan - result[i - 1];
                    result[i] = (yueg - totalLoan * lilv / 12).toFixed(2);
                }
                return result;
            },            
            getDengxPerRate(mon, yueg, perMonCap) {//获取每月利息额的函数，返回值为数组
                let result = [];
                for (let i = 0; i < mon; i++) {
                    result[i] = (yueg - perMonCap[i]).toFixed(2);
                }
                return result;
            },
            getDengxLavaLoan(totalLoan, perMonCap) {//根据贷款总额减去已还的本金，算出剩余的贷款
                let result = [];
                result[0] = Number(totalLoan).toFixed(2);
                for (let i = 1; i < perMonCap.length; i++) {
                    result[i] = (result[i - 1] - perMonCap[i]).toFixed(2) < 0 ? 0 : (result[i - 1] - perMonCap[i]).toFixed(2);
                }
                return result;
            },
            getBenjinMonthMoney(loanMoney,rate,months) { //计算等额本金月供，返回值为数组
                let result = [];
                let rateMonth = rate / 12;
                let benjin_month = loanMoney * 10000 / months;
                for (let i = 0; i < months; i++) {
                    result[i] = ((loanMoney * 10000 - i * benjin_month) * rateMonth + benjin_month).toFixed(2);
                }
                return result;
            },            
            getBenjPerMonRate(perMonthPay, total) { //算取每个月的利息额
                let result = [];
                let len = perMonthPay.length;
                let benjin_month = total / len;
                for (let i = 0; i < len; i++) {
                    result[i] = (perMonthPay[i] - benjin_month).toFixed(2);
                }
                return result;
            },            
            getBenjTotalRate(perMonRate) {//获取总利息额
                let result = 0;
                let len = perMonRate.length;
                for (let i = 0; i < len; i++) {
                    result += Number.parseFloat(perMonRate[i]);
                }
                return result;
            },
            getBenjPerMonCap(loanMoney,months) { //月供本金
                let result = [];
                let cap = (loanMoney*10000 / months).toFixed(2);
                for (let i = 0; i < this.months; i++) {
                    result[i] = cap;
                }
                return result;
            },
            getBenjLavaLoan(totalLoan, perMonCap, loan_mon) {//获取每月支付本金额的函数，返回值为数组
                let result = [];
                let len = loan_mon;
                let Cap = perMonCap[0];
                result[0] = Number.parseFloat(totalLoan).toFixed(2);
                for (let i = 1; i < len; i++) {
                    result[i] = Number.parseFloat(result[i - 1] - Cap).toFixed(2);
                }
                return result;
            },
            getZuheResult(jijinRes, shangyeRes) { //组合贷款
                let jijinResult = Object.assign({},jijinRes); //$.extend(true, {}, jijinRes);
                let shangyeResult = Object.assign({},shangyeRes); //$.extend(true, {}, shangyeRes);
                let zuhe_result = {};
                zuhe_result.loan_mon = jijinResult.loan_mon > shangyeResult.loan_mon ? jijinResult.loan_mon : shangyeResult.loan_mon;
                zuhe_result.anjie_jijin = jijinResult.anjie;
                zuhe_result.anjie_shangye = shangyeResult.anjie;
                zuhe_result.lilv_jijin = jijinResult.lilv;
                zuhe_result.lilv_shangye = shangyeResult.lilv;
                zuhe_result.totalLoan = (Number.parseFloat(jijinResult.totalLoan) + Number.parseFloat(shangyeResult.totalLoan)).toFixed(2);
                zuhe_result.totalPay = Number.parseFloat(jijinResult.totalPay) + Number.parseFloat(shangyeResult.totalPay);
                zuhe_result.totalRate = (Number.parseFloat(jijinResult.totalRate) + Number.parseFloat(shangyeResult.totalRate)).toFixed(2);
                zuhe_result.perMonPay = this.formatLavaLoan(this.getZuhePerMonPay(jijinResult, shangyeResult));
                zuhe_result.perMonAvg = this.formatLavaLoan(this.getZuheMonAvg(zuhe_result.loan_mon, zuhe_result.totalPay*10000));
                zuhe_result.perMonRate = this.formatLavaLoan(this.getZuhePerMonRate(jijinResult, shangyeResult));
                zuhe_result.perMonCap = this.getZuhePerMonCap(jijinResult, shangyeResult);
                zuhe_result.lavaLoan = this.formatLavaLoan(this.getZuhelavaLoan(zuhe_result.perMonCap, zuhe_result.totalLoan*10000, zuhe_result.loan_mon));
                zuhe_result.perMonCap = this.formatLavaLoan(this.getZuhePerMonCap(jijinResult, shangyeResult));
                zuhe_result.totalPay = (Number.parseFloat(jijinResult.totalPay) + Number.parseFloat(shangyeResult.totalPay)).toFixed(2);
                return zuhe_result;
            },            
            getZuhePerMonPay(jijin, shengye) {//求得每个月月供---数组
                let result = Object.assign({},jijin.loan_mon > shengye.loan_mon ? jijin.perMonPay : shengye.perMonPay);
                let temp = Object.assign({},jijin.loan_mon > shengye.loan_mon ? shengye.perMonPay : jijin.perMonPay);
                let loan_mon = jijin.loan_mon < shengye.loan_mon ? jijin.loan_mon : shengye.loan_mon;
                let len = jijin.loan_mon < shengye.loan_mon ? shengye.loan_mon : jijin.loan_mon;
                for (let i = 0; i < loan_mon; i++) {
                    result[i] = (Number.parseFloat(result[i]) + Number.parseFloat(temp[i])).toFixed(2);
                }
                result.length = len;
                return result;
            },
            formatLavaLoan(lavaLoan) {//转换剩余贷款额
                let len = Number.parseInt(lavaLoan).length;
                for (let i = 0; i < len; i++) {
                    lavaLoan[i] = Number.parseFloat(lavaLoan[i]).toFixed(2);
                }
                return lavaLoan;
            },
            formatNum(strNum) {//格式化为金钱格式
                if (strNum.length <= 3) {
                    return strNum;
                }
                if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(strNum)) {
                    return strNum;
                }
                let a = RegExp.$1, b = RegExp.$2, c = RegExp.$3;
                let re = new RegExp();
                re.compile("(\\d)(\\d{3})(,|$)");
                while (re.test(b)) {
                    b = b.replace(re, "$1,$2$3");
                }
                return a + "" + b + "" + c;
            },
            getZuheMonAvg(loan_mon, totalPay) {//求得每个月月供的均值
                return Number.parseFloat(totalPay / loan_mon).toFixed(2);
            },
            getZuhePerMonRate(jijin, shangye) {//计算每个月的利息---数组
                let result = Object.assign({},jijin.loan_mon > shangye.loan_mon ? jijin.perMonRate : shangye.perMonRate); //$.extend(true, {}, jijin.loan_mon > shangye.loan_mon ? jijin.perMonRate : shangye.perMonRate);
                let temp = Object.assign({},jijin.loan_mon > shangye.loan_mon ? shangye.perMonRate : jijin.perMonRate); //$.extend(true, {}, jijin.loan_mon > shangye.loan_mon ? shangye.perMonRate : jijin.perMonRate);
                let loan_mon = jijin.loan_mon < shangye.loan_mon ? jijin.loan_mon : shangye.loan_mon;
                let len = jijin.loan_mon < shangye.loan_mon ? shangye.loan_mon : jijin.loan_mon;
                for (let i = 0; i < loan_mon; i++) {
                    result[i] = (Number.parseFloat(result[i]) + Number.parseFloat(temp[i])).toFixed(2);
                }
                result.length = len;
                return result;
            },
            getZuhePerMonCap(jijin, shengye) {//计算每个月交出的本金额 ---数组
                let result = Object.assign({},jijin.loan_mon > shengye.loan_mon ? jijin.perMonCap : shengye.perMonCap); //$.extend(true, {}, jijin.loan_mon > shengye.loan_mon ? jijin.perMonCap : shengye.perMonCap);
                let temp = Object.assign({},jijin.loan_mon > shengye.loan_mon ? shengye.perMonCap : jijin.perMonCap); //$.extend(true, {}, jijin.loan_mon > shengye.loan_mon ? shengye.perMonCap : jijin.perMonCap);
                let loan_mon = jijin.loan_mon < shengye.loan_mon ? jijin.loan_mon : shengye.loan_mon;
                let len = jijin.loan_mon < shengye.loan_mon ? shengye.loan_mon : jijin.loan_mon;
                for (let i = 0; i < loan_mon; i++) {
                    result[i] = (Number.parseFloat(result[i]) + Number.parseFloat(temp[i])).toFixed(2);
                }
                result.length = len;
                return result;
            },
            getZuhelavaLoan(zuhePerMonPay, zuheTotalLoan, zuheLoan_mon) {//计算每个月的剩余贷款额 ---数组
                let result = [];
                result[0] = Number.parseFloat(zuheTotalLoan).toFixed(2);
                for (let i = 1; i < zuheLoan_mon; i++) {
                    result[i] = (Number.parseFloat(result[i - 1]) - Number.parseFloat(zuhePerMonPay[i])).toFixed(2);
                }
                return result;
            }
        }
    }
</script>

