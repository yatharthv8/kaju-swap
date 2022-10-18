export default {
  checkMaxRemLiqBal(state) {
    if (
      Number(state.pairLiqInp) > Number(state.pairLiquidity) ||
      Number(state.pairLiquidity) == 0
    ) {
      state.insufficientRemLiqBal = true;
    } else {
      state.insufficientRemLiqBal = false;
    }
  },
};
