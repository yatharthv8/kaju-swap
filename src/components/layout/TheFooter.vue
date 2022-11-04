<template>
  <div class="nav-item-container-bottom">
    <router-link to="/swap">
      <button class="nav-item">Swap</button> </router-link
    >|
    <router-link to="/pool"><button class="nav-item">Pool</button></router-link
    >|
    <a href="https://info.uniswap.org/#/" target="_blank"
      ><button class="nav-item">Charts<sup>↗</sup></button></a
    >
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style scoped>
@media screen and (min-width: 800px) {
  .nav-item-container-bottom {
    display: none;
  }
}
@media screen and (max-width: 800px) {
  .nav-item-container-bottom {
    position: fixed;
    display: flex;
    bottom: 0;
    width: 100%;
    justify-content: space-around;
    background: var(--blur-bg);
    backdrop-filter: blur(0.8rem);
    /* -webkit-backdrop-filter: blur(10px); */
    border-radius: 1rem 1rem 0 0;
    align-items: center;
    /* margin-top: ; */
  }

  .nav-item {
    align-items: center;
  }
  .button {
    cursor: pointer;
    background-color: var(--nav-container-color);
    /* border-radius: 1rem; */
    padding: 0.5rem 0.75rem;
    /* border-color: var(--button-active-color); */
    border: none;
    font: inherit;
    color: inherit;
  }
}
</style>
