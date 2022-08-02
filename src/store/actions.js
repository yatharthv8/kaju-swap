import * as ethFunc from "../ethereumFunctions.js";

const factory = ethFunc.getFactory(process.env.VUE_APP_FACTORY);

export default {
  async getPairsFromFactory(context) {
    context.state.allPairs = await ethFunc.getPairs(factory);
  },

  toggleOperationUnderProcess(context, payload) {
    context.commit("toggleOperationUnderProcess", payload);
  },

  restoreInitialState(context) {
    context.commit("restoreInitialState");
    context.commit("toggleConnectWalletButton", false);
  },
};
