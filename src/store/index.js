import { createStore } from "vuex";
import walletConnectModule from "./walletConnect/walletConnect.js";
import swapModule from "./swap/swap.js";
import addLiquidityModule from "./addLiquidity/addLiquidity.js";
import remLiquidityModule from "./remLiquidity/remLiquidity.js";

import rootActions from "./actions.js";
import rootMutations from "./mutations.js";
import rootGetters from "./getters.js";

import autoRouteGraph, * as graph from "../graph.js";

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
      allPairsForGraph: [],
      checkDone: false,
      canLeave: true,
      showAccDialog: false,
      disconnect: false,
      tokenApprovalInProcess: true,
      coins: JSON.parse(localStorage.getItem("coins")),
      pairsExistAndIs_SEL_Clicked: false,
      graph: new autoRouteGraph(),
      symbolsGraph: new autoRouteGraph(),
      symLP: [],
      marker: true,
    };
  },
  mutations: rootMutations,
  actions: rootActions,
  getters: rootGetters,
});

export default store;
