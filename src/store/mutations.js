export default {
  toggleOperationUnderProcess(state, payload) {
    // console.log("ok1", payload.val, payload.location);
    if (payload.val === true) {
      if (!state.waitToLoad) {
        state.OUP_TrueVal = payload.location;
        state.operationUnderProcess = payload.val;
      }
      if (payload.location === "getP") {
        state.waitToLoad = true;
      }
    } else {
      if (payload.location === state.OUP_TrueVal) {
        // console.log(payload.location);
        state.operationUnderProcess = payload.val;
        state.waitToLoad = false;
      }
    }
    // console.log(state, payload);
  },

  restoreInitialState(state) {
    state.network = "Network";
    state.account0 = null;
    state.balance = null;
    state.operationUnderProcess = false;
    state.OUP_TrueVal = "";
    state.selectedPoolLiq = null;
    state.allPairs = [];
    state.canLeave = true;
    state.showAccDialog = false;
    state.disconnect = true;
  },

  // resetState(state) {
  //   //addLiquidity
  //   state.addLiquidity.liqTokenAmount0 = null;
  //   state.addLiquidity.liqTokenAmount1 = null;
  //   state.addLiquidity.liqTokenBal = [0, 0];
  //   state.addLiquidity.liqTokenRes = [0, 0];
  //   state.addLiquidity.liqWatchInps = [false, false];
  //   state.addLiquidity.pairLiquidity = 0;
  //   state.addLiquidity.predictedLiq = [];
  // },
};
