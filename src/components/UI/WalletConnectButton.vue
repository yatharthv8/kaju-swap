<template>
  <button class="wallet-connect-button-eth-amt" @click="onConnect()">
    Connect Wallet
  </button>
</template>

<script>
// import web3 from "../../../ethereum/web3.js";

export default {
  // data() {
  //   return {

  //   };
  // },
  methods: {
    onConnect() {
      console.log(
        "CWBD in WCB>>",
        this.$store.state.displayConnectWalletButton
      );
      this.$store.dispatch("toggleConnectWalletButton");
    },
  },
  // updated() {
  //   if (window.ethereum.isConnected()) {
  //     this.toggleConnectWalletButton();
  //     console.log(
  //       "displayConnectWalletButton >> ",
  //       this.displayConnectWalletButton
  //     );
  //   }
  // },
};
</script>
