<template>
  <div class="pools-page-container">
    <div class="pools-page-header">
      <div>Pools Overview</div>
      <div v-if="displayWalletStatus">
        <!-- <button>More</button> -->
        <router-link to="/addLiquidity"
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
          <router-link to="/addLiquidity">
            <button>Add Liquidity</button></router-link
          >
        </div>
        <div v-else>
          <ul v-for="pair in symLP" :key="pair.address">
            {{
              pair[0]
            }}
            -
            {{
              pair[1]
            }}
            LP
            <div>
              <router-link to="/addLiquidity">
                <button @click="addMoreLiquidity(pair[2], pair[3])">
                  Add More Liquidity
                </button></router-link
              ><router-link to="/removeLiquidity"
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

export default {
  data() {
    return {
      pairsExistAndIs_SEL_Clicked: [false, false],
      symLP: [],
    };
  },
  methods: {
    ...mapActions({
      remLiquidityPage: "getDataForLiqRemPage",
    }),
    async addMoreLiquidity(token0Address, token1Address) {
      // console.log("token addresses->", token0Address, token1Address);
      await ethFunc
        .getBalanceandSymbol(this.$store.state.account0, token0Address)
        .then((data) => {
          this.$store.state.liquidityPageVar.liqTokenSymbol[0] = data.symbol;
        });
      await ethFunc
        .getBalanceandSymbol(this.$store.state.account0, token1Address)
        .then((data) => {
          this.$store.state.liquidityPageVar.liqTokenSymbol[1] = data.symbol;
        });
      this.$store.state.liquidityPageVar.liqDialog.DialnumAdd[0] =
        token0Address;
      this.$store.state.liquidityPageVar.liqDialog.DialnumAdd[1] =
        token1Address;
      this.$store.dispatch("displayReserves", "pool");
    },
    showExistingLiquidity() {
      this.$store.dispatch("getPairsFromFactory").then(async (val) => {
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
          });
        }
      });
    },
  },
  computed: {
    ...mapGetters({
      displayWalletStatus: "displayWalletStatus",
    }),
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
</style>
