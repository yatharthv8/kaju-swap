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
        @click="changeTokenText(coin.address, swapDialNum)"
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
    closeDialog() {
      // this.$store.state.liquidityPageVar.liqDialog.bool = false;
      this.$store.dispatch("closeLiqDialog");
    },
    changeTokenText(tokenAddress) {
      // console.log("swap dial num in CTT dialog.vue->", swapDialNum);
      this.submitAddress(tokenAddress);
    },
    async submitAddress(tokenAddress) {
      try {
        // const accounts = await web3.eth.getAccounts();
        await ethFunc
          .getBalanceandSymbol(this.$store.state.account0, tokenAddress)
          .then((data) => {
            this.$store.state.liquidityPageVar.liqTokenSymbol[
              this.swapDialNum
            ] = data.symbol;
            this.$store.state.liquidityPageVar.liqDialog.DialnumAdd[
              this.swapDialNum
            ] = tokenAddress;
            // console.log("token balance->", data.balance);
            // console.log("swapDial->", this.$store.state.swapDialog[1]);
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
  computed: {
    // getBalance() {
    //   for (let i = 0; i < this.coins.length; ++i) {
    //     const bal = web3.eth.getBalance(this.coins[i].address);
    //     console.log("Balance of {this} is", bal);
    //   }
    //   return 0;
    // },
  },
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
