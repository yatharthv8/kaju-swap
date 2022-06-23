<template>
  <div v-if="$store.state.swapDialog.bool">
    <dialog-vue :swapDialNum="symbolButtonIndex"></dialog-vue>
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
          pattern="^[0-9]*[.,]?[0-9]*$"
          name="token0"
          id="token0"
          v-model.trim="amountToken0"
        />
        <button @click="openDialog(0)">
          {{ $store.state.swapTokenSymbol[0] }}
        </button>
      </div>
      <downArrow></downArrow>
      <div class="inp-swap">
        <input
          type="number"
          placeholder="0.0"
          pattern="^[0-9]*[.,]?[0-9]*$"
          name="token1"
          id="token1"
          v-model.trim="$store.state.amountToken1"
        />
        <button @click="openDialog(1)">
          {{ $store.state.swapTokenSymbol[1] }}
        </button>
      </div>
    </div>
    <div v-if="!$store.state.displayConnectWalletButton">
      <wallet-connect-button class="swap-button"></wallet-connect-button>
    </div>
    <div v-else-if="!swapActive">
      <button class="swap-button">Enter Amount</button>
    </div>
    <div v-else><button class="swap-button">Swap</button></div>
  </div>
</template>

<script>
import gearSvg from "../assets/svg/gear.vue";
import downArrow from "../assets/svg/downArrow.vue";
import * as ethFunc from "../ethereumFunctions.js";
import DialogVue from "../components/Swapper/Dialog.vue";
// import SwapperDropdown from "../components/Swapper/SwapperDropdown.vue";

const router = ethFunc.getRouter(process.env.VUE_APP_ROUTER);
const factory = ethFunc.getFactory(process.env.VUE_APP_FACTORY);
const Weth = ethFunc.getWeth(process.env.VUE_APP_WETH);

export default {
  components: { gearSvg, downArrow, DialogVue },
  data() {
    return {
      swapActive: false,
      symbolButtonIndex: null,
      amountToken0: null,
      // amountToken1: null,
    };
  },
  methods: {
    openDialog(num) {
      this.symbolButtonIndex = num;
      this.$store.dispatch("openSwapDialog");
    },
  },
  computed: {},
  watch: {
    amountToken0(newVal) {
      if (newVal > 0 || this.amountToken1 > 0) {
        console.log("from watcher->", newVal);
        this.swapActive = true;
        this.$store.state.amountToken0 = newVal;
        this.$store.dispatch("fillToken1Amount");
      } else {
        this.swapActive = false;
      }
    },
    amountToken1(newVal) {
      if (newVal > 0 || this.amountToken0 > 0) {
        this.$store.state.amountToken1 = newVal;
        this.swapActive = true;
      } else {
        this.swapActive = false;
      }
    },
  },
};
</script>
