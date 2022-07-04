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
      this.$store.dispatch("onConnect").then(() => {
        this.$store.dispatch("displayMaxTokenBalance", {
          add: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
          ind: 0,
        });
        this.$store.dispatch("displayMaxTokenBalanceLiq", {
          add: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
          ind: 0,
        });
        // console.log("here", this.$store.state.account0);
        this.$store.dispatch("displayReserves", "swap");
      });
    },
  },
  // created() {
  //   this.$store.dispatch("isConnectedToProvider");
  //   console.log("1");
  // },
};
</script>
