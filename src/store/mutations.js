export default {
  swapDialog(state, payload) {
    state.swapDialog.bool = payload;
  },
  liqDialog(state, payload) {
    state.liquidityPageVar.liqDialog.bool = payload;
  },
  displayReservesInConsole(state) {
    console.log(
      "token balance->",
      state.swapTokenSymbol[0],
      state.swapDialog.DialnumAdd[0],
      state.tokenBalText[0],
      "\n",
      state.swapTokenSymbol[1],
      state.swapDialog.DialnumAdd[1],
      state.tokenBalText[1]
    );
  },
};
