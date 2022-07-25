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
        <span>{{ $store.state.remLiquidity.pairLiquidity }}</span>
      </div>
    </div>
    <div class="card">
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
.liquidity {
  display: flex;
}

.card {
  margin: 1rem;
}
</style>
