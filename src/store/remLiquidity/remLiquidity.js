import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";

export default {
  state() {
    return {
      pairAddress: null,
      pairTokenAddress: [null, null],
      symbol: [null, null],
      remLiqTokenBal: [0, 0],
      pairLiqInp: null,
      pairLiquidity: 0,
    };
  },
  mutations: mutations,
  actions: actions,
  getters: getters,
};
