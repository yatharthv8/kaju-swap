<template>
  <dialog open>
    <p>Select Tokens</p>
    <hr />
    <label for="address">New token:</label>
    <input
      placeholder="custom token"
      name="address"
      id="address"
      v-model.trim="newAddress"
      @keyup.enter="submitAddress(newAddress)"
    />
    <!-- <select name="tokens" id="tokens" hidden> -->
    <ul
      v-for="coin in coins"
      :key="coin.address"
      @click="submitAddress(coin.address)"
    >
      {{
        coin.abbr
      }}
      <br />
      <small>{{ coin.name }}</small>
      <!-- <span style="float: right"> {{ coin.balance }} </span> -->
    </ul>
    <!-- </select> -->
    <button style="float: right" @click="closeDialog()">Close</button>
  </dialog>
</template>

<script>
import { mapActions } from "vuex";
import * as COINS from "../../constants/coins.js";
import * as ethFunc from "../../ethereumFunctions.js";
import web3 from "../../../ethereum/web3.js";

export default {
  props: ["swapDialNum"],
  data() {
    return {
      coins: COINS.RINKEBYCoins,
      newAddress: null,
    };
  },
  methods: {
    ...mapActions({ closeDialog: "closeSwapDialog" }),
    async submitAddress(tokenAddress) {
      try {
        const accounts = await web3.eth.getAccounts();
        ethFunc.getBalanceandSymbol(accounts[0], tokenAddress).then((data) => {
          this.$store.state.swapTokenSymbol[this.swapDialNum] = data.symbol;
          this.$store.state.swapDialog.DialnumAdd[this.swapDialNum] =
            tokenAddress;
          this.$store.dispatch("displayMaxTokenBalance", {
            add: tokenAddress,
            ind: this.swapDialNum,
          });
          this.$store.dispatch("displayReserves", "swap");
        });
        this.$store.dispatch("closeSwapDialog");
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
