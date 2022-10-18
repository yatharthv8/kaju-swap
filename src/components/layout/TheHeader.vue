<template>
  <div v-if="this.$store.state.showAccDialog">
    <show-acc-details></show-acc-details>
  </div>
  <header>
    <div>
      <router-link to="/">
        <img
          class="kajuswap-logo"
          src="../../assets/KajuToken.png"
          alt="KajuToken"
      /></router-link>
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
        <div class="nav-item network-dropdown" @click="showOrHideDropdown(0)">
          {{ $store.state.network }}
          <img
            class="expand-arrow"
            src="https://img.icons8.com/ios-glyphs/30/000000/expand-arrow--v1.png"
          />
          <div
            class="dropdown-content"
            :style="{ display: displayDropdown[0] }"
          >
            <div @click="changeNetwork(0x1)">Ethereum</div>
            <div @click="changeNetwork(0x5)">GÖRLI</div>
          </div>
        </div>
      </div>
      <div v-if="displayWalletStatus" class="nav-item-container">
        <div class="wallet-info nav-item">{{ $store.state.balance }} ETH</div>
        <button @click="showAccountDetails()">
          <div class="wallet-info nav-item">
            {{ this.accountAdd }}
          </div>
        </button>
      </div>
      <div v-else class="nav-item-container">
        <wallet-connect-button></wallet-connect-button>
      </div>
      <button class="side-dropdown" @click="showOrHideDropdown(2)">
        :
        <div
          class="side-dropdown-content"
          :style="{ display: displayDropdown[2] }"
        >
          <router-link to="/about">About</router-link>
          <a href="https://github.com/yatharthv8/kaju-swap" target="_blank"
            >Github Repo</a
          >
          <!-- <a href="#">Dark Theme</a> -->
        </div>
      </button>
    </div>
  </header>
</template>

<script>
import { mapGetters } from "vuex";
import { ethers } from "ethers";
const { ethereum } = window;

export default {
  components: {},
  data() {
    return {
      displayDropdown: ["none", "none", "none"],
      accountAdd: this.$store.state.account0,
    };
  },
  methods: {
    showOrHideDropdown(ind) {
      if (this.displayDropdown[ind] === "none") {
        this.displayDropdown[ind] = "block";
      } else {
        this.displayDropdown[ind] = "none";
      }
    },
    showAccountDetails() {
      this.$store.state.showAccDialog = true;
    },
    async changeNetwork(chainId) {
      const hex_chainId = ethers.utils.hexValue(chainId);
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hex_chainId }],
      });
    },
  },
  computed: {
    ...mapGetters({
      displayWalletStatus: "displayWalletStatus",
    }),
  },
  watch: {
    "$store.state.account0"(newVal) {
      // alert(newVal);
      if (this.$store.state.network != "Network") {
        this.accountAdd =
          newVal.substr(0, 6) +
          "..." +
          newVal.substr(newVal.length - 4, newVal.length);
      }
      // console.log(this.accountAdd);
    },
  },
};
</script>

<style scoped></style>
