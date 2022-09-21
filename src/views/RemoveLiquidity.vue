<template>
  <div class="card">
    <div class="top-gear">
      <router-link to="/pool" class="back-but">
        <button>Back</button>
      </router-link>
      <base-gear></base-gear>
    </div>
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
    <div v-if="$store.state.remLiquidity.insufficientRemLiqBal">
      <button
        :disabled="$store.state.remLiquidity.insufficientRemLiqBal"
        :class="{
          'button-disabled': $store.state.remLiquidity.insufficientRemLiqBal,
          'swap-button': true,
        }"
      >
        Insufficient {{ symbolVal[0] }}-{{ symbolVal[1] }} LP Balance
      </button>
    </div>
    <div v-else-if="!remLiqActive">
      <button class="swap-button">Enter Amount</button>
    </div>
    <div v-else>
      <div v-if="$store.state.tokenApprovalInProcess">
        <button
          :disabled="$store.state.operationUnderProcess"
          :class="{
            'button-disabled': $store.state.operationUnderProcess,
            'swap-button': true,
          }"
          @click="approveRemLiq()"
        >
          Approve Kajuswap to use {{ symbolVal[0] }}-{{ symbolVal[1] }} LP
        </button>
      </div>
      <button
        :disabled="
          $store.state.operationUnderProcess ||
          $store.state.tokenApprovalInProcess
        "
        :class="{
          'button-disabled':
            $store.state.operationUnderProcess ||
            $store.state.tokenApprovalInProcess,
          'swap-button': true,
        }"
        @click="remLiquidity()"
      >
        Remove Liquidity
      </button>
    </div>
  </div>
  <bal-res-section></bal-res-section>
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
      approveRemLiq: "approveRemLiq",
      remLiquidity: "removeLiquidity",
      checkForBalDispPV: "checkMaxRemLiqBalDispPV",
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
        this.checkForBalDispPV();
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
input {
  font-size: 1rem;
  width: 22rem;
  height: 2rem;
}
.max-amt {
  cursor: pointer;
}

ul:hover {
  background-color: rgb(226, 177, 118);
}

.top-gear {
  display: flex;
}

.back-but {
  align-self: self-start;
  margin-right: calc(var(--card-element-width) - 5rem);
}
</style>
