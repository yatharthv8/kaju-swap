export default {
  toggleOperationUnderProcess(state, payload) {
    if (payload.val == true) {
      state.OUP_TrueVal = payload.location;
      state.operationUnderProcess = payload.val;
    } else {
      if (payload.location == state.OUP_TrueVal) {
        state.operationUnderProcess = payload.val;
      }
    }
  },
};
