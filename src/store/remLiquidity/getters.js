export default {
  getSymbol(state) {
    return state.symbol;
  },
  getPairTokenAddress(state) {
    return state.pairTokenAddress;
  },
  getRemLiqTokenBal(state) {
    return state.remLiqTokenBal;
  },
  getRemLiqPredictedVal(state) {
    return state.predictedValues;
  },
};
