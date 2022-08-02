<template>
  <teleport to="header">
    <div v-if="swapDialogVars.bool">
      <swap-dialog-vue :swapDialNum="symbolButtonIndex"></swap-dialog-vue></div
  ></teleport>
  <div class="card">
    <div class="form-header">
      <div>Swap</div>
      <base-gear></base-gear>
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
          v-model.trim="$store.state.swap.amountToken0"
        />
        <button @click="openDialog(0)">
          {{ swapTokenSymbolVal[0] }}
        </button>
      </div>
      <small v-if="displayWalletStatus">
        <span class="max-amt" @click="fillInputWithMaxAmt()">MAX</span> :
        {{ tokenBalTextVal[0] }}</small
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
          v-model.trim="$store.state.swap.amountToken1"
        />
        <button @click="openDialog(1)">
          {{ swapTokenSymbolVal[1] }}
        </button>
      </div>
    </div>
    <div v-if="!displayWalletStatus">
      <wallet-connect-button class="swap-button"></wallet-connect-button>
    </div>
    <div v-else-if="$store.state.swap.insufficientBal">
      <button
        :disabled="$store.state.swap.insufficientBal"
        :class="{
          'button-disabled': $store.state.swap.insufficientBal,
          'swap-button': true,
        }"
      >
        Insufficient {{ swapTokenSymbolVal[0] }} Balance
      </button>
    </div>
    <div v-else-if="!swapActive">
      <button class="swap-button">Enter Amount</button>
    </div>
    <div v-else>
      <button
        :disabled="$store.state.operationUnderProcess"
        :class="{
          'button-disabled': $store.state.operationUnderProcess,
          'swap-button': true,
        }"
        @click="startSwap()"
      >
        Swap
      </button>
    </div>
  </div>
  <div v-if="displayWalletStatus" class="card">
    <bal-res-section></bal-res-section>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { mapActions, mapGetters } from "vuex";
import downArrow from "../assets/svg/downArrow.vue";
import BalResSection from "../components/layout/BalResSection.vue";

const SwapDialogVue = defineAsyncComponent(() =>
  import("../components/Swapper/SwapDialog.vue")
);

export default {
  components: { downArrow, SwapDialogVue, BalResSection },
  data() {
    return {
      swapActive: false,
      symbolButtonIndex: null,
    };
  },
  methods: {
    ...mapActions({ startSwap: "swapToken", checkForBal: "checkMaxBal" }),

    openDialog(num) {
      this.symbolButtonIndex = num;
      this.$store.dispatch("openSwapDialog");
    },
    fillInputWithMaxAmt() {
      this.$store.state.swap.amountToken0 = this.tokenBalTextVal[0];
    },
  },
  computed: {
    ...mapGetters({
      displayWalletStatus: "displayWalletStatus",
      swapDialogVars: "getSwapDialog",
      swapTokenSymbolVal: "getSwapTokenSymbol",
      tokenBalTextVal: "getTokenBalText",
    }),
  },
  watch: {
    "$store.state.swap.amountToken0"(newVal) {
      if (newVal != null) {
        this.$store.dispatch("fillTokenAmount", 1);
        this.checkForBal();
        if (this.$store.state.swap.amountToken0) {
          this.swapActive = true;
        } else {
          this.swapActive = false;
        }
        // console.log("Watcher->", newVal);
      } else {
        this.swapActive = false;
      }
    },
  },
  beforeRouteLeave(_, _2, next) {
    if (this.$store.state.canLeave == true) {
      next();
    } else {
      next(false);
      alert("Please wait for the transaction to end!");
    }
  },
};
</script>

<style scoped>
.max-amt {
  cursor: pointer;
}
</style>
