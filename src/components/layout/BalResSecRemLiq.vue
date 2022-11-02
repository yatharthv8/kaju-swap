<template>
  <div class="liquidity">
    <div class="card">
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
        Your share of LP Tokens in pool:
        <span>{{ $store.state.remLiquidity.pairLiquidityPer }}%</span>
      </div>
    </div>
    <div class="card" style="margin-bottom: 3rem">
      <div>Liquidity burned:</div>
      <div>
        <p>
          Amount of {{ symbolVal[0] }} to be recieved :
          {{ RemLiqPredictedVal[1] }}
        </p>
        <p>
          Amount of {{ symbolVal[1] }} to be recieved :
          {{ RemLiqPredictedVal[2] }}
        </p>
        <p>Liquidity decrement : {{ RemLiqPredictedVal[0] }}</p>
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
    ...mapGetters({
      remLiqTokenBalVal: "getRemLiqTokenBal",
      symbolVal: "getSymbol",
      RemLiqPredictedVal: "getRemLiqPredictedVal",
    }),
  },
};
</script>

<style scoped>
@media screen and (min-width: 700px) {
  .liquidity {
    display: flex;
    align-items: flex-start;
    justify-content: space-around;
  }
}
@media screen and (max-width: 700px) {
  .liquidity {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
  }
}
.card {
  margin: 1rem;
}
</style>
