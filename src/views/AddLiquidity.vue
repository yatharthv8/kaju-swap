<template>
  <!-- <teleport to="header"> -->
  <div v-if="liqDialogVal.bool">
    <liq-dialog :swapDialNum="symbolButtonIndex"></liq-dialog>
  </div>
  <!-- </teleport> -->
  <div class="card">
    <div class="top-gear">
      <router-link to="/pool" class="back-but">
        <button>Back</button>
      </router-link>
      <base-gear></base-gear>
    </div>
    <p>Add Liquidity</p>
    <!-- <hr /> -->
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
        <span class="max-amt" @click="fillInputWithMaxAmt(0)">MAX</span> :
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
      <small v-if="displayWalletStatus">
        <span class="max-amt" @click="fillInputWithMaxAmt(1)">MAX</span> :
        {{ liqTokenBalVal[1] }}</small
      >
    </div>
    <div v-if="!displayWalletStatus">
      <wallet-connect-button class="swap-button"></wallet-connect-button>
    </div>
    <div v-else-if="$store.state.addLiquidity.insufficientLiqBal">
      <button
        :disabled="$store.state.addLiquidity.insufficientLiqBal"
        :class="{
          'button-disabled': $store.state.addLiquidity.insufficientLiqBal,
          'swap-button': true,
        }"
      >
        Insufficient Balance
      </button>
    </div>
    <div v-else-if="!addLiqActive">
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
          @click="approveLiq()"
        >
          Approve Kajuswap to use {{ liqTokenSymbolVal[0] }} &
          {{ liqTokenSymbolVal[1] }}
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
        @click="addLiquidity()"
      >
        Add Liquidity
      </button>
      <!-- <div v-if="$store.state.addLiquidity.liqAdded"> -->
      <!-- {{ this.$alert("Liquidity Added successfully!", "Success") }} -->
      <!-- </div> -->
    </div>
  </div>
  <div>
    <bal-res-section></bal-res-section>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { mapActions, mapGetters } from "vuex";
import BalResSection from "../components/layout/BalResSecLiq.vue";
import swal from "sweetalert";

const LiqDialog = defineAsyncComponent(() =>
  import("../components/Liquidity/LiqDialog.vue")
);

export default {
  components: { BalResSection, LiqDialog },
  data() {
    return {
      addLiqActive: false,
      symbolButtonIndex: null,
      A: this.displayWalletStatus,
    };
  },
  methods: {
    ...mapActions({
      approveLiq: "approveLiq",
      addLiquidity: "addLiquidity",
      checkForBal: "checkMaxLiqBal",
      tokensAreApproved: "tokensAreApproved",
    }),
    //OR ...mapActions(["addLiquidity"]),
    openDialog(num) {
      this.symbolButtonIndex = num;
      this.$store.dispatch("openLiqDialog");
    },
    fillInputWithMaxAmt(num) {
      if (num === 0) {
        this.$store.state.addLiquidity.liqTokenAmount0 =
          this.liqTokenBalVal[num];
      } else {
        this.$store.state.addLiquidity.liqTokenAmount1 =
          this.liqTokenBalVal[num];
      }
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
      if (
        newVal != null &&
        this.$store.state.addLiquidity.LiqExists
        // Number(this.$store.state.addLiquidity.totalSupply) > 1e-12
      ) {
        if (newVal > 0) {
          this.$store.dispatch("fillLiqTokenAmt", 1);
        }
        this.checkForBal();
      } else {
        this.checkForBal();
        this.tokensAreApproved();
        this.addLiqActive = false;
      }
      if (this.$store.state.addLiquidity.liqTokenAmount0) {
        this.addLiqActive = true;
      } else {
        this.addLiqActive = false;
      }
    },
    "$store.state.addLiquidity.liqTokenAmount1"(newVal) {
      if (
        newVal != null &&
        this.$store.state.addLiquidity.pairLiquidity
        // Number(this.$store.state.addLiquidity.totalSupply) > 1e-12
      ) {
        if (newVal > 0) {
          this.$store.dispatch("fillLiqTokenAmt", 0);
        }
        this.checkForBal();
      } else {
        this.checkForBal();
        this.tokensAreApproved();
        this.addLiqActive = false;
      }
      if (this.$store.state.addLiquidity.liqTokenAmount1) {
        this.addLiqActive = true;
      } else {
        this.addLiqActive = false;
      }
    },
  },
  beforeRouteLeave(_, _2, next) {
    if (this.$store.state.canLeave == true) {
      next();
    } else {
      next(false);
      swal("Alert", "Please wait for the transaction to end!", "warning");
    }
  },
};
</script>

<style scoped>
input {
  font-size: 1rem;
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
  justify-content: space-between;
  width: -webkit-fill-available;
}

.back-but {
  padding: 0 0.5rem;
}
</style>
