import * as ethFunc from "../../ethereumFunctions.js";

const router = ethFunc.getRouter(process.env.VUE_APP_ROUTER);
const factory = ethFunc.getFactory(process.env.VUE_APP_FACTORY);

export default {
  closeSwapDialog(context) {
    context.commit("swapDialog", false);
  },

  openSwapDialog(context) {
    context.commit("swapDialog", true);
  },

  async swapToken(context) {
    context.dispatch("toggleOperationUnderProcess", true);
    await ethFunc
      .swapTokens(
        context.getters.getSwapDialog.DialnumAdd[0],
        context.getters.getSwapDialog.DialnumAdd[1],
        context.state.amountToken0,
        router,
        context.rootState.account0
      )
      .then(() => {
        context.dispatch("displayReservesSwap");
        context.dispatch("toggleOperationUnderProcess", false);
      })
      .catch((err) => {
        context.dispatch("toggleOperationUnderProcess", false);
        console.log(err);
      });
  },

  async displayMaxTokenBalance(context, payload) {
    context.getters.getTokenBalText[payload.ind] =
      await ethFunc.getTokenBalance(payload.add);
  },

  async fillTokenAmount(context, payload) {
    let address0;
    let address1;
    if (payload === 1) {
      address0 = context.getters.getSwapDialog.DialnumAdd[0];
      address1 = context.getters.getSwapDialog.DialnumAdd[1];
    } else {
      address1 = context.getters.getSwapDialog.DialnumAdd[0];
      address0 = context.getters.getSwapDialog.DialnumAdd[1];
    }
    context.state.amountToken1 = await ethFunc.getAmountOut(
      address0,
      address1,
      context.state.amountToken0,
      router
    );
  },

  async displayReservesSwap(context) {
    await ethFunc
      .getReserves(
        context.getters.getSwapDialog.DialnumAdd[0],
        context.getters.getSwapDialog.DialnumAdd[1],
        factory,
        context.rootState.account0
      )
      .then((swapReserves) => {
        context.getters.getTokenReserves[0] = swapReserves[0];
        context.getters.getTokenReserves[1] = swapReserves[1];
      });
    context.getters.getTokenBalText[0] = await ethFunc.getTokenBalance(
      context.getters.getSwapDialog.DialnumAdd[0]
    );
    context.getters.getTokenBalText[1] = await ethFunc.getTokenBalance(
      context.getters.getSwapDialog.DialnumAdd[1]
    );
  },
};
