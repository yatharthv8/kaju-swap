<template>
  <div class="side-dropdown">
    <div @click="showOrHideDropdown()"><gearSvg></gearSvg></div>
    <div class="side-dropdown-content" :style="{ display: displayDropdown }">
      <!-- <p>Transaction Settings:</p> -->
      <div class="gear">
        Slippage Tolerance (%):
        <input
          type="percentage"
          placeholder="Default: 15%"
          step="1"
          min="0"
          name="slippage"
          id="slippage"
          v-model.trim="slippage"
        />
        Transaction Deadline (min):
        <input
          type="number"
          placeholder="Default: 10"
          step="1"
          min="0"
          name="deadline"
          id="deadline"
          v-model.trim="deadline"
        />
      </div>
      <div><button style="float: right" @click="submitInp()">OK</button></div>
    </div>
  </div>
</template>

<script>
import gearSvg from "../../assets/svg/gear.vue";
export default {
  components: { gearSvg },
  data() {
    return {
      displayDropdown: "none",
      slippage: 15,
      deadline: 10,
    };
  },
  methods: {
    showOrHideDropdown() {
      if (this.displayDropdown === "none") {
        this.displayDropdown = "block";
      } else {
        this.displayDropdown = "none";
      }
    },
    submitInp() {
      if (this.$route.path === "/swap") {
        this.$store.state.swap.slippage = this.slippage;
        this.$store.state.swap.deadline = this.deadline;
      } else {
        if (this.$route.path.search("addLiquidity") === 1) {
          this.$store.state.addLiquidity.slippageAddLiq = this.slippage;
          this.$store.state.addLiquidity.deadlineAddLiq = this.deadline;
        } else {
          if (this.$route.path.search("removeLiquidity") === 1) {
            this.$store.state.remLiquidity.slippageRemLiq = this.slippage;
            this.$store.state.remLiquidity.deadlineRemLiq = this.deadline;
          }
        }
      }
      this.showOrHideDropdown();
    },
  },
};
</script>

<style scoped>
.side-dropdown-content {
  height: auto;
  padding: 0.5rem;
  margin-top: 0;
  display: none;
  position: absolute;
  background-color: var(--nav-container-color);
}

input {
  width: calc(var(--card-element-width) - 15rem);
  height: auto;
  font-size: calc(var(--input-element-font-size) - 1rem);
}

button {
  background-color: var(--button-hover-color);
}

.gear {
  display: flex;
  flex-direction: column;
}
</style>
