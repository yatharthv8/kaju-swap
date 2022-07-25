import * as ethFunc from "../../ethereumFunctions.js";

const router = ethFunc.getRouter(process.env.VUE_APP_ROUTER);
const factory = ethFunc.getFactory(process.env.VUE_APP_FACTORY);

export default {
  async checkMaxRemLiqBalDispPV(context) {
    context.commit("checkMaxRemLiqBal");
    await ethFunc
      .quoteRemoveLiquidity(
        context.getters.getPairTokenAddress[0],
        context.getters.getPairTokenAddress[1],
        context.state.pairLiqInp,
        factory
      )
      .then((data) => {
        context.state.predictedValues = data;
      });
  },

  async getDataForLiqRemPage(context, payload) {
    context.dispatch("toggleOperationUnderProcess", {
      val: true,
      location: "DataLiqRemPage",
    });
    context.state.pairAddress = payload;
    const resAndSymb = await ethFunc.getDataForPairs(
      context.rootState.account0,
      payload
    );

    context.getters.getPairTokenAddress[0] = resAndSymb[2];
    context.getters.getPairTokenAddress[1] = resAndSymb[3];
    context.getters.getRemLiqTokenBal[0] = resAndSymb[4];
    context.getters.getRemLiqTokenBal[1] = resAndSymb[5];
    const liqReserves = await ethFunc.getReserves(
      context.getters.getPairTokenAddress[0],
      context.getters.getPairTokenAddress[1],
      factory,
      context.rootState.account0
    );
    context.getters.getSymbol[0] = resAndSymb[0];
    context.getters.getSymbol[1] = resAndSymb[1];
    context.state.pairLiquidity = liqReserves[2];
    context.dispatch("toggleOperationUnderProcess", {
      val: false,
      location: "DataLiqRemPage",
    });
  },

  async removeLiquidity(context) {
    context.dispatch("toggleOperationUnderProcess", {
      val: true,
      location: "RemLiq",
    });
    context.rootState.canLeave = false;
    await ethFunc
      .removeLiquidity(
        context.getters.getPairTokenAddress[0],
        context.getters.getPairTokenAddress[1],
        context.state.pairLiqInp,
        (context.getters.getRemLiqPredictedVal[1] *
          (100 - context.state.slippageRemLiq)) /
          100,
        (context.getters.getRemLiqPredictedVal[2] *
          (100 - context.state.slippageRemLiq)) /
          100,
        router,
        context.rootState.account0,
        factory
      )
      .then(() => {
        context.dispatch("getDataForLiqRemPage", context.state.pairAddress);
        context.dispatch("toggleOperationUnderProcess", {
          val: false,
          location: "RemLiq",
        });
        context.rootState.canLeave = true;
      })
      .catch((err) => {
        context.dispatch("toggleOperationUnderProcess", {
          val: false,
          location: "RemLiq",
        });
        context.rootState.canLeave = true;
        console.log(err);
      });
  },
};
