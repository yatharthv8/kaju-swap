<template>
  <button class="wallet-connect-button-eth-amt" @click="onConnect()">
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
