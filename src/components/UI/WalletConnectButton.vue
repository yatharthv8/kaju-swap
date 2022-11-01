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
const { ethereum } = window;

import { mapGetters } from "vuex";
import web3 from "../../../ethereum/web3.js";
import * as chains from "../../constants/chains.js";
import swal from "sweetalert";

export default {
  data() {
    return {
      walletConnecting: false,
      // checkDone: false,
    };
  },
  methods: {
    async checkIfConnected() {
      // this.checkDone = true;
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts && accounts.length > 0) {
        await ethereum.request({ method: "eth_chainId" }).then((networkHex) => {
          this.$store.state.network =
            chains.Hex[Number(networkHex[networkHex.length - 1])];
          if (networkHex != "0x5") {
            // console.log(networkHex);
            swal(
              "Alert",
              "Kindly change to GÖRLI Network to use the app!",
              "warning"
            );
          }
        });
        this.$store.state.account0 = accounts[0];
        this.$store.dispatch("registerExistingLiquidity");
        this.$store.state.balance = parseFloat(
          web3.utils.fromWei(
            await web3.eth.getBalance(this.$store.state.account0),
            "ether"
          )
        ).toFixed(2);
        this.walletConnectInitializations();
        console.log("user is connected");
        this.$store.dispatch("toggleConnectWalletButton", true);
      } else {
        console.log("user not connected");
        this.onConnect();
      }
      // console.log(this.checkDone);
      // this.onConnect();
    },

    walletConnectInitializations() {
      this.$store.dispatch("displayMaxTokenBalance", {
        add: this.swapDialogVars.DialnumAdd[0],
        ind: 0,
        marker: true,
      });
      this.$store.dispatch("displayMaxTokenBalanceLiq", {
        add: this.liqDialogVal.DialnumAdd[0],
        ind: 0,
      });
      this.$store.dispatch("displayMaxTokenBalance", {
        add: this.swapDialogVars.DialnumAdd[1],
        ind: 1,
        marker: true,
      });
      this.$store.dispatch("displayMaxTokenBalanceLiq", {
        add: this.liqDialogVal.DialnumAdd[1],
        ind: 1,
      });
      // this.$store.state.symLP = [];
      this.$store.dispatch("displayReservesSwap");
      this.$store.dispatch("displayReservesPool");
      // this.$store.dispatch("conversionRateSwap");
    },

    onConnect() {
      this.$store.state.disconnect = false;
      this.$store.dispatch("toggleOperationUnderProcess", {
        val: true,
        location: "WalCon",
      });
      this.$store
        .dispatch("onConnect")
        .then(() => {
          this.walletConnectInitializations();
        })
        .catch((err) => console.log(err))
        .then(() => {
          // console.log("ok");
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
  mounted() {
    //   console.log("this is the mounted");
    //   console.log(typeof this.$store.state.account0);
    // if (!this.checkDone) {
    if (
      this.$store.state.account0 === null &&
      !this.$store.state.disconnect &&
      !this.$store.state.checkDone
    ) {
      this.$store.state.checkDone = true;
      // console.log("here");
      this.checkIfConnected();
    }
    // }
  },
};
</script>
