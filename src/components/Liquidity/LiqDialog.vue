<template>
  <dialog open>
    <div>
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
    </div>
  </dialog>
</template>

<script>
import { mapActions } from "vuex";
import * as COINS from "../../constants/coins.js";
import * as ethFunc from "../../ethereumFunctions.js";
// import web3 from "../../../ethereum/web3.js";

export default {
  props: ["swapDialNum"],
  data() {
    return {
      coins: COINS.RINKEBYCoins,
      newAddress: null,
    };
  },
  methods: {
    ...mapActions({ closeDialog: "closeLiqDialog" }),
    async submitAddress(tokenAddress) {
      try {
        console.log("liq->", this.coins);
        await ethFunc
          .getBalanceandSymbol(this.$store.state.account0, tokenAddress)
          .then((data) => {
            this.$store.state.liquidityPageVar.liqTokenSymbol[
              this.swapDialNum
            ] = data.symbol;
            this.$store.state.liquidityPageVar.liqDialog.DialnumAdd[
              this.swapDialNum
            ] = tokenAddress;
            this.$store.dispatch("displayMaxTokenBalanceLiq", {
              add: tokenAddress,
              ind: this.swapDialNum,
            });
            this.$store.dispatch("displayReserves", "pool");
          });
        this.$store.dispatch("closeLiqDialog");
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
