<template>
  <button
    class="wallet-connect-button-eth-amt"
    @click="$emit('toggleConnectWalletButton')"
  >
    Connect Wallet
  </button>
</template>

<script>
export default {
  emits: ["toggleConnectWalletButton"],
};
</script>
