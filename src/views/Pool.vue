<template>
  <div class="pools">
    <div class="pools-page-container">
      <div class="pools-page-header">
        <div>Pools Overview</div>
        <div>
          <!-- <button class="dropdown" @click="OpenIP()">Import Pool</button>
        <div
          class="dropdown-content-pool"
          :style="{ display: displayDropdown }"
        >
          <label for="pairAddress">New Pool:</label>
          <input
            type="text"
            placeholder="Write adddress of the pool here"
            name="pairAddress"
            id="pairAddress"
            v-model.trim="pairAdd"
            @keyup.enter="importPool(pairAdd)"
          />
        </div> -->
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
          <!-- <button
          @click="showExistingLiquidity()"
          v-if="!$store.state.pairsExistAndIs_SEL_Clicked[0]"
        >
          Show Existing Liquidity
        </button> -->
          <div
            v-if="!$store.state.pairsExistAndIs_SEL_Clicked"
            class="disp-card-cont"
          >
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
            <ul v-for="pair in $store.state.symLP" :key="pair.address">
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
              <div class="liquidity-add-rem-but">
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
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import * as ethFunc from "../ethereumFunctions.js";
import InfoSvg from "../assets/svg/Info.vue";
import swal from "sweetalert";

export default {
  components: { InfoSvg },
  data() {
    return {
      displayDropdown: "none",
      // pairAdd: null,
      // impIn: false,
    };
  },
  methods: {
    ...mapActions({
      remLiquidityPage: "getDataForLiqRemPage",
    }),
    // importPool(pairAdd) {
    //   this.impIn = true;
    //   this.OpenIP();
    //   // this.$store.state.allPairs.unshift(pairAdd);
    //   this.$store.dispatch("registerExistingLiquidity", 1);
    // },
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
        .getBalanceandSymbol(this.$store.state.account0, token0Address, true)
        .then((data) => {
          this.liqTokenSymbolVal[0] = data.symbol;
        });
      await ethFunc
        .getBalanceandSymbol(this.$store.state.account0, token1Address, true)
        .then((data) => {
          this.liqTokenSymbolVal[1] = data.symbol;
        });
      this.liqDialogVal.DialnumAdd[0] = token0Address;
      this.liqDialogVal.DialnumAdd[1] = token1Address;
      this.$store.dispatch("displayReservesPool");
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
        swal("Alert", "Please connect to a wallet first!", "warning");
      }
    } else {
      next();
    }
  },
};
</script>

<style scoped>
.pools {
  margin: 6rem 0 5rem;
  display: flex;
  justify-content: center;
  height: 100vh;
}
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

@media screen and (max-width: 520px) {
  ul {
    width: 21rem;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  .liquidity-add-rem-but {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
  }
  .list-format {
    display: flex;
    flex-direction: row;
    width: inherit;
    justify-content: space-between;
  }
}
@media screen and (max-width: 720px) {
  .pool-page-card-footers {
    display: none;
  }
}
@media screen and (min-width: 520px) {
  .list-format {
    display: flex;
    flex-direction: column;
    height: 4rem;
    justify-content: space-between;
  }
}
@media screen and (min-width: 520px) and (max-width: 600px) {
  ul {
    width: 34rem;
  }
}
@media screen and (min-width: 600px) and (max-width: 720px) {
  ul {
    width: 36rem;
  }
}

ul:hover {
  background-color: rgba(228, 189, 140, 0.799);
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
