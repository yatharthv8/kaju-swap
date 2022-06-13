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
    },
  },
  // created() {
  //   this.$store.dispatch("isConnectedToProvider");
  //   console.log("1");
  // },
};
</script>
