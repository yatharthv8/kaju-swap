import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";

export default {
  state() {
    return {
      swapDialog: {
        bool: false,
        DialnumAdd: [process.env.VUE_APP_WETH, process.env.VUE_APP_UNI],
      },
      swapTokenSymbol: ["WETH", "UNI"],
      amountToken0: null,
      amountToken1: null,
      tokenBalText: [0, 0],
      tokenReserves: [0, 0],
      insufficientBal: false,
      slippage: 10,
    };
  },
  mutations: mutations,
  actions: actions,
  getters: getters,
};
