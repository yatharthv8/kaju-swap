<template>
  <button
    :disabled="$store.state.operationUnderProcess"
    :class="{
      'button-disabled': $store.state.walletConnect.isLoading,
      'wallet-connect-button-eth-amt': !$store.state.walletConnect.isLoading,
    }"
    @click="onConnect()"
  >
    Connect Wallet
  </button>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      walletConnecting: false,
    };
  },
  methods: {
    onConnect() {
      this.$store.dispatch("toggleOperationUnderProcess", {
        val: true,
        location: "WalCon",
      });
      this.$store
        .dispatch("onConnect")
        .then(() => {
          this.$store.dispatch("displayMaxTokenBalance", {
            add: this.swapDialogVars.DialnumAdd[0],
            ind: 0,
          });
          this.$store.dispatch("displayMaxTokenBalanceLiq", {
            add: this.liqDialogVal.DialnumAdd[0],
            ind: 0,
          });
          this.$store.dispatch("displayMaxTokenBalance", {
            add: this.swapDialogVars.DialnumAdd[1],
            ind: 1,
          });
          this.$store.dispatch("displayMaxTokenBalanceLiq", {
            add: this.liqDialogVal.DialnumAdd[1],
            ind: 1,
          });
          this.$store.dispatch("displayReservesSwap");
          this.$store.dispatch("displayReservesPool");
        })
        .catch((err) => console.log(err))
        .then(() => {
          this.$store.dispatch("toggleOperationUnderProcess", {
            val: false,
            location: "WalCon",
          });
        });
    },
  },
  computed: {
    ...mapGetters({
      swapDialogVars: "getSwapDialog",
      liqDialogVal: "getLiqDialog",
    }),
  },
};
</script>
