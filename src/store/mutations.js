export default {
  toggleOperationUnderProcess(state, payload) {
    // console.log("ok1", payload.val, payload.location);
    if (payload.val == true) {
      state.OUP_TrueVal = payload.location;
      state.operationUnderProcess = payload.val;
    } else {
      if (payload.location == state.OUP_TrueVal) {
        state.operationUnderProcess = payload.val;
      }
    }
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
};
