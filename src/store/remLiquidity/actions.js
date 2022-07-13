import * as ethFunc from "../../ethereumFunctions.js";

const router = ethFunc.getRouter(process.env.VUE_APP_ROUTER);
const factory = ethFunc.getFactory(process.env.VUE_APP_FACTORY);

export default {
  async getDataForLiqRemPage(context, payload) {
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
  },

  async removeLiquidity(context) {
    // console.log(context);
    context.dispatch("toggleOperationUnderProcess", true);
    await ethFunc
      .removeLiquidity(
        context.getters.getPairTokenAddress[0],
        context.getters.getPairTokenAddress[1],
        context.state.pairLiqInp,
        0,
        0,
        router,
        context.rootState.account0,
        factory
      )
      .then(() => {
        context.dispatch("getDataForLiqRemPage", context.state.pairAddress);
        context.dispatch("toggleOperationUnderProcess", false);
      })
      .catch((err) => {
        context.dispatch("toggleOperationUnderProcess", false);
        console.log(err);
      });
  },
};
