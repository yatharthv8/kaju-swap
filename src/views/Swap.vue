<template>
  <!-- <teleport to="header"> -->
  <div v-if="swapDialogVars.bool">
    <swap-dialog-vue :swapDialNum="symbolButtonIndex"></swap-dialog-vue>
  </div>
  <!-- </teleport> -->
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
      <button
        @click="openDetails"
        class="details"
        v-if="$store.state.swap.pathExists"
      >
        <small>Details</small>
        <img
          class="expand-arrow"
          src="https://img.icons8.com/ios-glyphs/30/000000/expand-arrow--v1.png"
        />
      </button>
      <div
        class="details-dropdown"
        v-if="openD && $store.state.swap.pathExists"
      >
        <div v-if="swapActive" class="conv-impact">
          <small
            >1 {{ swapTokenSymbolVal[0] }} =
            {{ $store.state.swap.convertRate }}
            {{ swapTokenSymbolVal[1] }}</small
          >
          <small>Price Impact : {{ $store.state.swap.priceImpVal }}%</small>
        </div>
        <small class="show-route">
          Route :
          <div
            v-for="(symbol, index) in $store.state.swap.symbolsPath"
            :key="index"
          >
            {{ symbol }} <span v-if="index != routeLen - 1"> --> </span>
          </div>
        </small>
      </div>
    </div>
    <div v-if="!displayWalletStatus">
      <wallet-connect-button class="swap-button"></wallet-connect-button>
    </div>

    <div
      v-else-if="
        !$store.state.swap.pathExists && $store.state.swap.WrapUnwrap === null
      "
    >
      <button
        :disabled="!$store.state.swap.pathExists"
        :class="{
          'button-disabled': !$store.state.swap.pathExists,
          'swap-button': true,
        }"
      >
        No Routes for the trade
        <span><small>(Add Liquidity First)</small></span>
      </button>
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
      <div v-if="$store.state.swap.WrapUnwrap === null">
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
      <div v-else>
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
          @click="WrapOrUnwrap()"
        >
          {{ $store.state.swap.WrapUnwrap }}
        </button>
      </div>
    </div>
  </div>
  <div
    v-if="displayWalletStatus && $store.state.swap.WrapUnwrap === null"
    class="card"
    style="margin-bottom: 3rem"
  >
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
import swal from "sweetalert";

const SwapDialogVue = defineAsyncComponent(() =>
  import("../components/Swapper/SwapDialog.vue")
);

export default {
  components: { downArrow, SwapDialogVue, BalResSection },
  data() {
    return {
      swapActive: false,
      symbolButtonIndex: null,
      routeLen: this.$store.state.swap.symbolsPath.length,
      openD: false,
    };
  },
  methods: {
    ...mapActions({
      approveSwap: "approveSwap",
      startSwap: "swapToken",
      checkForBal0: "checkMaxBalFor0",
      checkForBal1: "checkMaxBalFor1",
    }),
    openDetails() {
      this.openD = !this.openD;
    },
    WrapOrUnwrap() {
      this.$store.dispatch("WETHnETHDealings");
    },
    async submitAddress(tokenAddress, index, EWE) {
      try {
        const accounts = await web3.eth.getAccounts();
        this.swapDialogVars.DialnumAdd[index] = tokenAddress;
        let TF = this.$store.state.marker;
        if (EWE != null) {
          TF = EWE === "W" ? false : true;
        }
        ethFunc
          .getBalanceandSymbol(accounts[0], tokenAddress, TF)
          .then((data) => {
            this.swapTokenSymbolVal[index] = data.symbol;
            this.$store.dispatch("displayMaxTokenBalance", {
              add: tokenAddress,
              ind: index,
              marker: TF,
            });
            // this.$store.dispatch("checkIfPathExists");
          });
      } catch (err) {
        console.log("Invalid token address!");
      }
    },
    async openDialog(num) {
      if (this.displayWalletStatus) {
        this.symbolButtonIndex = num;
        this.$store.dispatch("openSwapDialog");
      }
    },
    fillInputWithMaxAmt(num) {
      if (num === 0) {
        this.$store.state.swap.amountToken0 = this.tokenBalTextVal[num];
      } else {
        this.$store.state.swap.amountToken1 = this.tokenBalTextVal[num];
      }
    },
    swapInpBoxTokens() {
      const addressT = this.swapDialogVars.DialnumAdd;
      if (this.$store.state.swap.WrapUnwrap === null) {
        // console.log(addressT[0]);
        this.submitAddress(addressT[1], 0, null);
        this.submitAddress(addressT[0], 1, null);

        if (this.$store.state.swap.swapWatchInp) {
          this.$store.state.swap.amountToken1 =
            this.$store.state.swap.amountToken0;
        } else {
          this.$store.state.swap.amountToken0 =
            this.$store.state.swap.amountToken1;
        }
        // console.log(this.$store.state.swap.path);
        let p = this.$store.state.swap.path;
        this.$store.state.swap.path = p.reverse();
        let s = this.$store.state.swap.symbolsPath;
        this.$store.state.swap.symbolsPath = s.reverse();
        setTimeout(() => {
          this.$store.dispatch("displayReservesSwap");
        }, 1000);
      } else {
        if (this.$store.state.swap.WrapUnwrap === "Wrap") {
          this.submitAddress(addressT[1], 0, "W");
          this.submitAddress(addressT[0], 1, "E");
          this.$store.state.swap.WrapUnwrap = "Unwrap";
        } else {
          this.submitAddress(addressT[1], 0, "E");
          this.submitAddress(addressT[0], 1, "W");
          this.$store.state.swap.WrapUnwrap = "Wrap";
        }
      }
      // console.log(this.$store.state.swap.path);
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
      if (newVal != null && this.$store.state.swap.WrapUnwrap === null) {
        if (newVal > 0) {
          this.$store.dispatch("fillTokenAmount", 1);
          this.$store.dispatch("conversionRateSwap");
        }
        this.checkForBal0();
        if (
          this.$store.state.swap.amountToken0 &&
          this.$store.state.swap.pathExists
        ) {
          this.swapActive = true;
        } else {
          this.swapActive = false;
        }
        // console.log("Watcher->", newVal);
      } else if (this.$store.state.swap.WrapUnwrap != null) {
        if (newVal > 0) {
          this.$store.dispatch("fillTokenAmount", 1);
          this.checkForBal0();
        }
        if (this.$store.state.swap.amountToken0) {
          this.swapActive = true;
        } else {
          this.swapActive = true;
        }
      } else {
        this.swapActive = false;
      }
    },
    "$store.state.swap.amountToken1"(newVal) {
      if (newVal != null && this.$store.state.swap.WrapUnwrap === null) {
        if (newVal > 0) {
          this.$store.dispatch("fillTokenAmount", 0);
        }
        this.checkForBal0();
        if (
          this.$store.state.swap.amountToken1 &&
          this.$store.state.swap.pathExists
        ) {
          this.swapActive = true;
        } else {
          this.swapActive = false;
        }
        // console.log("Watcher->", newVal);
      } else if (this.$store.state.swap.WrapUnwrap != null) {
        if (newVal > 0) {
          this.$store.dispatch("fillTokenAmount", 0);
          // this.checkForBal1();
        }
        if (this.$store.state.swap.amountToken1) {
          this.swapActive = true;
        } else {
          this.swapActive = true;
        }
      } else {
        this.swapActive = false;
      }
    },
    "$store.state.swap.symbolsPath.length"(newVal) {
      this.routeLen = newVal;
      // console.log(this.routeLen);
    },
  },
  beforeRouteLeave(_, _2, next) {
    if (this.$store.state.canLeave == true) {
      this.$store.commit("resetSwapState");
      next();
    } else {
      next(false);
      swal("Alert", "Please wait for the transaction to end!", "warning");
    }
  },
};
</script>

<style scoped>
.max-amt {
  cursor: pointer;
}

.conv-impact {
  padding: 0 0.4rem;
  display: flex;
  justify-content: space-between;
  width: -webkit-fill-available;
}
.show-route {
  padding: 0.5rem;
  display: flex;
  width: -webkit-fill-available;
  background-color: rgb(222, 190, 148);
  margin: 10px;
  justify-content: center;
}

.details-dropdown {
  display: flex;
  flex-direction: column;
  width: -webkit-fill-available;
}
</style>
