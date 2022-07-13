<template>
  <div>Your Balances :</div>
  <div>
    <p>
      <span>{{ symbolVal[0] }}: </span>
      {{ remLiqTokenBalVal[0] }}
    </p>
    <p>
      <span>{{ symbolVal[1] }}: </span>
      {{ remLiqTokenBalVal[1] }}
    </p>
  </div>

  <div>
    Your share of Liquidity Tokens in this pool:
    <span>{{ $store.state.remLiquidity.pairLiquidity }}</span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      remLiqTokenBalVal: "getRemLiqTokenBal",
      symbolVal: "getSymbol",
    }),
  },
};
</script>
