<template>
  <dialog open>
    <div class="card">
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
            v-model.trim="$store.state.amountToken0"
          />
          <button @click="openDialog(0)">
            {{ $store.state.swapTokenSymbol[0] }}
          </button>
        </div>
        <small v-if="$store.state.displayConnectWalletButton">
          <span class="max-amt" @click="fillInputWithMaxAmt()">MAX</span> :
          {{ $store.state.tokenBalText[0] }}</small
        >
        <div class="inp-swap">
          <input
            type="number"
            placeholder="0.0"
            step="any"
            min="0"
            name="token1"
            id="token1"
            v-model.trim="$store.state.amountToken1"
          />
          <button @click="openDialog(1)">
            {{ $store.state.swapTokenSymbol[1] }}
          </button>
        </div>
        <!-- <small v-if="$store.state.displayConnectWalletButton"
        ><span @click="fillInputWithMaxAmt()">MAX</span>: {{ $store.state.tokenBalText[1] }}</small
      > -->
      </div>
      <div v-if="!swapActive">
        <button class="swap-button">Enter Amount</button>
      </div>
      <div v-else>
        <button class="swap-button" @click="startSwap()">Add Liquidity</button>
      </div>
    </div>
    <div class="card">
      <bal-res-section></bal-res-section>
    </div>
    <button style="float: right" @click="closeDialog()">Close</button>
  </dialog>
</template>

<script>
import BalResSection from "../components/layout/BalResSection.vue";

export default {
  components: { BalResSection },
  data() {
    return {};
  },
  methods: {
    closeDialog() {
      this.$store.state.liqDialog = false;
    },
    changeTokenText(tokenAddress) {
      // console.log("swap dial num in CTT dialog.vue->", swapDialNum);
      this.submitAddress(tokenAddress);
    },
    async submitAddress(tokenAddress) {
      try {
        const accounts = await web3.eth.getAccounts();
        ethFunc.getBalanceandSymbol(accounts[0], tokenAddress).then((data) => {
          this.$store.state.swapTokenSymbol[this.swapDialNum] = data.symbol;
          this.$store.state.swapDialog.DialnumAdd[this.swapDialNum] =
            tokenAddress;
          // console.log("token balance->", data.balance);
          // console.log("swapDial->", this.$store.state.swapDialog[1]);
        });
        this.$store.dispatch("closeSwapDialog");
        this.$store.dispatch("displayMaxTokenBalance", {
          add: tokenAddress,
          ind: this.swapDialNum,
        });
        this.$store.dispatch("displayReserves");
      } catch (err) {
        console.log("Invalid token address!");
      }
    },
  },
  computed: {},
};
</script>

<style scoped>
input {
  font-size: 1rem;
  width: 26rem;
  height: 2rem;
}

ul:hover {
  background-color: rgb(226, 177, 118);
}
</style>
