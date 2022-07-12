import { createStore } from "vuex";
import walletConnectModule from "./walletConnect/walletConnect.js";

import rootActions from "./actions.js";
import rootMutations from "./mutations.js";
import rootGetters from "./getters.js";

const store = createStore({
  modules: {
    walletConnect: walletConnectModule,
  },
  state() {
    return {
      network: "Network",
      account0: null,
      balance: null,
      isLoading: false,

      removeLiquidityPage: {
        PairAddress: null,
        pairTokenAddress: [null, null],
        symbol: [null, null],
        // liqToken0InputAmount: null,
        liqToken0: 0,
        liqToken1: 0,
        // liqToken1InputAmount: null,
        pairLiqInp: null,
        pairLiquidity: 0,
      },

      swapDialog: {
        bool: false,
        DialnumAdd: [process.env.VUE_APP_WETH, process.env.VUE_APP_UNI],
      },
      // symbolButtonIndex: null,
      swapTokenSymbol: ["WETH", "UNI"],
      amountToken0: null,
      amountToken1: null,
      tokenBalText: [0, 0],
      tokenReserves: [0, 0],
      selectedPoolLiq: null,
      allPairs: [],
      liquidityPageVar: {
        liqTokenSymbol: ["WETH", "UNI"],
        liqTokenAmount0: null, //For inputing in the form
        liqTokenAmount1: null, //For inputing in the form
        liqTokenBal: [0, 0], //Token Balance in Wallet - Display in BalResLiq
        liqTokenRes: [0, 0], //Token Reserves in Contract - Display in BalResLiq
        liqDialog: {
          //Dialog variable maintainence
          bool: false,
          DialnumAdd: [
            process.env.VUE_APP_WETH,
            "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
          ],
        },
        pairLiquidity: 0,
      },
    };
  },
  mutations: rootMutations,
  actions: rootActions,
  getters: rootGetters,
});

export default store;
