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
        <span class="max-amt" @click="fillInputWithMaxAmt(0)">MAX</span> :
        {{ tokenBalTextVal[0] }}</small
      >
      <button @click="swapInpBoxTokens()"><downArrow></downArrow></button>
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
      <small v-if="displayWalletStatus">
        <span class="max-amt" @click="fillInputWithMaxAmt(1)">MAX</span> :
        {{ tokenBalTextVal[1] }}</small
      >
      <div v-if="swapActive">
        <small style="margin-right: 20.5rem"
          >1 {{ swapTokenSymbolVal[1] }} = {{ $store.state.swap.convertRate }}
          {{ swapTokenSymbolVal[0] }}</small
        >
      </div>
    </div>
    <div v-if="!displayWalletStatus">
      <wallet-connect-button class="swap-button"></wallet-connect-button>
    </div>
    <div v-else-if="$store.state.swap.insuffLiq">
      <button
        :disabled="$store.state.swap.insuffLiq"
        :class="{
          'button-disabled': $store.state.swap.insuffLiq,
          'swap-button': true,
        }"
      >
        Insufficient Liquidity for the trade
        <span><small>(Add Liquidity First)</small></span>
      </button>
    </div>
    <div v-else-if="$store.state.swap.insufficientBal">
      <button
        :disabled="$store.state.swap.insufficientBal"
        :class="{
          'button-disabled': $store.state.swap.insufficientBal,
          'swap-button': true,
        }"
      >
        Insufficient Balance
      </button>
    </div>
    <div v-else-if="!swapActive">
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
          @click="approveSwap()"
        >
          Approve Kajuswap to use {{ swapTokenSymbolVal[0] }}
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
import * as ethFunc from "../ethereumFunctions.js";
import web3 from "../../ethereum/web3.js";

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
    ...mapActions({
      approveSwap: "approveSwap",
      startSwap: "swapToken",
      checkForBal0: "checkMaxBalFor0",
      checkForBal1: "checkMaxBalFor1",
    }),
    async submitAddress(tokenAddress, index) {
      try {
        const accounts = await web3.eth.getAccounts();
        ethFunc.getBalanceandSymbol(accounts[0], tokenAddress).then((data) => {
          this.swapTokenSymbolVal[index] = data.symbol;
          this.swapDialogVars.DialnumAdd[index] = tokenAddress;
          this.$store.dispatch("displayMaxTokenBalance", {
            add: tokenAddress,
            ind: index,
          });
        });
      } catch (err) {
        console.log("Invalid token address!");
      }
    },
    async openDialog(num) {
      this.symbolButtonIndex = num;
      this.$store.dispatch("openSwapDialog");
    },
    fillInputWithMaxAmt(num) {
      if (num === 0) {
        this.$store.state.swap.amountToken0 = this.tokenBalTextVal[num];
      } else {
        this.$store.state.swap.amountToken1 = this.tokenBalTextVal[num];
      }
    },
    swapInpBoxTokens() {
      if (this.$store.state.swap.swapWatchInp) {
        this.$store.state.swap.amountToken1 =
          this.$store.state.swap.amountToken0;
      } else {
        this.$store.state.swap.amountToken0 =
          this.$store.state.swap.amountToken1;
      }
      const addressT = this.swapDialogVars.DialnumAdd;
      // console.log(addressT[0]);
      this.submitAddress(addressT[1], 0);
      this.submitAddress(addressT[0], 1);
      setTimeout(() => {
        this.$store.dispatch("displayReservesSwap");
      }, 1000);
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
        if (newVal > 0) {
          this.$store.dispatch("fillTokenAmount", 1);
          this.$store.dispatch("converstionRateSwap");
        }
        this.checkForBal0();
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
    "$store.state.swap.amountToken1"(newVal) {
      if (newVal != null) {
        if (newVal > 0) {
          this.$store.dispatch("fillTokenAmount", 0);
        }
        this.checkForBal0();
        if (this.$store.state.swap.amountToken1) {
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
