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
  resetRemLiqState(state) {
    state.pairLiqInp = null;
    state.pairLiquidityPer = null;
    state.predictedValues = [];
    state.remLiqTokenBal = [0, 0];
    // state.pairLiquidity = 0;
  },
};
