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
};