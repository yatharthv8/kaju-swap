<template>
  <button @click="openDialog()">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: [],
  methods: {
    openDialog() {
      this.$store.dispatch("openSwapDialog");
      // console.log(num);
    },
  },
};
</script>
