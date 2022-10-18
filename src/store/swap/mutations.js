export default {
  swapDialog(state, payload) {
    state.swapDialog.bool = payload;
    // if (payload === false) {
    //   state.liqTokenAmount0 = null;
    //   state.liqTokenAmount1 = null;
    // }
  },
  checkMaxBal(state, payload) {
    if (payload === 0) {
      if (
        Number(state.amountToken0) > Number(state.tokenBalText[0]) ||
        Number(state.tokenBalText[0]) == 0
      ) {
        state.insufficientBal = true;
      } else {
        state.insufficientBal = false;
      }
    } else if (payload === 1) {
      if (
        Number(state.amountToken1) > Number(state.tokenBalText[1]) ||
        Number(state.tokenBalText[1]) == 0
      ) {
        state.insufficientBal = true;
      } else {
        state.insufficientBal = false;
      }
    }
  },
};
