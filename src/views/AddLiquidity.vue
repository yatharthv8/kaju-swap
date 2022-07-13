<template>
  <teleport to="header">
    <div v-if="liqDialogVal.bool">
      <liq-dialog :swapDialNum="symbolButtonIndex"></liq-dialog></div
  ></teleport>
  <div class="card">
    <router-link to="/pool" style="align-self: normal">
      <button>Back</button>
    </router-link>
    <p>Add Liquidity</p>
    <hr />
    <div class="main-swap">
      <div class="inp-swap">
        <input
          type="number"
          placeholder="0.0"
          step="any"
          min="0"
          name="token0"
          id="token0"
          v-model.trim="$store.state.addLiquidity.liqTokenAmount0"
        />
        <button @click="openDialog(0)">
          {{ liqTokenSymbolVal[0] }}
        </button>
      </div>
      <small v-if="displayWalletStatus">
        <span class="max-amt" @click="fillInputWithMaxAmt()">MAX</span> :
        {{ liqTokenBalVal[0] }}</small
      >
      <div class="inp-swap">
        <input
          type="number"
          placeholder="0.0"
          step="any"
          min="0"
          name="token1"
          id="token1"
          v-model.trim="$store.state.addLiquidity.liqTokenAmount1"
        />
        <button @click="openDialog(1)">
          {{ liqTokenSymbolVal[1] }}
        </button>
      </div>
    </div>
    <div v-if="!displayWalletStatus">
      <wallet-connect-button class="swap-button"></wallet-connect-button>
    </div>
    <div v-else-if="!addLiqActive">
      <button class="swap-button">Enter Amount</button>
    </div>
    <div v-else>
      <button
        :disabled="$store.state.operationUnderProcess"
        :class="{
          'button-disabled': $store.state.operationUnderProcess,
          'swap-button': true,
        }"
        @click="addLiquidity()"
      >
        Add Liquidity
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
import BalResSection from "../components/layout/BalResSecLiq.vue";

const LiqDialog = defineAsyncComponent(() =>
  import("../components/Liquidity/LiqDialog.vue")
);

export default {
  components: { BalResSection, LiqDialog },
  data() {
    return {
      addLiqActive: false,
      symbolButtonIndex: null,
    };
  },
  methods: {
    ...mapActions({ addLiquidity: "addLiquidity" }),
    //OR ...mapActions(["addLiquidity"]),
    openDialog(num) {
      this.symbolButtonIndex = num;
      this.$store.dispatch("openLiqDialog");
    },
    fillInputWithMaxAmt() {
      this.$store.state.addLiquidity.liqTokenAmount0 = this.liqTokenBalVal[0];
    },
  },
  computed: {
    ...mapGetters({
      displayWalletStatus: "displayWalletStatus",
      liqTokenSymbolVal: "getLiqTokenSymbol",
      liqDialogVal: "getLiqDialog",
      liqTokenBalVal: "getLiqTokenBal",
    }),
  },
  watch: {
    "$store.state.addLiquidity.liqTokenAmount0"(newVal) {
      if (newVal != null) {
        this.$store.dispatch("fillLiqTokenAmt", 1);
        if (this.$store.state.addLiquidity.liqTokenAmount0) {
          this.addLiqActive = true;
        } else {
          this.addLiqActive = false;
        }
      } else {
        this.addLiqActive = false;
      }
    },
  },
};
</script>

<style scoped>
input {
  font-size: 1rem;
  width: 26rem;
  height: 2rem;
}
.max-amt {
  cursor: pointer;
}

ul:hover {
  background-color: rgb(226, 177, 118);
}
</style>
