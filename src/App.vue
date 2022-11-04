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
import * as COINS from "./constants/coins.js";
import swal from "sweetalert";

export default {
  components: { TheHeader, TheFooter },
  data() {
    return {};
  },
  beforeMount() {
    if (!localStorage.getItem("coins")) {
      // console.log(localStorage.getItem("coins"));
      localStorage.setItem("coins", JSON.stringify(COINS.GÖRLICoins));
    }
  },
  mounted() {
    if (
      !localStorage.getItem("allPairs") ||
      !localStorage.getItem("userPairs")
    ) {
      this.$store.state.loadAllPairsByFetch = true;
    }
    ethereum.on("disconnect", () => {
      this.$router.push("/");
      swal("Alert", "Connect Wallet to use KajuSwap!", "warning");
    });
    ethereum.on("chainChanged", (_chainId) => {
      if (!(_chainId === "0x1" || _chainId === "0x5")) {
        this.$store.dispatch("restoreInitialState");
      } else {
        this.$router.go();
      }
    });
    ethereum.on("accountsChanged", () => {
      // this.$store.dispatch("registerExistingLiquidity");
      // console.log("new Account ->", accounts);
      // this.onConnect();
      // if (this.$route.path === "/swap" || this.$route.path === "/pool") {
      // if (this.$route.path === "/swap") {
      //   //lines 28-39 are just being used because the app doesn't use the WebHash mode.
      //   this.$router.push("/swap");
      // } else {
      //   this.$router
      //     .push("/")
      //     .then(() => {
      //       this.$router.push("/pool");
      //     })
      //     .catch((err) => {
      //       console.log("error->>>", err);
      //     });
      // }
      this.$router.go(); //If Hash mode is used this can be used.
      // } else {
      //   this.$router.push("/");
      //   if (this.$route.path !== "/") {
      //     alert("You are getting redirected to the home page!");
      //   }
      // }
    });
  },
  computed: {
    ...mapGetters({
      swapDialogVars: "getSwapDialog",
      liqDialogVal: "getLiqDialog",
    }),
  },
  methods: {},
  watch: {
    "$store.state.coins": {
      handler(newVal) {
        localStorage.setItem("coins", JSON.stringify(newVal));
      },
      deep: true,
    },
    "$store.state.allPairsForGraph": {
      handler(newVal) {
        localStorage.setItem("allPairs", JSON.stringify(newVal));
      },
      deep: true,
    },
    "$store.state.allPairs": {
      handler(newVal) {
        localStorage.setItem("userPairs", JSON.stringify(newVal));
      },
      deep: true,
    },
    // "$store.state.allPairs": {
    //   handler(newVal) {
    //     localStorage.setItem("pairs", JSON.stringify(newVal));
    //   },
    //   deep: true,
    // },
  },
};
</script>
