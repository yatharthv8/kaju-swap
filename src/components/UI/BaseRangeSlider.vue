<template>
  <vue3-slider
    v-model="valueC"
    color="#9c6644"
    :step="1"
    track-color="#dcd3ca"
    :height="4"
    :tooltip="true"
    tooltipText="%v%"
    tooltipColor="#fafafa5c"
    tooltipTextColor="#4e4245"
    width="100%"
    :handleScale="7"
    :alwaysShowHandle="true"
    @dragging="calcVal()"
    @drag-end="calcVal()"
  />
</template>

<script>
import slider from "vue3-slider";

let tooltipText = document.getElementsByClassName("tooltip");
export default {
  components: { "vue3-slider": slider },
  data() {
    return {
      valueC: 0,
    };
  },
  methods: {
    calcVal() {
      let text = tooltipText[0].innerHTML;
      text = text.slice(0, text.length - 1);
      this.$store.state.remLiquidity.pairLiqInp =
        (text / 100) * this.$store.state.remLiquidity.pairLiquidity;
    },
  },
  watch: {
    "$store.state.remLiquidity.pairLiqInp"(newVal) {
      this.valueC = Math.floor(
        (newVal / this.$store.state.remLiquidity.pairLiquidity) * 100
      );
    },
  },
};
</script>

<style scoped></style>
