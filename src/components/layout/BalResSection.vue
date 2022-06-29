<template>
  <div>Your Balances :</div>
  <div>
    <p>
      <span>{{ $store.state.swapTokenSymbol[0] }}: </span>
      {{ $store.state.tokenBalText[0] }}
    </p>
    <p>
      <span>{{ $store.state.swapTokenSymbol[1] }}: </span>
      {{ $store.state.tokenBalText[1] }}
    </p>
  </div>
  <div>Your Reserves :</div>
  <div>
    <p>
      <span>{{ $store.state.swapTokenSymbol[0] }}: </span>
      {{ $store.state.tokenReserves[0] }}
    </p>
    <p>
      <span>{{ $store.state.swapTokenSymbol[1] }}: </span>
      {{ $store.state.tokenReserves[1] }}
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>
