import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";

export default {
  state() {
    return {
      liqTokenSymbol: ["WETH", "UNI"],
      liqTokenAmount0: null, //For inputing in the form
      liqTokenAmount1: null, //For inputing in the form
      liqTokenBal: [0, 0], //Token Balance in Wallet - Display in BalResLiq
      liqTokenRes: [0, 0], //Token Reserves in Contract - Display in BalResLiq
      liqDialog: {
        //Dialog variable maintainence
        bool: false,
        DialnumAdd: [process.env.VUE_APP_WETH, process.env.VUE_APP_UNI],
      },
      pairLiquidity: 0,
    };
  },
  mutations: mutations,
  actions: actions,
  getters: getters,
};
