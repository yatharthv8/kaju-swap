<template>
  <div v-if="$store.state.liquidityPageVar.liqDialog.bool">
    <liq-dialog :swapDialNum="symbolButtonIndex"></liq-dialog>
  </div>
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
          v-model.trim="$store.state.liquidityPageVar.liqTokenAmount0"
        />
        <button @click="openDialog(0)">
          {{ $store.state.liquidityPageVar.liqTokenSymbol[0] }}
        </button>
      </div>
      <small v-if="$store.state.displayConnectWalletButton">
        <span class="max-amt" @click="fillInputWithMaxAmt()">MAX</span> :
        {{ $store.state.liquidityPageVar.liqTokenBal[0] }}</small
      >
      <div class="inp-swap">
        <input
          type="number"
          placeholder="0.0"
          step="any"
          min="0"
          name="token1"
          id="token1"
          v-model.trim="$store.state.liquidityPageVar.liqTokenAmount1"
        />
        <button @click="openDialog(1)">
          {{ $store.state.liquidityPageVar.liqTokenSymbol[1] }}
        </button>
      </div>
    </div>
    <div v-if="!addLiqActive">
      <button class="swap-button">Enter Amount</button>
    </div>
    <div v-else>
      <button class="swap-button" @click="addLiquidity()">Add Liquidity</button>
    </div>
  </div>
  <div class="card">
    <bal-res-section></bal-res-section>
  </div>
</template>

<script>
import BalResSection from "../components/layout/BalResSecLiq.vue";
import LiqDialog from "../components/Liquidity/LiqDialog.vue";

export default {
  components: { BalResSection, LiqDialog },
  data() {
    return {
      addLiqActive: false,
      symbolButtonIndex: null,
    };
  },
  methods: {
    openDialog(num) {
      this.symbolButtonIndex = num;
      console.log(
        "Input box values",
        this.$store.state.liquidityPageVar.liqTokenAmount0,
        this.addLiqActive
      );
      this.$store.dispatch("openLiqDialog");
    },
    fillInputWithMaxAmt() {
      this.$store.state.liquidityPageVar.liqTokenAmount0 =
        this.$store.state.liquidityPageVar.liqTokenBal[0];
    },
    addLiquidity() {
      this.$store.dispatch("addLiquidity");
    },
  },
  watch: {
    "$store.state.liquidityPageVar.liqTokenAmount0"(newVal) {
      if (newVal != null) {
        this.$store.dispatch("fillLiqTokenAmt", 1);
        if (this.$store.state.liquidityPageVar.liqTokenAmount0) {
          this.addLiqActive = true;
        } else {
          this.addLiqActive = false;
        }
        // console.log(
        //   "Watcher->",
        //   this.$store.state.liquidityPageVar.liqTokenAmount0
        // );
      } else {
        // console.log("WatcherOther->", newVal);
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
