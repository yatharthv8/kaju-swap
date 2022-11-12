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
        @keyup.enter="submitAddress(newAddress, 1)"
      />
      <!-- <select name="tokens" id="tokens" hidden> -->
    </div>
    <div class="dialog-token">
      <div
        v-for="(coin, index) in $store.state.coins"
        :key="coin.address"
        @click="submitAddress(coin.address, 0)"
      >
        <ul
          v-if="
            showThese[index] &&
            this.liqDialogVal.DialnumAdd[this.NSDN] != coin.address
          "
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
// import web3 from "../../../ethereum/web3.js";
import swal from "sweetalert";

export default {
  props: ["swapDialNum"],
  data() {
    return {
      newAddress: null,
      showThese: [],
      NSDN: this.swapDialNum ? 0 : 1,
    };
  },
  methods: {
    ...mapActions({ closeDialog: "closeLiqDialog" }),
    async submitAddress(tokenAddress, action) {
      if (tokenAddress === this.liqDialogVal.DialnumAdd[this.NSDN]) {
        // swal("Alert", "You cannot select the same token", "warning");
        // console.log("You cannot select the same token");
      } else {
        try {
          await ethFunc
            .getBalanceandSymbol(this.$store.state.account0, tokenAddress, true)
            .then((data) => {
              if (data) {
                if (this.swapDialNum === 1) {
                  this.$route.params.add1 = tokenAddress;
                } else {
                  this.$route.params.add2 = tokenAddress;
                }
                this.path =
                  "/addLiquidity/" +
                  this.$route.params.add1 +
                  "/" +
                  this.$route.params.add2;
                this.$store.commit("resetAddLiqState");
                this.liqTokenSymbolVal[this.swapDialNum] = data.symbol;
                this.liqDialogVal.DialnumAdd[this.swapDialNum] = tokenAddress;
                this.$store.dispatch("displayMaxTokenBalanceLiq", {
                  add: tokenAddress,
                  ind: this.swapDialNum,
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
                // this.$router.push(path);
                // console.log(this.$router);
                this.$store.dispatch("displayReservesPool");
              } else {
                swal("Error", "Enter a valid token address", "error");
              }
            });
        } catch (err) {
          console.log("Invalid token address!");
        }
        this.$store.dispatch("closeLiqDialog");
      }
    },
  },
  computed: {
    ...mapGetters({
      liqTokenSymbolVal: "getLiqTokenSymbol",
      liqDialogVal: "getLiqDialog",
    }),
  },
  mounted() {
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
