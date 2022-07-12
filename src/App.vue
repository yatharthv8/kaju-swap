<template>
  <div class="wrapper">
    <TheHeader></TheHeader>
    <router-view></router-view>
    <TheFooter></TheFooter>
  </div>
</template>

<script>
import TheHeader from "./components/layout/TheHeader.vue";
import TheFooter from "./components/layout/TheFooter.vue";

export default {
  components: { TheHeader, TheFooter },
  //   mounted() {
  //     this.$store.dispatch("onConnect");
  //     console.log("mounted");
  //   },
};
</script>
