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

  calcPriceImp(state) {
    const amountInWithFee = Number(state.amountToken0) * (1 - 0.003);
    const reserve_a_initial = Number(state.tokenReserves[0]);
    const reserve_b_initial = Number(state.tokenReserves[1]);
    const constant_product = reserve_a_initial * reserve_b_initial;
    const reserve_b_after_execution =
      constant_product / (reserve_a_initial + amountInWithFee);
    const amountOut = reserve_b_initial - reserve_b_after_execution;
    const market_price = amountInWithFee / amountOut;
    const mid_price = reserve_a_initial / reserve_b_initial;
    const price_impact = 1 - mid_price / market_price;
    state.priceImpVal = (price_impact * 100).toFixed(4);
    return price_impact;
  },
};
