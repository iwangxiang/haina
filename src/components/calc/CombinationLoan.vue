<template>
    <div>
        <van-field v-model="totalMoney" readonly="readonly"  center input-align="right" label="贷款总额" placeholder="请输入贷款金额" @touchstart.native.stop="totalMoneyShow = true">
            <template slot="button">
                <span class="custom-text">万元</span>
            </template>
        </van-field>
        <van-field v-model="fundLoanMoney" readonly="readonly"  center input-align="right" label="公积金贷款额" placeholder="请输入贷款金额" @touchstart.native.stop="loanMoneyShow = true">
            <template slot="button">
                <span class="custom-text">万元</span>
            </template>
        </van-field>
        <van-cell title="公积金贷款年限" is-link :value="fundLoanYear" @click="showFundYear=true" />
        <van-cell title="公积金利率" is-link :value="fundLoanRate" @click="showFundRate=true" />

        <van-field v-model="restLoanMoney" readonly="readonly"  center input-align="right" label="商贷金额" placeholder="请输入贷款金额" @touchstart.native.stop="bloanMoneyShow = true">
            <template slot="button">
                <span class="custom-text">万元</span>
            </template>
        </van-field>
        <van-cell title="商贷年限" is-link :value="businessLoanYear" @click="showBusinessYear=true" />
        <van-cell title="商贷利率" is-link :value="businessLoanRate" @click="showBusinessRate=true" />
        <div class="iBtn">
            <van-button type="info" size="large" @click="calculate">开始计算</van-button>
        </div>
        <div class="iInfo">贷款利率仅供计算参考，实际交易利率折扣由银行评估</div>

        <van-number-keyboard
                :show="totalMoneyShow"
                extra-key="."
                close-button-text="完成"
                @blur="totalMoneyShow = false"
                @input="onInput2"
                @delete="onDelete2"
        />
        <van-number-keyboard
                :show="loanMoneyShow"
                extra-key="."
                close-button-text="完成"
                @blur="loanMoneyShow = false"
                @input="onInput3"
                @delete="onDelete3"
        />
        <van-number-keyboard
                :show="bloanMoneyShow"
                extra-key="."
                close-button-text="完成"
                @blur="bloanMoneyShow = false"
                @input="onInput4"
                @delete="onDelete4"
        />

        <van-popup v-model="showFundRate" position="bottom" :overlay="true">
            <van-picker show-toolbar title="请选择公积金利率" :columns="fundRateList" @confirm="onConfirm2" @cancel="showFundRate=false" />
        </van-popup>
        <van-popup v-model="showBusinessRate" position="bottom" :overlay="true">
            <van-picker show-toolbar title="请选择商业利率" :columns="businessRateList" @confirm="onConfirm3" @cancel="showBusinessRate=false" />
        </van-popup>
        
        
        <van-popup v-model="showFundYear" position="bottom" :overlay="true">
            <van-picker show-toolbar title="请选择贷款年限" :columns="fundYearList" :default-index="19" @confirm="onConfirmYear2" @cancel="showFundYear=false" />
        </van-popup>
        <van-popup v-model="showBusinessYear" position="bottom" :overlay="true">
            <van-picker show-toolbar title="请选择贷款年限" :columns="businessYearList" :default-index="19" @confirm="onConfirmYear3" @cancel="showBusinessYear=false" />
        </van-popup>
    </div>    
</template>

<script>
export default {
  data() {
    return {
        showFundRate:false,
        showBusinessRate:false,
        totalMoneyShow:false,
        loanMoneyShow:false,
        bloanMoneyShow:false,
        showFundYear:false,
        showBusinessYear:false,
        totalMoney:150, //贷款总额
        fundLoanMoney:"", //公积金贷款金额
        businessLoanMoney:"", //商业贷款金额
        fundLoanYear:"20年(240期)", //公积金贷款年限
        businessLoanYear:"20年(240期)", //商贷年限
        fundLoanRate:"基准利率(3.25%)", //公积金贷款利率
        actFundRate:0.0325,        
        businessLoanRate:"基准利率(4.9%)", //商贷利率
        actBusinessRate:0.049,
        fundRateList: ['基准利率(3.25%)', '上浮10%(3.575%)', '上浮15%(3.7375%)', '上浮20%(3.9%)', '上浮30%(4.225%)'],
        businessRateList: ['基准利率(4.9%)', '9折(4.41%)', '95折(4.655%)', '上浮5%(5.145%)', '上浮10%(5.39%)', '上浮15%(5.635%)', '上浮20%(5.88%)', '上浮25%(6.125%)', '上浮30%(6.37%)', '上浮35%(6.615%)', '上浮40%(6.86%)'],
        fundYearList:[],
        businessYearList:[],
    };
  },
  components: {
    
  },
  mounted() {
    for (let i = 1; i < 31; i++) {
        this.fundYearList.push(i + "年" + "(" + i * 12 + "期)");
        this.businessYearList.push(i + "年" + "(" + i * 12 + "期)");
    }
  },  
  computed: {    
    restLoanMoney() {
        if(this.totalMoney && this.fundLoanMoney){
            if(this.fundLoanMoney > this.totalMoney){
                this.$toast('公积金贷款额不能大于贷款总额');
                return;
            }            
            return this.totalMoney - this.fundLoanMoney;
        }else return '';        
    },
  },
  watch: {
    fundLoanMoney() {
        this.businessLoanMoney = Number.parseFloat(this.totalMoney - this.fundLoanMoney);
    }
  },
  methods: {
    onConfirm2(value) {
        this.showFundRate = false;
        this.fundLoanRate = value;
    },
    onConfirm3(value) {
        this.showBusinessRate = false;
        this.businessLoanRate = value;
    },
    onConfirmYear2(value){
        this.showFundYear = false;
        this.fundLoanYear = value;
    },
    onConfirmYear3(value){
        this.showBusinessYear = false;
        this.businessLoanYear = value;
    },
    onInput2(value) {
        this.totalMoney += value;
    },
    onDelete2(){
        this.totalMoney="";
    },
    onInput3(value) {
        this.fundLoanMoney += value;
    },
    onDelete3(){
        this.fundLoanMoney = "";
    },
    onInput4(value) {
        this.businessLoanMoney += value;
    },
    onDelete4(){
        this.businessLoanMoney = "";
    },
    calculate(){
        if(!this.totalMoney){
            this.$toast('请输入贷款总额');
            return;
        }
        if(!this.fundLoanMoney){
            this.$toast('请输入公积金贷款额');
            return;
        }
        let fundMonth = this.fundLoanYear.match(/\((\S*)\)/);			
        let fundMonths = fundMonth[1].substr(0,fundMonth[1].length-1);
        let businessMonth = this.businessLoanYear.match(/\((\S*)\)/);			
        let businessMonths = businessMonth[1].substr(0,businessMonth[1].length-1);
        let fundRate = this.fundLoanRate.match(/\((\S*)\)/);
        this.actFundRate = Number.parseFloat((fundRate[1].substr(0,fundRate[1].length-1)/100).toFixed(6));
        let businessRate = this.businessLoanRate.match(/\((\S*)\)/);
        this.actBusinessRate = Number.parseFloat((businessRate[1].substr(0,businessRate[1].length-1)/100).toFixed(5));
        this.$router.push({
            path: "../../pages/calcu/res",
            query: {
                isZuhe:1,
                totalMoney:Number.parseFloat(this.totalMoney).toFixed(2), //贷款总额
                loanMoney:Number.parseFloat(this.fundLoanMoney).toFixed(2), //公积金贷款金额
                businessLoanMoney:Number.parseFloat(this.businessLoanMoney).toFixed(2), //商业贷款金额
                months:fundMonths, //公积金贷款年限
                businessMonths:businessMonths, //商业贷款年限
                rate:this.actFundRate, //公积金贷款利率
                businessRate:this.actBusinessRate, //商业贷款利率
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
