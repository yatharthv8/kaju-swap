<template>
  <div class="card">
    <router-link to="/pool" style="align-self: normal">
      <button>Back</button>
    </router-link>
    <p>Remove Liquidity</p>
    <hr />
    <div class="main-swap">
      <div class="inp-swap">
        <span>{{ symbolVal[0] }}-{{ symbolVal[1] }} LP</span>
        <input
          type="number"
          placeholder="0.0"
          step="any"
          min="0"
          name="token0"
          id="token0"
          v-model.trim="$store.state.remLiquidity.pairLiqInp"
        />
      </div>
      <small v-if="displayWalletStatus">
        <span class="max-amt" @click="fillInputWithMaxAmt()">MAX</span> :
        {{ $store.state.remLiquidity.pairLiquidity }}</small
      >
    </div>
    <div v-if="!remLiqActive">
      <button class="swap-button">Enter Amount</button>
    </div>
    <div v-else>
      <button
        :disabled="$store.state.operationUnderProcess"
        :class="{
          'button-disabled': $store.state.operationUnderProcess,
          'swap-button': true,
        }"
        @click="remLiquidity()"
      >
        Remove Liquidity
      </button>
    </div>
  </div>
  <div class="card">
    <bal-res-section></bal-res-section>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import BalResSection from "../components/layout/BalResSecRemLiq.vue";

export default {
  components: { BalResSection },
  data() {
    return {
      remLiqActive: false,
    };
  },
  methods: {
    ...mapActions({
      remLiquidity: "removeLiquidity",
    }),
    fillInputWithMaxAmt() {
      this.$store.state.remLiquidity.pairLiqInp =
        this.$store.state.remLiquidity.pairLiquidity;
    },
  },
  computed: {
    ...mapGetters({
      displayWalletStatus: "displayWalletStatus",
      symbolVal: "getSymbol",
    }),
  },
  watch: {
    "$store.state.remLiquidity.pairLiqInp"(newVal) {
      if (newVal != null) {
        // console.log("Token 1 val->", newVal);
        // this.$store.dispatch("fillLiqTokenAmt", {
        //   inpBox: 1,
        //   page: "removeLiq",
        // });
        if (this.$store.state.remLiquidity.pairLiqInp) {
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
