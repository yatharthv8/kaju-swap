<template>
  <div>Your Reserves in the Contract :</div>
  <div>
    <p>
      <span>{{ remLiqPageVars.symbol[0] }}: </span>
      {{ remLiqPageVars.liqToken0 }}
    </p>
    <p>
      <span>{{ remLiqPageVars.symbol[1] }}: </span>
      {{ remLiqPageVars.liqToken1 }}
    </p>
  </div>

  <div>
    Liquidity Added in this pair :
    <span>{{ remLiqPageVars.pairLiquidity }}</span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({ remLiqPageVars: "getRemoveLiquidityPageVars" }),
  },
};
</script>
