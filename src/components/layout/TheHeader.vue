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
        <div class="nav-item">{{ $store.state.network }}</div>
      </div>
      <div v-if="displayWalletStatus" class="nav-item-container">
        <div class="wallet-info nav-item">{{ $store.state.balance }} ETH</div>
        <button @click="showAccountDetails()">
          <div class="wallet-info nav-item">{{ $store.state.account0 }}</div>
        </button>
      </div>
      <div v-else class="nav-item-container">
        <wallet-connect-button></wallet-connect-button>
      </div>
      <button class="side-dropdown" @click="showOrHideDropdown()">
        :
        <div
          class="side-dropdown-content"
          :style="{ display: displayDropdown }"
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

export default {
  components: {},
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
    showAccountDetails() {
      this.$store.state.showAccDialog = true;
    },
  },
  computed: {
    ...mapGetters({
      displayWalletStatus: "displayWalletStatus",
    }),
  },
};
</script>

<style scoped></style>
