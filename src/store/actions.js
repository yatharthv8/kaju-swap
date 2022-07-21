import * as ethFunc from "../ethereumFunctions.js";

const factory = ethFunc.getFactory(process.env.VUE_APP_FACTORY);

export default {
  async getPairsFromFactory(context) {
    context.dispatch("toggleOperationUnderProcess", true);
    context.state.allPairs = await ethFunc.getPairs(factory);
    context.dispatch("toggleOperationUnderProcess", false);
  },

  toggleOperationUnderProcess(context, payload) {
    context.commit("toggleOperationUnderProcess", payload);
  },
};
