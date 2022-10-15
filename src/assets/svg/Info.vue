<template>
  <div class="img-wrap">
    <img svg-inline svg-sprite alt="Info" src="./info.svg" />
    <p class="img-description">
      Your Position has 0 Liquidity and is not earning Fees. Add Liquidity to
      restart the pool!
    </p>
  </div>
</template>

<style>
.img-wrap {
  position: relative;
  height: auto;
  width: auto;
}
.img-description {
  font-size: 0.8rem;
  position: absolute;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  width: 14rem;
  text-align: justify;
  height: fit-content;
  top: -2rem;
  bottom: 0;
  left: -14rem;
  right: 0;
  background: #0000005c;
  color: #000000;
  visibility: hidden;
  opacity: 0;

  /* transition effect. not necessary */
  transition: opacity 0.2s, visibility 0.2s;
}
.img-wrap:hover .img-description {
  visibility: visible;
  opacity: 1;
}
</style>
