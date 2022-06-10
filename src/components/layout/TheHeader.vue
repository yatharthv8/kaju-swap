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
          <router-link to="/swap">
            <button class="nav-item">Swap</button>
          </router-link>
          <router-link to="/pool"
            ><button class="nav-item">Pool</button></router-link
          >
          <a href="https://info.uniswap.org/#/" target="_blank"
            ><button class="nav-item">Charts<sup>↗</sup></button></a
          >
        </div>
      </div>
    </div>
    <div class="right-header-display">
      <div class="nav-item-container">
        <div class="nav-item">Network</div>
      </div>
      <div
        v-if="$store.state.displayConnectWalletButton"
        class="nav-item-container nav-item"
      >
        <div class="wallet-info">{{ $store.state.balance }} rETH</div>
        <div class="wallet-info">{{ $store.state.account0 }}</div>
      </div>
      <div v-else class="nav-item-container">
        <WalletConnectButton></WalletConnectButton>
      </div>
      <button class="side-dropdown" @click="showOrHideDropdown()">
        :
        <div
          class="side-dropdown-content"
          :style="{ display: displayDropdown }"
        >
          <a href="#">About</a>
          <a href="#">Dark Theme</a>
        </div>
      </button>
    </div>
  </header>
</template>

<script>
import WalletConnectButton from "../UI/WalletConnectButton.vue";

export default {
  components: { WalletConnectButton },
  data() {
    return {
      displayDropdown: "none",
    };
  },
  methods: {
    showOrHideDropdown() {
      if (this.displayDropdown === "none") {
        this.displayDropdown = "block";
      } else {
        this.displayDropdown = "none";
      }
    },
  },
  computed: {
    displayConnectWalletButtonHere() {
      return this.$store.state.displayConnectWalletButton;
    },
  },
};
</script>
