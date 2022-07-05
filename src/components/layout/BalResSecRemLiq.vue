<template>
  <div>Your Reserves in the Contract :</div>
  <div>
    <p>
      <span>{{ $store.state.removeLiquidityPage.symbol[0] }}: </span>
      {{ $store.state.removeLiquidityPage.liqToken0 }}
    </p>
    <p>
      <span>{{ $store.state.removeLiquidityPage.symbol[1] }}: </span>
      {{ $store.state.removeLiquidityPage.liqToken1 }}
    </p>
  </div>

  <div>
    Liquidity Added in this pair :
    <span>{{ $store.state.removeLiquidityPage.pairLiquidity }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>
