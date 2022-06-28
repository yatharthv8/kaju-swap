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
      this.$store.dispatch("onConnect");
      this.$store.dispatch("displayMaxTokenBalance", {
        add: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
        ind: 0,
      });
    },
  },
  // created() {
  //   this.$store.dispatch("isConnectedToProvider");
  //   console.log("1");
  // },
};
</script>
