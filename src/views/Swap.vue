<template>
  <div class="card">
    <div class="form-header">
      <div>Swap</div>
      <div><gearSvg></gearSvg></div>
    </div>
    <div class="main-swap">
      <div>
        <input
          type="number"
          placeholder="0.0"
          pattern="^[0-9]*[.,]?[0-9]*$"
          name="token0"
          id="token0"
          v-model.trim="amountToken0"
        />
      </div>
      <downArrow></downArrow>
      <div>
        <input
          type="number"
          placeholder="0.0"
          pattern="^[0-9]*[.,]?[0-9]*$"
          name="token1"
          id="token1"
          v-model.trim="amountToken1"
        />
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

export default {
  components: { gearSvg, downArrow },
  data() {
    return {
      swapActive: false,
      amountToken0: null,
      amountToken1: null,
    };
  },
  methods: {},
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
