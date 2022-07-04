<template>
  <div>Your Balances :</div>
  <div>
    <p>
      <span>{{ $store.state.liquidityPageVar.liqTokenSymbol[0] }}: </span>
      {{ $store.state.liquidityPageVar.liqTokenBal[0] }}
    </p>
    <p>
      <span>{{ $store.state.liquidityPageVar.liqTokenSymbol[1] }}: </span>
      {{ $store.state.liquidityPageVar.liqTokenBal[1] }}
    </p>
  </div>
  <div>Your Reserves :</div>
  <div>
    <p>
      <span>{{ $store.state.liquidityPageVar.liqTokenSymbol[0] }}: </span>
      {{ $store.state.liquidityPageVar.liqTokenRes[0] }}
    </p>
    <p>
      <span>{{ $store.state.liquidityPageVar.liqTokenSymbol[1] }}: </span>
      {{ $store.state.liquidityPageVar.liqTokenRes[1] }}
    </p>
  </div>
  <div>
    Liquidity Added in this pair :
    <span>{{ $store.state.liquidityPageVar.pairLiquidity }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>
