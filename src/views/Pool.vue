<template>
  <div class="pools-page-container">
    <div class="pools-page-header">
      <div>Pools Overview</div>
      <div>
        <button>More</button>
        <router-link to="/addLiquidity"
          ><button>+New Position</button></router-link
        >
      </div>
    </div>

    <div class="pools-page-card">
      <div v-if="!$store.state.displayConnectWalletButton">
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
          <!-- <ul v-for="pair in $store.state.allPairs" :key=""></ul> -->
          <!-- <router-link to="/removeLiquidity">
          <button @click="remLiquidityPage()">Remove Liquidity</button>
        </router-link> -->
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
export default {
  data() {
    return {
      pairsExistAndIs_SEL_Clicked: [false, false],
    };
  },
  methods: {
    showExistingLiquidity() {
      this.$store.dispatch("getPairsFromFactory").then((val) => {
        this.pairsExistAndIs_SEL_Clicked[0] = true;
        if (this.$store.state.allPairs.length > 0)
          this.pairsExistAndIs_SEL_Clicked[1] = true;
      });
    },
    remLiquidityPage() {
      this.$store.dispatch(
        "getSymbolsForLiqRemPage",
        "0x20fd0632de0a0fc8ddd05861bf1107791240d675"
      );
    },
  },
  computed: {},
};
</script>

<style scoped>
.disp-card-cont {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
