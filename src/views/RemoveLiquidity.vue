<template>
  <div class="card">
    <router-link to="/pool" style="align-self: normal">
      <button>Back</button>
    </router-link>
    <p>Remove Liquidity</p>
    <hr />
    <div class="main-swap">
      <div class="inp-swap">
        <span
          >{{ $store.state.removeLiquidityPage.symbol[0] }}-{{
            $store.state.removeLiquidityPage.symbol[1]
          }}
          LP</span
        >
        <input
          type="number"
          placeholder="0.0"
          step="any"
          min="0"
          name="token0"
          id="token0"
          v-model.trim="$store.state.removeLiquidityPage.pairLiqInp"
        />
      </div>
      <small v-if="$store.state.displayConnectWalletButton">
        <span class="max-amt" @click="fillInputWithMaxAmt()">MAX</span> :
        {{ $store.state.removeLiquidityPage.pairLiquidity }}</small
      >
    </div>
    <div v-if="!remLiqActive">
      <button class="swap-button">Enter Amount</button>
    </div>
    <div v-else>
      <button class="swap-button" @click="remLiquidity()">
        Remove Liquidity
      </button>
    </div>
  </div>
  <div class="card">
    <bal-res-section></bal-res-section>
  </div>
</template>

<script>
import BalResSection from "../components/layout/BalResSecRemLiq.vue";

export default {
  components: { BalResSection },
  data() {
    return {
      remLiqActive: false,
    };
  },
  methods: {
    fillInputWithMaxAmt() {
      this.$store.state.removeLiquidityPage.pairLiqInp =
        this.$store.state.removeLiquidityPage.pairLiquidity;
    },
    remLiquidity() {
      this.$store.dispatch("removeLiquidity");
    },
  },
  watch: {
    "$store.state.removeLiquidityPage.pairLiqInp"(newVal) {
      if (newVal != null) {
        // console.log("Token 1 val->", newVal);
        // this.$store.dispatch("fillLiqTokenAmt", {
        //   inpBox: 1,
        //   page: "removeLiq",
        // });
        if (this.$store.state.removeLiquidityPage.pairLiqInp) {
          this.remLiqActive = true;
        } else {
          this.remLiqActive = false;
        }
      } else {
        this.remLiqActive = false;
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
