export default {
  checkMaxRemLiqBal(state) {
    if (state.pairLiqInp > state.pairLiquidity || state.pairLiquidity == 0) {
      state.insufficientRemLiqBal = true;
    } else {
      state.insufficientRemLiqBal = false;
    }
  },
};
