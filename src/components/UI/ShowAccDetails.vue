<template>
  <dialog open>
    <h3>Account Details</h3>
    <div>
      <h2>
        <div class="wallet-info nav-item">{{ $store.state.balance }} ETH</div>
      </h2>
    </div>
    <hr />
    <div>
      <p>Connected with MetaMask</p>
      <button @click="disconnectWallet()">Disconnect</button>
    </div>
    <p>{{ $store.state.account0 }}</p>

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
import swal from "sweetalert";

export default {
  data() {
    return {};
  },
  methods: {
    ...mapActions({
      revertState: "restoreInitialState",
    }),
    disconnectWallet() {
      this.$router.push("/");
      this.revertState();
      swal("Connect Wallet to use KajuSwap!");
    },
    closeDialog() {
      this.$store.state.showAccDialog = false;
    },
    async copyAdd(mytext) {
      try {
        await navigator.clipboard.writeText(mytext);
        swal("Success", "Copied", "success");
      } catch ($e) {
        swal("Error", "Cannot copy", "error");
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
