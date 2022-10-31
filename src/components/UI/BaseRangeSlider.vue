<template>
  <div class="slider-buttons">
    <button @click="inputMiles(25)">25%</button>
    <button @click="inputMiles(50)">50%</button>
    <button @click="inputMiles(75)">75%</button>
    <button @click="inputMiles(100)">Max</button>
  </div>
  <vue3-slider
    class="slider"
    v-model="valueC"
    color="#9c6644"
    :step="1"
    track-color="#dcd3ca"
    :height="4"
    :tooltip="true"
    tooltipText="%v%"
    tooltipColor="#fafafa5c"
    tooltipTextColor="#4e4245"
    width="95%"
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
    async inputMiles(num) {
      this.valueC = num;
      setTimeout(() => {
        this.calcVal();
      }, 10);
    },
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

<style scoped>
.slider-buttons {
  margin: 1.5rem 0 0;
  width: -webkit-fill-available;
  display: flex;
  justify-content: space-evenly;
}
.slider {
  margin: 1.5rem 0 2.5rem;
}
</style>
