export default {
  getLiqDialog(state) {
    return state.liqDialog;
  },
  getLiqTokenSymbol(state) {
    return state.liqTokenSymbol;
  },
  getLiqTokenBal(state) {
    return state.liqTokenBal;
  },
  getLiqTokenRes(state) {
    return state.liqTokenRes;
  },
  getBaseLiqRoute(state) {
    return (
      "/addLiquidity/" +
      state.liqDialog.DialnumAdd[0] +
      "/" +
      state.liqDialog.DialnumAdd[1]
    );
  },
};
