<template>
  <div class="home">
    <img class="logo" src="../assets/KajuToken.png" alt="Kaju logo" />
    <br />
    <div>Welcome to Kaju-swap exchange.</div>
    <br />
    <br />
    <div>
      To got to the exchange, click <router-link to="/swap">here</router-link>.
    </div>
  </div>
</template>

<style scoped>
.logo {
  width: 10rem;
  height: auto;
}

.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 8rem;
  height: 95vh;
}
</style>
