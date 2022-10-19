import * as ethFunc from "../ethereumFunctions.js";

const factory = ethFunc.getFactory(process.env.VUE_APP_FACTORY);

export default {
  async getPairsFromFactory(context) {
    // if (!localStorage.getItem("pairs")) {
    context.state.allPairs = await ethFunc.getPairs(
      factory,
      context.rootState.account0
    );
    // }
  },

  toggleOperationUnderProcess(context, payload) {
    context.commit("toggleOperationUnderProcess", payload);
  },

  restoreInitialState(context) {
    context.commit("restoreInitialState");
    context.commit("toggleConnectWalletButton", false);
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
          for (let i = 0; i < context.state.allPairs.length; ++i) {
            // if (i != 0 && context.state.symLP.length < i) {
            const symb = await ethFunc.getDataForPairs(
              context.state.account0,
              context.state.allPairs[i]
            );
            context.state.symLP.push({
              address: context.state.allPairs[i],
              0: symb[0],
              1: symb[1],
              2: symb[2],
              3: symb[3],
              4: symb[6],
            });
            context.state.graph.addPairAsEdges(symb[2], symb[3]);
            // }
          }
          // if (!localStorage.getItem("pairs")) {
          //   // console.log(localStorage.getItem("coins"));
          //   localStorage.setItem(
          //     "pairs",
          //     JSON.stringify(context.state.allPairs)
          //   );
          // }
        }
        // else {
        // const symb = await ethFunc.getDataForPairs(
        //   context.state.account0,
        //   context.state.allPairs[0]
        // );
        // context.state.symLP.unshift({
        //   address: context.state.allPairs[0],
        //   0: symb[0],
        //   1: symb[1],
        //   2: symb[2],
        //   3: symb[3],
        //   4: symb[6],
        // });
        // context.state.graph.addPairAsEdges(symb[2], symb[3]);
        // }
        // console.log("behold this graph is here:", context.state.graph);
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
