<template>
  <dialog open>
    <h3>Account Details</h3>
    <hr />
    <div>
      <p>Connected with MetaMask</p>
      <button @click="disconnectWallet()">Disconnect</button>
    </div>
    <p class="wallet-info">{{ $store.state.account0 }}</p>
    <div>
      <button @click="copyAdd($store.state.account0)">Copy Address</button>
      <a :href="urlOnEthScan" target="_blank"
        ><button>View on Explorer</button></a
      >
    </div>
    <hr />
    <button style="float: right" @click="closeDialog()">Close</button>
  </dialog>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {};
  },
  methods: {
    ...mapActions({
      revertState: "restoreInitialState",
    }),
    disconnectWallet() {
      this.revertState();
      this.$router.push("/");
      alert("Connect Wallet to use KajuSwap!");
    },
    closeDialog() {
      this.$store.state.showAccDialog = false;
    },
    async copyAdd(mytext) {
      try {
        await navigator.clipboard.writeText(mytext);
        alert("Copied");
      } catch ($e) {
        alert("Cannot copy");
      }
    },
  },
  computed: {
    urlOnEthScan() {
      return (
        "https://goerli.etherscan.io/address/" + this.$store.state.account0
      );
    },
  },
};
</script>

<style scoped>
a {
  color: var(--button-text-hover-color);
}

p {
  margin-right: 1rem;
}
div {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

button {
  margin: 0.5rem 0rem;
}
</style>
