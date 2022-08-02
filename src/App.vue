<template>
  <div class="wrapper">
    <TheHeader></TheHeader>
    <base-spinner v-if="$store.state.operationUnderProcess"></base-spinner>
    <router-view></router-view>
    <TheFooter></TheFooter>
  </div>
</template>

<script>
const { ethereum } = window;

import { mapGetters } from "vuex";
import TheHeader from "./components/layout/TheHeader.vue";
import TheFooter from "./components/layout/TheFooter.vue";

export default {
  components: { TheHeader, TheFooter },
  mounted() {
    ethereum.on("disconnect", () => {
      this.$router.push("/");
      alert("Connect Wallet to use KajuSwap!");
    });
    ethereum.on("accountsChanged", (accounts) => {
      console.log(accounts);
      this.onConnect();
    });
  },
  methods: {
    walletConnectInitializations() {
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
    },

    onConnect() {
      this.$store.dispatch("toggleOperationUnderProcess", {
        val: true,
        location: "AccChange",
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
            location: "AccChange",
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
