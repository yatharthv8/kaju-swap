import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";

export default {
  state() {
    return {
      liqTokenSymbol: ["ETH", "UNI"],
      liqTokenAmount0: null, //For inputing in the form
      liqTokenAmount1: null, //For inputing in the form
      liqTokenBal: [0, 0], //Token Balance in Wallet - Display in BalResLiq
      liqTokenRes: [0, 0], //Token Reserves in Contract - Display in BalResLiq
      liqDialog: {
        //Dialog variable maintainence
        bool: false,
        DialnumAdd: [process.env.VUE_APP_WETH, process.env.VUE_APP_UNI],
      },
      liqWatchInps: [false, false],
      pairLiquidity: 0,
      pairLiqPer: null,
      predictedLiq: [],
      totalSupply: 0,
      insufficientLiqBal: false,
      slippageAddLiq: 15,
      deadlineAddLiq: 10,
      LiqExists: false,
    };
  },
  mutations: mutations,
  actions: actions,
  getters: getters,
};
