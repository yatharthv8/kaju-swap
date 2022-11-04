import * as ethFunc from "../ethereumFunctions.js";

const factory = ethFunc.getFactory(process.env.VUE_APP_FACTORY);

export default {
  async getPairsFromFactory(context) {
    context.dispatch("toggleOperationUnderProcess", {
      val: true,
      location: "getP",
    });
    if (context.state.loadAllPairsByFetch) {
      // console.log("liquidity added or pairs not in storage");
      const returnedPairs = await ethFunc.getPairs(
        factory,
        context.state.account0
      );
      context.state.allPairs = returnedPairs[0];
      context.state.allPairsForGraph = returnedPairs[1];
      context.state.loadAllPairsByFetch = false;
    } else {
      context.state.allPairsForGraph = JSON.parse(
        localStorage.getItem("allPairs")
      );
      context.state.allPairs = JSON.parse(localStorage.getItem("userPairs"));
    }
    // console.log(
    //   "pairs->>",
    //   context.state.allPairsForGraph,
    //   context.state.allPairs
    // );
    context.dispatch("registerAllPairs");
  },

  toggleOperationUnderProcess(context, payload) {
    context.commit("toggleOperationUnderProcess", payload);
  },

  restoreInitialState(context) {
    context.commit("restoreInitialState");
    context.commit("toggleConnectWalletButton", false);
  },

  async registerAllPairs(context) {
    for (let i = 0; i < context.state.allPairsForGraph.length; ++i) {
      const symb = await ethFunc.getDataForPairs(
        context.state.account0,
        context.state.allPairsForGraph[i],
        true
      );
      context.state.symbolsGraph.addPairAsEdges(symb[0], symb[1]);
      context.state.graph.addPairAsEdges(symb[2], symb[3]);
    }
    console.log("pairs registered!");
    context.dispatch("toggleOperationUnderProcess", {
      val: false,
      location: "getP",
    });
  },

  registerExistingLiquidity(context) {
    context.dispatch("toggleOperationUnderProcess", {
      val: true,
      location: "regExLiq",
    });
    context
      .dispatch("getPairsFromFactory")
      .then(async () => {
        if (context.state.allPairs.length > 0) {
          context.state.pairsExistAndIs_SEL_Clicked = true;
          context.state.symLP = [];
          for (let i = 0; i < context.state.allPairs.length; ++i) {
            // if (i != 0 && context.state.symLP.length < i) {
            const symb = await ethFunc.getDataForPairs(
              context.state.account0,
              context.state.allPairs[i],
              true
            );
            context.state.symLP.push({
              address: context.state.allPairs[i],
              0: symb[0],
              1: symb[1],
              2: symb[2],
              3: symb[3],
              4: symb[6],
            });
          }
        }
      })
      .then(() => {
        context.dispatch("toggleOperationUnderProcess", {
          val: false,
          location: "regExLiq",
        });
      })
      .catch((err) => {
        console.log("This action can't be completed at the moment!", err);
        context.dispatch("toggleOperationUnderProcess", {
          val: false,
          location: "regExLiq",
        });
      });
  },
};
