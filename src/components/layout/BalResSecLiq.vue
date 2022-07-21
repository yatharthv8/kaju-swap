<template>
  <div class="liquidity">
    <div class="card">
      <div>Your Balances :</div>
      <div>
        <p>
          <span>{{ liqTokenSymbolVal[0] }}: </span>
          {{ liqTokenBalVal[0] }}
        </p>
        <p>
          <span>{{ liqTokenSymbolVal[1] }}: </span>
          {{ liqTokenBalVal[1] }}
        </p>
      </div>
      <div>Total Reserves in Contract :</div>
      <div>
        <p>
          <span>{{ liqTokenSymbolVal[0] }}: </span>
          {{ liqTokenResVal[0] }}
        </p>
        <p>
          <span>{{ liqTokenSymbolVal[1] }}: </span>
          {{ liqTokenResVal[1] }}
        </p>
      </div>
      <div>
        Your share of Liquidity Tokens in this pool:
        <span>{{ $store.state.addLiquidity.pairLiquidity }}</span>
      </div>
    </div>
    <div class="card">
      <div>Token amounts and liquidity that will be added:</div>
      <div>
        <p>
          Amount of {{ liqTokenSymbolVal[0] }} to be added :
          {{ $store.state.addLiquidity.predictedLiq[0] }}
        </p>
        <p>
          Amount of {{ liqTokenSymbolVal[1] }} to be added :
          {{ $store.state.addLiquidity.predictedLiq[1] }}
        </p>
        <p>
          Liquidity increament :
          {{ $store.state.addLiquidity.predictedLiq[2] }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    // liqPageVars() {
    //   return this.$store.getters.getLiquidityPageVars;
    // },
    // OR
    ...mapGetters({
      liqTokenResVal: "getLiqTokenRes",
      liqTokenBalVal: "getLiqTokenBal",
      liqTokenSymbolVal: "getLiqTokenSymbol",
    }),
  },
};
</script>

<style scoped>
.liquidity {
  display: flex;
}

.card {
  margin: 1rem;
}
</style>
