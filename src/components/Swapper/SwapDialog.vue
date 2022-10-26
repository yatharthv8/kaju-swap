<template>
  <dialog open>
    <br />
    <span>Select Tokens</span>
    <span style="float: right; cursor: pointer" @click="closeDialog()"
      >&times;</span
    >
    <br />
    <br />
    <hr />
    <label for="address">New token:</label>
    <input
      placeholder="custom token"
      name="address"
      id="address"
      v-model.trim="newAddress"
      @keyup.enter="submitAddress(newAddress, 1)"
    />
    <hr />
    <!-- <select name="tokens" id="tokens" hidden> -->
    <ul
      v-for="coin in $store.state.coins"
      :key="coin.address"
      @click="submitAddress(coin.address, 0)"
    >
      {{
        coin.abbr
      }}
      <br />
      <small>{{ coin.name }}</small>
      <small class="ABU" v-if="coin.addedByUser"> | Added by user</small>
      <span style="float: right">
        <small>{{ coin.balance }}</small>
      </span>
    </ul>
    <!-- </select> -->
    <hr />
    <button style="float: right" @click="closeDialog()">Close</button>
  </dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
// import * as COINS from "../../constants/coins.js";
import * as ethFunc from "../../ethereumFunctions.js";
import web3 from "../../../ethereum/web3.js";

// const ERC20 = require("../../../ethereum/.deps/npm/@rari-capital/solmate/src/tokens/artifacts/ERC20.json");

export default {
  props: ["swapDialNum"],
  data() {
    return {
      newAddress: null,
    };
  },
  methods: {
    ...mapActions({ closeDialog: "closeSwapDialog" }),
    async submitAddress(tokenAddress, action) {
      try {
        const accounts = await web3.eth.getAccounts();
        ethFunc.getBalanceandSymbol(accounts[0], tokenAddress).then((data) => {
          this.swapTokenSymbolVal[this.swapDialNum] = data.symbol;
          this.swapDialogVars.DialnumAdd[this.swapDialNum] = tokenAddress;
          this.$store.dispatch("displayMaxTokenBalance", {
            add: tokenAddress,
            ind: this.swapDialNum,
          });
          if (action === 1) {
            this.$store.state.coins.unshift({
              name: data.name,
              abbr: data.symbol,
              address: tokenAddress,
              balance: data.balance,
              addedByUser: true,
            });
          }
          this.$store.dispatch("displayReservesSwap");
        });
        // console.log(this.coins);
        this.$store.dispatch("closeSwapDialog");
      } catch (err) {
        console.log("Invalid token address!");
      }
    },
  },
  computed: {
    ...mapGetters({
      swapDialogVars: "getSwapDialog",
      swapTokenSymbolVal: "getSwapTokenSymbol",
    }),
  },
};
</script>

<style scoped>
input {
  font-size: 1rem;
  height: 2rem;
}

ul:hover {
  background-color: rgb(226, 177, 118);
}

.ABU {
  font-size: 0.8rem;
  color: #333333;
  font-weight: 400;
}
</style>
