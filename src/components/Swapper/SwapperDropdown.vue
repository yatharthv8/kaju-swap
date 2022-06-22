<template>
  <button @click="openDialog(swapDialNum)">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: ["swapDialNum"],
  methods: {
    openDialog(num) {
      this.$store.dispatch("openSwapDialog", num);
      // console.log(num);
    },
  },
};
</script>
