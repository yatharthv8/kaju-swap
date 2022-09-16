export default {
  swapDialog(state, payload) {
    state.swapDialog.bool = payload;
  },
  checkMaxBal(state, payload) {
    if (payload === 0) {
      if (
        state.amountToken0 > state.tokenBalText[0] ||
        state.tokenBalText[0] == 0
      ) {
        state.insufficientBal = true;
      } else {
        state.insufficientBal = false;
      }
    } else if (payload === 1) {
      if (
        state.amountToken1 > state.tokenBalText[1] ||
        state.tokenBalText[1] == 0
      ) {
        state.insufficientBal = true;
      } else {
        state.insufficientBal = false;
      }
    }
  },
};
