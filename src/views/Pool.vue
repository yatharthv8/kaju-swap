<template>
  <div class="pools-page-container">
    <div class="pools-page-header">
      <div>Pools Overview</div>
      <div>
        <button class="dropdown" @click="OpenIP()">Import Pool</button>
        <div
          class="dropdown-content-pool"
          :style="{ display: displayDropdown }"
        >
          <input type="text" placeholder="Write adddress of the pool here" />
        </div>
        <router-link :to="baseRoute"
          ><button>+New Position</button></router-link
        >
      </div>
    </div>

    <div class="pools-page-card">
      <div v-if="!displayWalletStatus">
        <wallet-connect-button></wallet-connect-button>
      </div>
      <div v-else>
        <button
          @click="showExistingLiquidity()"
          v-if="!pairsExistAndIs_SEL_Clicked[0]"
        >
          Show Existing Liquidity
        </button>
        <div v-else-if="!pairsExistAndIs_SEL_Clicked[1]" class="disp-card-cont">
          <div>
            <p>Your active liquidity positions will appear here.</p>
            <p>Currently there are no pairs in existence.</p>
            <p>To add, click on the button here :</p>
          </div>
          <router-link :to="baseRoute">
            <button>Add Liquidity</button></router-link
          >
        </div>
        <div v-else>
          <ul v-for="pair in symLP" :key="pair.address">
            <div class="list-format">
              <div>
                {{ pair[0] }}
                -
                {{ pair[1] }}
                LP
              </div>
              <div class="details">
                <div v-if="pairValCanDisp(pair[4])">
                  {{ pair[4] }}
                </div>
                <div class="closed-svg" v-else>
                  <info-svg></info-svg> Closed
                </div>
              </div>
            </div>
            <div>
              <router-link :to="'/addLiquidity/' + pair[2] + '/' + pair[3]">
                <button @click="addMoreLiquidity(pair[2], pair[3])">
                  Add More Liquidity
                </button></router-link
              ><router-link
                v-if="pairValCanDisp(pair[4])"
                :to="'/removeLiquidity/' + pair.address"
                ><button @click="remLiquidityPage(pair.address)">
                  Remove Liquidity
                </button></router-link
              >
            </div>
          </ul>
        </div>
      </div>
    </div>
    <div class="pool-page-card-footers">
      <a
        href="https://help.uniswap.org/en/articles/5391541-provide-liquidity-on-uniswap-v3"
        target="_blank"
        ><button>
          <p>Learn about providing liquidity <sup>↗</sup></p>
          <p>Check out our V2 LP walkthrough and migration guides.</p>
        </button></a
      ><a href="https://info.uniswap.org/#/pools" target="_blank">
        <button>
          <p>Top pools <sup>↗</sup></p>
          <p>Explore Uniswap Analytics.</p>
        </button></a
      >
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import * as ethFunc from "../ethereumFunctions.js";
import InfoSvg from "../assets/svg/Info.vue";

export default {
  components: { InfoSvg },
  data() {
    return {
      displayDropdown: "none",
      pairsExistAndIs_SEL_Clicked: [false, false],
      symLP: [],
      pairAdd: null,
    };
  },
  methods: {
    ...mapActions({
      remLiquidityPage: "getDataForLiqRemPage",
    }),
    OpenIP() {
      if (this.displayDropdown === "none") {
        this.displayDropdown = "block";
      } else {
        this.displayDropdown = "none";
      }
    },
    pairValCanDisp(val) {
      if (Number(val) < 1e-14) {
        return false;
      }
      return true;
    },
    async addMoreLiquidity(token0Address, token1Address) {
      // console.log("token addresses->", token0Address, token1Address);
      await ethFunc
        .getBalanceandSymbol(this.$store.state.account0, token0Address)
        .then((data) => {
          this.liqTokenSymbolVal[0] = data.symbol;
        });
      await ethFunc
        .getBalanceandSymbol(this.$store.state.account0, token1Address)
        .then((data) => {
          this.liqTokenSymbolVal[1] = data.symbol;
        });
      this.liqDialogVal.DialnumAdd[0] = token0Address;
      this.liqDialogVal.DialnumAdd[1] = token1Address;
      this.$store.dispatch("displayReservesPool");
    },
    showExistingLiquidity() {
      this.$store.dispatch("toggleOperationUnderProcess", {
        val: true,
        location: "showExLiq",
      });
      this.$store
        .dispatch("getPairsFromFactory")
        .then(async () => {
          this.pairsExistAndIs_SEL_Clicked[0] = true;
          if (this.$store.state.allPairs.length > 0)
            this.pairsExistAndIs_SEL_Clicked[1] = true;
          for (let i = 0; i < this.$store.state.allPairs.length; ++i) {
            const symb = await ethFunc.getDataForPairs(
              this.$store.state.account0,
              this.$store.state.allPairs[i]
            );
            this.symLP.push({
              address: this.$store.state.allPairs[i],
              0: symb[0],
              1: symb[1],
              2: symb[2],
              3: symb[3],
              4: symb[6],
            });
          }
        })
        .then(() => {
          this.$store.dispatch("toggleOperationUnderProcess", {
            val: false,
            location: "showExLiq",
          });
        })
        .catch((err) => {
          console.log("This action can't be completed at the moment!", err);
          this.$store.dispatch("toggleOperationUnderProcess", {
            val: false,
            location: "showExLiq",
          });
        });
    },
  },
  computed: {
    ...mapGetters({
      displayWalletStatus: "displayWalletStatus",
      liqTokenSymbolVal: "getLiqTokenSymbol",
      liqDialogVal: "getLiqDialog",
      baseRoute: "getBaseLiqRoute",
    }),
  },
  beforeRouteLeave(to, _, next) {
    if (
      to.path.search("addLiquidity") === 1 ||
      to.path.search("removeLiquidity") === 1
    ) {
      if (this.displayWalletStatus == true) {
        next();
      } else {
        next(false);
        alert("Please connect to a wallet first!");
      }
    } else {
      next();
    }
  },
};
</script>

<style scoped>
.disp-card-cont {
  display: flex;
  flex-direction: row;
  align-items: center;
}

ul {
  border-radius: 1rem;
  background-color: rgb(230, 203, 162);
  width: 40rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

ul:hover {
  background-color: rgba(228, 189, 140, 0.799);
}

.list-format {
  display: flex;
  flex-direction: column;
  height: 4rem;
  justify-content: space-between;
}

.details {
  font-size: 0.69rem;
}

.closed-svg {
  display: flex;
  width: 3.7rem;
  align-items: center;
  justify-content: space-between;
}
</style>
