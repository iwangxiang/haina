<template>
    <div class="calc">
        <nav-bar :title="msg" v-if="!isWeixin" class="publicHeader"></nav-bar>
        <div class="publicContent">
            <van-tabs animated>
                <van-tab title="商业贷款">
                    <business-loan></business-loan>
                </van-tab>
                <van-tab title="组合贷款">
                    <combination-loan></combination-loan>
                </van-tab>
                <van-tab title="公积金贷款">
                    <fund-loan></fund-loan>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script>
    import BusinessLoan from "../../components/calc/BusinessLoan"
    import FundLoan from "../../components/calc/FundLoan"
    import CombinationLoan from "../../components/calc/CombinationLoan"
    import navBar from "../../components/common/navBar.vue";

    export default {
        data(){
            return{
                msg:"贷款计算器"
            }
        },
        components: {
            BusinessLoan,
            FundLoan,
            CombinationLoan,
            navBar
        }
    }
</script>

