import { createStore } from "vuex";
import walletConnectModule from "./walletConnect/walletConnect.js";
import swapModule from "./swap/swap.js";
import addLiquidityModule from "./addLiquidity/addLiquidity.js";
import remLiquidityModule from "./remLiquidity/remLiquidity.js";

import rootActions from "./actions.js";
import rootMutations from "./mutations.js";
import rootGetters from "./getters.js";

const store = createStore({
  modules: {
    walletConnect: walletConnectModule,
    swap: swapModule,
    addLiquidity: addLiquidityModule,
    remLiquidity: remLiquidityModule,
  },
  state() {
    return {
      network: "Network",
      account0: null,
      balance: null,
      operationUnderProcess: false,
      OUP_TrueVal: "",
      selectedPoolLiq: null,
      allPairs: [],
      canLeave: true,
      showAccDialog: false,
      disconnect: false,
    };
  },
  mutations: rootMutations,
  actions: rootActions,
  getters: rootGetters,
});

export default store;
