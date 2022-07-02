<template>
  <div v-if="$store.state.swapDialog.bool">
    <swap-dialog-vue :swapDialNum="symbolButtonIndex"></swap-dialog-vue>
  </div>
  <div class="card">
    <div class="form-header">
      <div>Swap</div>
      <div><gearSvg></gearSvg></div>
    </div>
    <div class="main-swap">
      <div class="inp-swap">
        <input
          type="number"
          placeholder="0.0"
          step="any"
          min="0"
          name="token0"
          id="token0"
          v-model.trim="$store.state.amountToken0"
        />
        <button @click="openDialog(0)">
          {{ $store.state.swapTokenSymbol[0] }}
        </button>
      </div>
      <small v-if="$store.state.displayConnectWalletButton">
        <span class="max-amt" @click="fillInputWithMaxAmt()">MAX</span> :
        {{ $store.state.tokenBalText[0] }}</small
      >
      <downArrow></downArrow>
      <div class="inp-swap">
        <input
          type="number"
          placeholder="0.0"
          step="any"
          min="0"
          name="token1"
          id="token1"
          v-model.trim="$store.state.amountToken1"
        />
        <button @click="openDialog(1)">
          {{ $store.state.swapTokenSymbol[1] }}
        </button>
      </div>
      <!-- <small v-if="$store.state.displayConnectWalletButton"
        ><span @click="fillInputWithMaxAmt()">MAX</span>: {{ $store.state.tokenBalText[1] }}</small
      > -->
    </div>
    <div v-if="!$store.state.displayConnectWalletButton">
      <wallet-connect-button class="swap-button"></wallet-connect-button>
    </div>
    <div v-else-if="!swapActive">
      <button class="swap-button">Enter Amount</button>
    </div>
    <div v-else>
      <button class="swap-button" @click="startSwap()">Swap</button>
    </div>
  </div>
  <div class="card">
    <bal-res-section></bal-res-section>
  </div>
</template>

<script>
import gearSvg from "../assets/svg/gear.vue";
import downArrow from "../assets/svg/downArrow.vue";
import * as ethFunc from "../ethereumFunctions.js";
import SwapDialogVue from "../components/Swapper/SwapDialog.vue";
import BalResSection from "../components/layout/BalResSection.vue";
// import SwapperDropdown from "../components/Swapper/SwapperDropdown.vue";

const router = ethFunc.getRouter(process.env.VUE_APP_ROUTER);
const factory = ethFunc.getFactory(process.env.VUE_APP_FACTORY);
const Weth = ethFunc.getWeth(process.env.VUE_APP_WETH);

export default {
  components: { gearSvg, downArrow, SwapDialogVue, BalResSection },
  data() {
    return {
      swapActive: false,
      symbolButtonIndex: null,
      // amountToken0: null,
      // amountToken1: null,
    };
  },
  methods: {
    openDialog(num) {
      this.symbolButtonIndex = num;
      this.$store.dispatch("openSwapDialog");
    },
    startSwap() {
      this.$store.dispatch("swapToken");
    },
    fillInputWithMaxAmt() {
      // console.log("fillInp->", this.$store.state.tokenBalText[0]);
      this.$store.state.amountToken0 = this.$store.state.tokenBalText[0];
    },
  },
  computed: {},
  watch: {
    "$store.state.amountToken0"(newVal) {
      if (newVal != null) {
        this.$store.dispatch("fillTokenAmount", 1);
        if (this.$store.state.amountToken0) {
          this.swapActive = true;
        } else {
          this.swapActive = false;
        }
        console.log("Watcher->", newVal);
      } else {
        this.swapActive = false;
      }
    },
    // "$store.state.amountToken1"(newVal) {
    //   if (newVal != null) {
    //     this.$store.dispatch("fillTokenAmount", 0);
    //     if (this.$store.state.amountToken1) {
    //       this.swapActive = true;
    //     } else {
    //       this.swapActive = false;
    //     }
    //     // console.log("Watcher->", newVal);
    //   } else {
    //     this.swapActive = false;
    //   }
    // },
  },
};
</script>

<style scoped>
.max-amt {
  cursor: pointer;
}
</style>
