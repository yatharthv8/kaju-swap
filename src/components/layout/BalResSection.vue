<template>
  <div>Your Balances :</div>
  <div>
    <p>
      <span>{{ swapTokenSymbolVal[0] }}: </span>
      {{ tokenBalTextVal[0] }}
    </p>
    <p>
      <span>{{ swapTokenSymbolVal[1] }}: </span>
      {{ tokenBalTextVal[1] }}
    </p>
  </div>
  <div>Your Reserves in Contract :</div>
  <div>
    <p>
      <span>{{ swapTokenSymbolVal[0] }}: </span>
      {{ tokenReservesVal[0] }}
    </p>
    <p>
      <span>{{ swapTokenSymbolVal[1] }}: </span>
      {{ tokenReservesVal[1] }}
    </p>
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
      swapTokenSymbolVal: "getSwapTokenSymbol",
      tokenBalTextVal: "getTokenBalText",
      tokenReservesVal: "getTokenReserves",
    }),
  },
};
</script>
