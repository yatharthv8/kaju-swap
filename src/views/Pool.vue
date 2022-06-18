<template>
  <div class="pools-page-container">
    <div class="pools-page-header">
      <div>Pools Overview</div>
      <div>
        <button>More</button>
        <button>+New Position</button>
      </div>
    </div>

    <div class="pools-page-card">
      <div>Your active V3 liquidity positions will appear here.</div>
      <div v-if="!$store.state.displayConnectWalletButton">
        <wallet-connect-button></wallet-connect-button>
      </div>
      <div v-else><button>Add Liquidity</button></div>
    </div>
    <div class="pool-page-card-footers">
      <a
        href="https://help.uniswap.org/en/articles/5391541-provide-liquidity-on-uniswap-v3"
        target="_blank"
        ><button>
          <p>Learn about providing liquidity <sup>↗</sup></p>
          <p>Check out our v3 LP walkthrough and migration guides.</p>
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
  components: {},
  data() {
    return {};
  },
  methods: {},
  computed: {},
};
</script>
