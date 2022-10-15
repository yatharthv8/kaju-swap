export default {
  liqDialog(state, payload) {
    state.liqDialog.bool = payload;
    if (payload === false) {
      state.liqTokenAmount0 = null;
      state.liqTokenAmount1 = null;
    }
  },
  checkMaxLiqBal(state) {
    if (
      state.liqTokenAmount0 > state.liqTokenBal[0] ||
      state.liqTokenBal[0] == 0 ||
      state.liqTokenAmount1 > state.liqTokenBal[1] ||
      state.liqTokenBal[1] == 0
    ) {
      state.insufficientLiqBal = true;
    } else {
      state.insufficientLiqBal = false;
    }
  },
  resetAddLiqState(state) {
    state.liqTokenAmount0 = null;
    state.liqTokenAmount1 = null;
    state.liqTokenBal = [0, 0];
    state.liqTokenRes = [0, 0];
    state.liqWatchInps = [false, false];
    state.pairLiquidity = 0;
    state.predictedLiq = [];
  },
};
