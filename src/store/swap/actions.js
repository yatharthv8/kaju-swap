import * as ethFunc from "../../ethereumFunctions.js";
import web3 from "../../../ethereum/web3.js";

const ERC20 = require("../../../ethereum/.deps/npm/@rari-capital/solmate/src/tokens/artifacts/ERC20.json");

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

  async converstionRateSwap(context) {
    await ethFunc
      .getAmountOut(
        context.getters.getSwapDialog.DialnumAdd[1],
        context.getters.getSwapDialog.DialnumAdd[0],
        1,
        router
      )
      .then((data) => {
        context.state.convertRate = data.toFixed(4);
      });
  },

  async approveSwap(context) {
    context.dispatch("toggleOperationUnderProcess", {
      val: true,
      location: "ApprovTokS",
    });
    try {
      const token0 = new web3.eth.Contract(
        ERC20.abi,
        context.getters.getSwapDialog.DialnumAdd[0]
      );
      await token0.methods
        .approve(
          router.options.address,
          web3.utils.toWei("10000000000", "ether")
        )
        .send({ from: context.rootState.account0 })
        .then(() => {
          context.rootState.tokenApprovalInProcess = false;
        });
      context.dispatch("toggleOperationUnderProcess", {
        val: false,
        location: "ApprovTokS",
      });
    } catch (err) {
      console.log(err);
      context.dispatch("toggleOperationUnderProcess", {
        val: false,
        location: "ApprovTokS",
      });
    }
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
        context.state.slippage,
        context.state.deadline
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
    const token0 = new web3.eth.Contract(ERC20.abi, address0);
    const approvedAmt = web3.utils.fromWei(
      await token0.methods
        .allowance(context.rootState.account0, process.env.VUE_APP_ROUTER)
        .call(),
      "ether"
    );
    if (approvedAmt < context.state.amountToken0) {
      context.rootState.tokenApprovalInProcess = true;
    } else {
      context.rootState.tokenApprovalInProcess = false;
    }
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
          if (data === false || Number(data) < 1e-12) {
            context.state.insuffLiq = true;
          } else {
            context.state.amountToken1 = data;
            context.state.insuffLiq = false;
          }
        });
      setTimeout(() => {
        context.state.watchInputs[0] = false;
        context.state.watchInputs[1] = false;
        context.dispatch("toggleOperationUnderProcess", {
          val: false,
          location: "fillTokAmt",
        });
      }, 2000);
      // console.log("inside 1st");
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
          if (data === false || Number(data) < 1e-12) {
            context.state.insuffLiq = true;
          } else {
            context.state.amountToken0 = data;
            context.state.insuffLiq = false;
          }
        });
      setTimeout(() => {
        context.state.watchInputs[0] = false;
        context.state.watchInputs[1] = false;
        context.dispatch("toggleOperationUnderProcess", {
          val: false,
          location: "fillTokAmt",
        });
      }, 2000);
      // console.log("inside 2nd");
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
    if (
      context.getters.getSwapDialog.DialnumAdd[0] === process.env.VUE_APP_WETH
    ) {
      context.rootState.balance = context.getters.getTokenBalText[0];
    } else if (
      context.getters.getSwapDialog.DialnumAdd[1] === process.env.VUE_APP_WETH
    ) {
      context.rootState.balance = context.getters.getTokenBalText[1];
    }
    if (context.rootState.coins === null) {
      context.rootState.coins = JSON.parse(localStorage.getItem("coins"));
    }
    for (let i = 0; i < context.rootState.coins.length; ++i) {
      context.rootState.coins[i].balance = await ethFunc.getTokenBalance(
        context.rootState.coins[i].address,
        context.rootState.account0
      );
    }
    context.dispatch("toggleOperationUnderProcess", {
      val: false,
      location: "DispResSwap",
    });
  },
};
