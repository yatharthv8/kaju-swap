<template>
  <div>Your Balances :</div>
  <div>
    <p>
      <span>{{ liqPageVars.liqTokenSymbol[0] }}: </span>
      {{ liqPageVars.liqTokenBal[0] }}
    </p>
    <p>
      <span>{{ liqPageVars.liqTokenSymbol[1] }}: </span>
      {{ liqPageVars.liqTokenBal[1] }}
    </p>
  </div>
  <div>Your Reserves in Contract :</div>
  <div>
    <p>
      <span>{{ liqPageVars.liqTokenSymbol[0] }}: </span>
      {{ liqPageVars.liqTokenRes[0] }}
    </p>
    <p>
      <span>{{ liqPageVars.liqTokenSymbol[1] }}: </span>
      {{ liqPageVars.liqTokenRes[1] }}
    </p>
  </div>
  <div>
    Liquidity Added in this pair :
    <span>{{ liqPageVars.pairLiquidity }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    liqPageVars() {
      return this.$store.getters.getLiquidityPageVars;
    },
  },
};
</script>
