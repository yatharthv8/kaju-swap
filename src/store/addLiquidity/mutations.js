export default {
  liqDialog(state, payload) {
    state.liqDialog.bool = payload;
  },
  checkMaxLiqBal(state) {
    if (
      state.liqTokenAmount0 > state.liqTokenBal[0] ||
      state.liqTokenBal[0] == 0
    ) {
      state.insufficientLiqBal = true;
    } else {
      state.insufficientLiqBal = false;
    }
  },
};
