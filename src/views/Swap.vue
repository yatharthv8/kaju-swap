<template>
  <div v-if="$store.state.swapDialog[0]">
    <dialog-vue></dialog-vue>
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
        <swapper-dropdown :swapDialNum="0">{{
          $store.state.swapTokenSymbol[0]
        }}</swapper-dropdown>
      </div>
      <downArrow></downArrow>
      <div class="inp-swap">
        <input
          type="number"
          placeholder="0.0"
          pattern="^[0-9]*[.,]?[0-9]*$"
          name="token1"
          id="token1"
          v-model.trim="amountToken1"
        />
        <swapper-dropdown :swapDialNum="1">{{
          $store.state.swapTokenSymbol[1]
        }}</swapper-dropdown>
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
import SwapperDropdown from "../components/Swapper/SwapperDropdown.vue";

const router = ethFunc.getRouter(process.env.VUE_APP_ROUTER);
const factory = ethFunc.getFactory(process.env.VUE_APP_FACTORY);
const Weth = ethFunc.getWeth(process.env.VUE_APP_WETH);

export default {
  components: { gearSvg, downArrow, DialogVue, SwapperDropdown },
  data() {
    return {
      swapActive: false,
      amountToken0: null,
      amountToken1: null,
    };
  },
  methods: {
    // setDialNum(num) {
    //   this.swapDialNum = num;
    // }
  },
  computed: {},
  watch: {
    amountToken0() {
      if (this.amountToken0 > 0 || this.amountToken1 > 0) {
        this.swapActive = true;
      } else {
        this.swapActive = false;
      }
    },
    amountToken1() {
      if (this.amountToken1 > 0 || this.amountToken0 > 0) {
        this.swapActive = true;
      } else {
        this.swapActive = false;
      }
    },
  },
};
</script>
