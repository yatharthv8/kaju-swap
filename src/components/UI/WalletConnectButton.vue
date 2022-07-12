<template>
  <button
    :class="{
      'button-disabled': $store.state.isLoading,
      'wallet-connect-button-eth-amt': !$store.state.isLoading,
    }"
    @click="onConnect()"
  >
    Connect Wallet
  </button>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    onConnect() {
      this.$store
        .dispatch("onConnect")
        .then(() => {
          this.$store.dispatch("displayMaxTokenBalance", {
            add: this.$store.state.swapDialog.DialnumAdd[0],
            ind: 0,
          });
          this.$store.dispatch("displayMaxTokenBalanceLiq", {
            add: this.$store.state.liquidityPageVar.liqDialog.DialnumAdd[0],
            ind: 0,
          });
          this.$store.dispatch("displayMaxTokenBalance", {
            add: this.$store.state.swapDialog.DialnumAdd[1],
            ind: 1,
          });
          this.$store.dispatch("displayMaxTokenBalanceLiq", {
            add: this.$store.state.liquidityPageVar.liqDialog.DialnumAdd[1],
            ind: 1,
          });
          // console.log("here", this.$store.state.swapDialog.DialnumAdd[1]);
          this.$store.dispatch("displayReserves", "swap");
        })
        .catch((err) => console.log(err));
    },
  },
  // created() {
  //   this.$store.dispatch("isConnectedToProvider");
  //   console.log("1");
  // },
};
</script>
