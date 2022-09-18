import * as ethFunc from "../../ethereumFunctions.js";

const router = ethFunc.getRouter(process.env.VUE_APP_ROUTER);
const factory = ethFunc.getFactory(process.env.VUE_APP_FACTORY);

export default {
  checkMaxBalFor0(context) {
    context.commit("checkMaxBal", 0);
  },

  checkMaxBalFor1(context) {
    context.commit("checkMaxBal", 1);
  },

  closeSwapDialog(context) {
    context.commit("swapDialog", false);
  },

  openSwapDialog(context) {
    context.commit("swapDialog", true);
  },

  async swapToken(context) {
    context.dispatch("toggleOperationUnderProcess", {
      val: true,
      location: "swapTok",
    });
    context.rootState.canLeave = false;
    await ethFunc
      .swapTokens(
        context.getters.getSwapDialog.DialnumAdd[0],
        context.getters.getSwapDialog.DialnumAdd[1],
        context.state.amountToken0,
        router,
        context.rootState.account0,
        context.state.slippage
      )
      .then(() => {
        context.dispatch("displayReservesSwap");
        context.dispatch("toggleOperationUnderProcess", {
          val: false,
          location: "swapTok",
        });
        context.rootState.canLeave = true;
      })
      .catch((err) => {
        context.dispatch("toggleOperationUnderProcess", {
          val: false,
          location: "swapTok",
        });
        context.rootState.canLeave = true;
        console.log(err);
      });
  },

  async displayMaxTokenBalance(context, payload) {
    context.getters.getTokenBalText[payload.ind] =
      await ethFunc.getTokenBalance(payload.add, context.rootState.account0);
    context.commit("checkMaxBal");
  },

  async fillTokenAmount(context, payload) {
    context.dispatch("toggleOperationUnderProcess", {
      val: true,
      location: "fillTokAmt",
    });
    let address0 = context.getters.getSwapDialog.DialnumAdd[0];
    let address1 = context.getters.getSwapDialog.DialnumAdd[1];
    if (
      payload === 1 &&
      ((!context.state.watchInputs[0] && !context.state.watchInputs[1]) ||
        (context.state.watchInputs[0] && !context.state.watchInputs[1]))
    ) {
      context.state.swapWatchInp = true;
      context.state.watchInputs[0] = true;
      await ethFunc
        .getAmountOut(address0, address1, context.state.amountToken0, router)
        .then((data) => {
          context.state.amountToken1 = data;
        });
      setTimeout(() => {
        context.state.watchInputs[0] = false;
        context.state.watchInputs[1] = false;
        context.dispatch("toggleOperationUnderProcess", {
          val: false,
          location: "fillTokAmt",
        });
      }, 2000);
      console.log("inside 1st");
    } else if (
      payload === 0 &&
      ((!context.state.watchInputs[0] && !context.state.watchInputs[1]) ||
        (!context.state.watchInputs[0] && context.state.watchInputs[1]))
    ) {
      context.state.swapWatchInp = false;
      context.state.watchInputs[0] = true;
      await ethFunc
        .getAmountIn(address0, address1, context.state.amountToken1, router)
        .then((data) => {
          context.state.amountToken0 = data;
        });
      setTimeout(() => {
        context.state.watchInputs[0] = false;
        context.state.watchInputs[1] = false;
        context.dispatch("toggleOperationUnderProcess", {
          val: false,
          location: "fillTokAmt",
        });
      }, 2000);
      console.log("inside 2nd");
    }
  },

  async displayReservesSwap(context) {
    context.dispatch("toggleOperationUnderProcess", {
      val: true,
      location: "DispResSwap",
    });
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
        // console.log(context.getters.getTokenReserves);
      });
    context.getters.getTokenBalText[0] = await ethFunc.getTokenBalance(
      context.getters.getSwapDialog.DialnumAdd[0],
      context.rootState.account0
    );
    context.getters.getTokenBalText[1] = await ethFunc.getTokenBalance(
      context.getters.getSwapDialog.DialnumAdd[1],
      context.rootState.account0
    );
    context.dispatch("toggleOperationUnderProcess", {
      val: false,
      location: "DispResSwap",
    });
  },
};
