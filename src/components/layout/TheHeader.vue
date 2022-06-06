<template>
  <header>
    <div>
      <img
        class="kajuswap-logo"
        src="../../assets/KajuToken.png"
        alt="KajuToken"
      />
    </div>
    <div>
      <div class="center-nav-bar">
        <div class="nav-item-container">
          <button class="nav-item">Swap</button>
          <button class="nav-item">Pool</button>
          <button class="nav-item">Charts</button>
        </div>
      </div>
    </div>
    <div class="right-header-display">
      <div class="nav-item-container">
        <div class="nav-item">Network</div>
      </div>
      <div
        v-if="displayConnectWalletButton"
        class="nav-item-container nav-item"
      >
        <div class="wallet-info">Eth amt</div>
        <div class="wallet-info">Address</div>
      </div>
      <div v-else class="nav-item-container">
        <button
          class="wallet-connect-button-eth-amt"
          @click="toggleConnectWalletButton()"
        >
          Connect Wallet
        </button>
      </div>
      <button class="side-dropdown">:</button>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      displayConnectWalletButton: false,
    };
  },
  methods: {
    toggleConnectWalletButton() {
      this.displayConnectWalletButton = !this.displayConnectWalletButton;
    },
  },
};
</script>
