<template>
  <div class="wrapper">
    <TheHeader></TheHeader>
    <base-spinner v-if="$store.state.operationUnderProcess"></base-spinner>
    <router-view></router-view>
    <TheFooter></TheFooter>
  </div>
</template>

<script>
import TheHeader from "./components/layout/TheHeader.vue";
import TheFooter from "./components/layout/TheFooter.vue";

export default {
  components: { TheHeader, TheFooter },
};
</script>
