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
      pathExists: true,
      watchInputs: [false, false],
      swapWatchInp: true,
      path: [process.env.VUE_APP_WETH, process.env.VUE_APP_UNI],
      symbolsPath: ["ETH", "UNI"],
      swapTokenSymbol: ["ETH", "UNI"],
      amountToken0: null,
      amountToken1: null,
      tokenBalText: [0, 0],
      tokenReserves: [0, 0],
      insufficientBal: false,
      slippage: 15,
      deadline: 10,
      convertRate: 0,
      insuffLiq: false,
      dispPriceImp: false,
      priceImpVal: null,
      priceImpValBack: null,
    };
  },
  mutations: mutations,
  actions: actions,
  getters: getters,
};
