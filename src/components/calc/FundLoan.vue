<template>
    <div>
        <van-field v-model="loanMoney" readonly="readonly"  center input-align="right" label="公积金贷款额" placeholder="请输入贷款金额" @touchstart.native.stop="loanMoneyShow = true">
            <template slot="button">
                <span class="custom-text">万元</span>
            </template>
        </van-field>
        <van-cell title="公积金贷款年限" is-link :value="loanYear" @click="showFundYear=true" />
        <van-cell title="公积金利率" is-link :value="loanRate" @click="showRate=true" />
        <div class="iBtn">
            <van-button type="info" size="large" @click="calculate">开始计算</van-button>
        </div>
        <div class="iInfo">贷款利率仅供计算参考，实际交易利率折扣由银行评估</div>

        <van-number-keyboard
            :show="loanMoneyShow"
            extra-key="."
            close-button-text="完成"
            @blur="loanMoneyShow = false"
            @input="onInput5"
            @delete="onDelete5"
        />

        <van-popup v-model="showFundYear" position="bottom" :overlay="true">
            <van-picker show-toolbar title="请选择贷款年限" :columns="yearList" :default-index="19" @confirm="onConfirmYear4" @cancel="showFundYear=false" />
        </van-popup>

        <van-popup v-model="showRate" position="bottom" :overlay="true">
            <van-picker show-toolbar title="请选择公积金利率" :columns="rateList" @confirm="onConfirm4" @cancel="showRate=false" />
        </van-popup>
    </div>    
</template>

<script>
export default {
  data() {
    return {
        showRate:false,
        showFundYear:false,
        loanMoneyShow:false,
        loanMoney:80, //公积金贷款金额
        loanYear:"20年(240期)", //公积金贷款年限
        loanRate:"基准利率(3.25%)", //公积金贷款利率
        actRate: 3.25 / 100,
        rateList: ['基准利率(3.25%)', '上浮10%(3.575%)', '上浮15%(3.7375%)', '上浮20%(3.9%)', '上浮30%(4.225%)'],
        yearList:[],
    };
  },
  components: {
    
  },
  mounted() {
    for (let i = 1; i < 31; i++) {
        this.yearList.push(i + "年" + "(" + i * 12 + "期)");
    }
  },
  computed: {    
    
  },
  methods: {
    onInput5(value) {
        this.loanMoney += value;
    },
    onDelete5(){
        this.loanMoney = "";
    },
    onConfirm4(value) {
        this.showRate = false;
        this.loanRate = value;
    },
    onConfirmYear4(value){
        this.showFundYear = false;
        this.loanYear = value;
    },
    calculate(){
        if(!this.loanMoney){
            this.$toast('请输入公积金贷款额');
            return;
        }
        let month = this.loanYear.match(/\((\S*)\)/);			
        let months = month[1].substr(0,month[1].length-1);
        let rate = this.loanRate.match(/\((\S*)\)/);
        this.actRate = Number.parseFloat((rate[1].substr(0,rate[1].length-1)/100).toFixed(6));
        this.$router.push({
            path: "../../pages/calcu/res",
            query: {
                loanMoney:Number.parseFloat(this.loanMoney).toFixed(2),
                months:months,
                rate:this.actRate
            }
        });
    }
  }
};
</script>

<style scoped lang="less">
    .iBtn{
        width: 90%;
        margin: 27px auto 0;
    }
    .iInfo{
        font-size: 14px;
        text-align: center;
        margin-top: 10px;
        color: #9e9e9e;
    }
    .custom-text{
        color: #323233;
    }
</style>
