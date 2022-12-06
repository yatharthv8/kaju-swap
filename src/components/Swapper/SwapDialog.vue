<template>
  <dialog open>
    <div class="dialog-top">
      <br />
      <span>Select Tokens</span>
      <span style="float: right; cursor: pointer" @click="closeDialog()"
        >&times;</span
      >
      <br />
      <hr />
      <label for="address">New token:</label>
      <input
        placeholder="custom token"
        name="address"
        id="address"
        v-model.trim="newAddress"
        @keyup.enter="submitAddress(newAddress, 1, null)"
      />
    </div>
    <div class="dialog-token">
      <div
        v-for="(coin, index) in $store.state.coins"
        :key="coin.address"
        @click="submitAddress(coin.address, 0, coin.abbr)"
      >
        <ul v-if="showThese[index] && this.tok != coin.abbr">
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
        <ul v-else-if="showThese[index]" class="show-unselectable">
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
      </div>
    </div>
    <hr />
    <button style="float: right" @click="closeDialog()">Close</button>
  </dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
// import * as COINS from "../../constants/coins.js";
import * as ethFunc from "../../ethereumFunctions.js";
import web3 from "../../../ethereum/web3.js";
import swal from "sweetalert";

// const ERC20 = require("../../../ethereum/.deps/npm/@rari-capital/solmate/src/tokens/artifacts/ERC20.json");

export default {
  props: ["swapDialNum"],
  data() {
    return {
      newAddress: null,
      showThese: [],
      NSDN: this.swapDialNum ? 0 : 1,
      tok: 1,
    };
  },
  methods: {
    ...mapActions({ closeDialog: "closeSwapDialog" }),
    async submitAddress(tokenAddress, action, abbr) {
      if (abbr === this.swapTokenSymbolVal[this.NSDN]) {
        // swal("Alert", "You cannot select the same token", "warning");
        // console.log("You cannot select the same token");
      } else {
        if (
          (abbr === "ETH" && this.swapTokenSymbolVal[this.NSDN] === "WETH") ||
          (abbr === "WETH" && this.swapTokenSymbolVal[this.NSDN] === "ETH")
        ) {
          this.$store.state.swap.pathExists = false;
          if (this.swapTokenSymbolVal[0] === "ETH") {
            this.$store.state.swap.WrapUnwrap = "Wrap";
          } else {
            this.$store.state.swap.WrapUnwrap = "Unwrap";
          }
          let TF = true;
          if (abbr === "WETH") {
            TF = false;
          }
          try {
            const accounts = await web3.eth.getAccounts();
            ethFunc
              .getBalanceandSymbol(accounts[0], tokenAddress, TF)
              .then((data) => {
                this.swapTokenSymbolVal[this.swapDialNum] = data.symbol;
                this.swapDialogVars.DialnumAdd[this.swapDialNum] = tokenAddress;
                this.$store.dispatch("displayMaxTokenBalance", {
                  add: tokenAddress,
                  ind: this.swapDialNum,
                  marker: TF,
                });
              });
          } catch (err) {
            console.log("Something went wrong!");
          }
        } else {
          this.$store.state.swap.WrapUnwrap = null;
          if (abbr === "WETH") {
            this.$store.state.marker = false;
          } else if (abbr === "ETH") {
            this.$store.state.marker = true;
          } else {
            if (this.swapTokenSymbolVal[this.NSDN] === "WETH") {
              this.$store.state.marker = false;
            } else {
              this.$store.state.marker = true;
            }
          }
          // console.log(this.$store.state.marker);
          this.$store.state.swap.pathExists = true;
          try {
            const accounts = await web3.eth.getAccounts();
            ethFunc
              .getBalanceandSymbol(
                accounts[0],
                tokenAddress,
                this.$store.state.marker
              )
              .then((data) => {
                if (data) {
                  // console.log("hi");
                  this.swapTokenSymbolVal[this.swapDialNum] = data.symbol;
                  this.swapDialogVars.DialnumAdd[this.swapDialNum] =
                    tokenAddress;
                  this.$store.dispatch("displayMaxTokenBalance", {
                    add: tokenAddress,
                    ind: this.swapDialNum,
                    marker: this.$store.state.marker,
                  });
                  if (action === 1) {
                    let addToken = true;
                    for (let i = 0; i < this.$store.state.coins.length; ++i) {
                      if (this.$store.state.coins[i].address === tokenAddress) {
                        addToken = false;
                      }
                    }
                    // console.log(data);

                    if (addToken) {
                      this.$store.state.coins.unshift({
                        name: data.name,
                        abbr: data.symbol,
                        address: tokenAddress,
                        balance: data.balance,
                        addedByUser: true,
                        marker: false,
                      });
                    }
                  }
                  this.$store.dispatch("checkIfPathExists");
                  this.$store.dispatch("displayReservesSwap");

                  this.$store.dispatch("conversionRateSwap");
                } else {
                  swal("Error", "Enter a valid token address", "error");
                }
              });
            // console.log(this.coins);
          } catch (err) {
            // console.loh("bye");
            console.log("Invalid token address!");
          }
        }
        // console.log(this.$store.state.swap.WrapUnwrap);
        const val = this.$store.state.swap.amountToken0;
        this.$store.dispatch("closeSwapDialog");
        this.$store.commit("resetSwapState");
        setTimeout(() => {
          this.$store.state.swap.amountToken0 = val;
        }, 1000);
      }
    },
  },
  computed: {
    ...mapGetters({
      swapDialogVars: "getSwapDialog",
      swapTokenSymbolVal: "getSwapTokenSymbol",
    }),
  },
  mounted() {
    this.tok = this.swapTokenSymbolVal[this.NSDN];
    for (let i = 0; i < this.$store.state.coins.length; i++) {
      this.showThese.push(true);
    }
  },
  watch: {
    newAddress(newVal) {
      this.showThese = [];
      if (newVal.length) {
        const filter = newVal.toUpperCase();
        for (let i = 0; i < this.$store.state.coins.length; i++) {
          const a = this.$store.state.coins[i].name;
          if (a.toUpperCase().indexOf(filter) > -1) {
            this.showThese.push(true);
          } else {
            this.showThese.push(false);
            // const adc = this.$store.state.coins[i].address.length;
            // if (
            //   newVal.length === adc &&
            //   adc.toUpperCase().indexOf(filter) > -1
            // ) {
            //   this.showThese[i] = true;
            // }
          }
        }
      } else {
        for (let i = 0; i < this.$store.state.coins.length; i++) {
          this.showThese.push(true);
        }
      }
      // console.log(this.showThese);
    },
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
.show-unselectable {
  color: rgba(44, 41, 41, 0.507);
  border-radius: 1rem;
  cursor: auto;
}
.show-unselectable:hover {
  color: rgba(44, 41, 41, 0.507);
  background: content-box;
  border-radius: 1rem;
}
</style>
