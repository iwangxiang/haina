<template>
    <div>
        <van-field v-model="loanMoney" readonly="readonly"  center input-align="right" label="商贷金额" placeholder="请输入贷款金额" @touchstart.native.stop="loanMoneyShow = true">
            <template slot="button">
                <span class="custom-text">万元</span>
            </template>
        </van-field>
        <van-cell title="商贷年限" is-link :value="loanYear" @click="showYear=true" />
        <van-cell title="商贷利率" is-link :value="loanRate" @click="showRate=true" />
        <div class="iBtn">
            <van-button type="info" size="large" @click="calculate">开始计算</van-button>
        </div>
        <div class="iInfo">贷款利率仅供计算参考，实际交易利率折扣由银行评估</div>

        <van-number-keyboard
                :show="loanMoneyShow"
                extra-key="."
                close-button-text="完成"
                @blur="loanMoneyShow = false"
                @input="onInput"
                @delete="onDelete"
        />
        <van-popup v-model="showYear" position="bottom" :overlay="true">
            <van-picker show-toolbar title="请选择贷款年限" :columns="yearList" :default-index="19" @confirm="onConfirmYear" @cancel="showYear=false" />
        </van-popup>
        <van-popup v-model="showRate" position="bottom" :overlay="true">
            <van-picker show-toolbar title="请选择商业利率" :columns="rateList" @confirm="onConfirm" @cancel="showRate=false" />
        </van-popup>
    </div>
</template>

<script>
export default {
  data() {
    return {
        showRate:false,
        loanMoneyShow:false,
        showYear:false,
        loanMoney:100, //商贷金额
        loanYear:"20年(240期)", //商贷年限
        loanRate:"基准利率(4.9%)", //商贷利率
        actRate: 4.9 / 100,
        rateList: ['基准利率(4.9%)', '9折(4.41%)', '95折(4.655%)', '上浮5%(5.145%)', '上浮10%(5.39%)', '上浮15%(5.635%)', '上浮20%(5.88%)', '上浮25%(6.125%)', '上浮30%(6.37%)', '上浮35%(6.615%)', '上浮40%(6.86%)'],
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
    onInput(value) {
        this.loanMoney += value;
    },
    onDelete(){
        this.loanMoney = "";
    },
    onConfirmYear(value){
        this.showYear = false;
        this.loanYear = value;        
    },
    onConfirm(value) {
        this.showRate = false;
        this.loanRate = value;
    },
    calculate(){
        if(!this.loanMoney){
            this.$toast('请输入商贷金额');
            return;
        }
        let month = this.loanYear.match(/\((\S*)\)/);			
        let months = month[1].substr(0,month[1].length-1);
        let rate = this.loanRate.match(/\((\S*)\)/);
        this.actRate = Number.parseFloat((rate[1].substr(0,rate[1].length-1)/100).toFixed(5));
        //console.log(this.actRate);return;
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
