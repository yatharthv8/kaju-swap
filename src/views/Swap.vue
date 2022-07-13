<template>
  <teleport to="header">
    <div v-if="swapDialogVars.bool">
      <swap-dialog-vue :swapDialNum="symbolButtonIndex"></swap-dialog-vue></div
  ></teleport>
  <div class="card">
    <div class="form-header">
      <div>Swap</div>
      <div class="side-dropdown" @click="showOrHideDropdown()">
        <gearSvg></gearSvg>
        <div
          class="side-dropdown-content"
          :style="{ display: displayDropdown }"
        >
          <router-link to="/about">About</router-link>
          <a href="https://github.com/yatharthv8/kaju-swap" target="_blank"
            >Github Repo</a
          >
          <!-- <a href="#">Dark Theme</a> -->
        </div>
      </div>
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
  <div class="card">
    <bal-res-section></bal-res-section>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { mapActions, mapGetters } from "vuex";
import gearSvg from "../assets/svg/gear.vue";
import downArrow from "../assets/svg/downArrow.vue";
import BalResSection from "../components/layout/BalResSection.vue";

const SwapDialogVue = defineAsyncComponent(() =>
  import("../components/Swapper/SwapDialog.vue")
);

export default {
  components: { gearSvg, downArrow, SwapDialogVue, BalResSection },
  data() {
    return {
      swapActive: false,
      symbolButtonIndex: null,
      displayDropdown: "none",
    };
  },
  methods: {
    ...mapActions({ startSwap: "swapToken" }),
    showOrHideDropdown() {
      if (this.displayDropdown === "none") {
        this.displayDropdown = "block";
      } else {
        this.displayDropdown = "none";
      }
    },
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
};
</script>

<style scoped>
.max-amt {
  cursor: pointer;
}
</style>
