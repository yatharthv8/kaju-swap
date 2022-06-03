<template>
  <TheHeader></TheHeader>
  <Home></Home>
</template>

<script>
import Home from "./views/Home.vue";
import TheHeader from "./components/layout/TheHeader.vue";
export default {
  components: { Home, TheHeader },
};
</script>
