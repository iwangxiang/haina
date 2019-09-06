<template>
    <div class="interest">
        <div class="interestCont">
            <div class="interestContLeft">
                <van-circle
                        v-model="currentRate"
                        color="#ffb74d"
                        fill="#fff"
                        size="150px"
                        layer-color="#7cb342"
                        :rate="cicleRate"
                        :clockwise="false"
                        :stroke-width="60"
                        :text="text"
                />
            </div>
            <div class="interestContRight">
                <div>
                    <p>
                        <b><van-icon name="question" /></b>
                        <span>贷款总额(万)</span>
                    </p>
                    <i>{{calcResults.totalLoan}}</i>
                </div>
                <div>
                    <p>
                        <b><van-icon name="question" /></b>
                        <span>支付利息(万)</span>
                    </p>
                    <i>{{calcResults.totalRate}}</i>
                </div>
                <div v-if="calcResults.anjie">
                    <p>
                        <span>贷款期数(月)</span>
                    </p>
                    <i>{{calcResults.anjie}}</i>
                </div>
                <div v-if="calcResults.anjie_jijin">
                    <p>
                        <span>公积金贷款期数(月)</span>
                    </p>
                    <i>{{calcResults.anjie_jijin}}</i>
                </div>
                <div v-if="calcResults.anjie_shangye">
                    <p>
                        <span>商业贷款期数(月)</span>
                    </p>
                    <i>{{calcResults.anjie_shangye}}</i>
                </div>
            </div>
        </div>
        <div class="loanTitle">
            <table width="100%" border="1" bordercolor="#e5e5e5" cellpadding="0" cellspacing="0">
                <thead>
                    <tr>
                        <th width="10%">期数</th>
                        <th width="21.666%">月供总额</th>
                        <th width="21.666%">月供本金</th>
                        <th width="21.666%">月供利息</th>
                        <th width="25%">剩余本金</th>
                    </tr>
                </thead>
            </table>
        </div>
        <div class="loanDetail">
            <table width="100%" border="1" bordercolor="#e5e5e5" cellpadding="0" cellspacing="0">
                <tbody>
                    <tr v-for="(item,index) in monthList" :key="index">
                        <td width="10%">{{index+1}}</td>
                        <td width="21.666%">{{calcResults.perMonPay[index]}}</td>
                        <td width="21.666%">{{calcResults.perMonCap[index]}}</td>
                        <td width="21.666%">{{calcResults.perMonRate[index]}}</td>
                        <td width="25%">{{calcResults.lavaLoan[index]}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="loanInfo">
            <p>
                贷款利率仅供计算参考，实际交易利率折扣由银行评估
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                currentRate:0,
                cicleRate:0,
                monthList:[],
            }
        },
        mounted(){
            this.cicleRate = this.calcResults.totalRate / this.calcResults.totalPay * 100;
            for (let i = 0; i < this.calcResults.loan_mon; i++) {
                this.monthList.push(i);
            }
        },
        computed: {
            text() {
                return `
                    还款总额（万）${this.calcResults.totalPay}
                `
            }
        },
        props:['calcResults'],
    }
</script>

<style scoped lang="less">
    .interestCont{
        width: 90%;
        margin: 20px auto 0;
        .interestContLeft{
            float: left;
            font-size: 17px;
        }
        .interestContRight{
            float: right;
            div{
                text-align: center;
                margin-bottom: 10px;
                p{
                    margin-bottom: 5px;
                }
                b{
                    color: #7CB342;
                    position: relative;
                    top: 2px;
                }
                i{
                    font-style: normal;
                    font-size: 17px;
                }
                span{
                    margin-left: 5px;
                    font-size: 17px;
                    color: #666666;
                }
                &:nth-child(2){
                    b{
                        color: #FFB74D;
                        font-size: 12px;
                    }
                }
            }
        }
    }
    .interestCont:after{
        clear:both;
        content:'.';
        display:block;
        width: 0;
        height: 0;
        visibility:hidden;
    }
    .loanTitle{
        table{
            border-collapse:collapse;
            thead{
                background-color: #3A66E9;
                tr{
                    height: 30px;
                    th{
                        font-size: 11px;
                        font-weight: normal;
                        color: #ffffff;
                    }
                }
            }
        }
    }
    .loanDetail{
        height: 623px;
        overflow: auto;
        table{
            border-collapse:collapse;
            tbody{
                tr{
                    height: 40px;
                    td{
                        text-align: center;
                        font-size: 13px;
                        color: #383838;
                    }
                    &:nth-of-type(odd){
                        background-color: #F7F7F7;
                    }
                }
            }
        }
    }
    .loanInfo{
        padding: 10px 0;
        p{
            color: #9e9e9e;
            text-align: center;
            font-size: 14px;
        }
    }
</style>
