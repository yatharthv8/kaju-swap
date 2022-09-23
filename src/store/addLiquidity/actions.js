import * as ethFunc from "../../ethereumFunctions.js";
import web3 from "../../../ethereum/web3.js";

const ERC20 = require("../../../ethereum/.deps/npm/@rari-capital/solmate/src/tokens/artifacts/ERC20.json");

const router = ethFunc.getRouter(process.env.VUE_APP_ROUTER);
const factory = ethFunc.getFactory(process.env.VUE_APP_FACTORY);

export default {
  checkMaxLiqBal(context) {
    context.commit("checkMaxLiqBal");
  },

  closeLiqDialog(context) {
    context.commit("liqDialog", false);
  },

  openLiqDialog(context) {
    context.commit("liqDialog", true);
  },

  async displayMaxTokenBalanceLiq(context, payload) {
    context.getters.getLiqTokenBal[payload.ind] = await ethFunc.getTokenBalance(
      payload.add,
      context.rootState.account0
    );
  },

  async approveLiq(context) {
    context.dispatch("toggleOperationUnderProcess", {
      val: true,
      location: "ApprovTokL",
    });
    try {
      const token0 = new web3.eth.Contract(
        ERC20.abi,
        context.getters.getLiqDialog.DialnumAdd[0]
      );
      const token1 = new web3.eth.Contract(
        ERC20.abi,
        context.getters.getLiqDialog.DialnumAdd[1]
      );
      if (
        web3.utils.fromWei(
          await token0.methods
            .allowance(context.rootState.account0, process.env.VUE_APP_ROUTER)
            .call(),
          "ether"
        ) < context.state.liqTokenAmount0
      ) {
        await token0.methods
          .approve(
            router.options.address,
            web3.utils.toWei("10000000000", "ether")
          )
          .send({ from: context.rootState.account0 })
          .then(() => {
            context.rootState.tokenApprovalInProcess = false;
          });
      }
      if (
        web3.utils.fromWei(
          await token1.methods
            .allowance(context.rootState.account0, process.env.VUE_APP_ROUTER)
            .call(),
          "ether"
        ) < context.state.liqTokenAmount1
      ) {
        await token1.methods
          .approve(
            router.options.address,
            web3.utils.toWei("10000000000", "ether")
          )
          .send({ from: context.rootState.account0 })
          .then(() => {
            context.rootState.tokenApprovalInProcess = false;
          });
      }
      context.dispatch("toggleOperationUnderProcess", {
        val: false,
        location: "ApprovTokL",
      });
    } catch (err) {
      console.log(err);
      context.dispatch("toggleOperationUnderProcess", {
        val: false,
        location: "ApprovTokL",
      });
    }
  },

  async addLiquidity(context) {
    context.dispatch("toggleOperationUnderProcess", {
      val: true,
      location: "addLiq",
    });
    context.rootState.canLeave = false;
    await ethFunc
      .addLiquidity(
        context.getters.getLiqDialog.DialnumAdd[0],
        context.getters.getLiqDialog.DialnumAdd[1],
        context.state.liqTokenAmount0,
        context.state.liqTokenAmount1,
        context.state.slippageAddLiq,
        router,
        context.rootState.account0
      )
      .then(() => {
        context.dispatch("displayReservesPool");
        context.dispatch("toggleOperationUnderProcess", {
          val: false,
          location: "addLiq",
        });
        context.rootState.canLeave = true;
      })
      .catch((err) => {
        context.dispatch("toggleOperationUnderProcess", {
          val: false,
          location: "addLiq",
        });
        context.rootState.canLeave = true;
        console.log(err);
      });
  },

  async displayReservesPool(context) {
    try {
      context.dispatch("toggleOperationUnderProcess", {
        val: true,
        location: "DispResPool",
      });
      const liqReserves = await ethFunc.getReserves(
        context.getters.getLiqDialog.DialnumAdd[0],
        context.getters.getLiqDialog.DialnumAdd[1],
        factory,
        context.rootState.account0
      );
      context.getters.getLiqTokenRes[0] = liqReserves[0];
      context.getters.getLiqTokenRes[1] = liqReserves[1];
      context.state.pairLiquidity = liqReserves[2];
      // console.log("then inside displayReservesPool->", liqReserves);
      context.getters.getLiqTokenBal[0] = await ethFunc.getTokenBalance(
        context.getters.getLiqDialog.DialnumAdd[0],
        context.rootState.account0
      );
      context.getters.getLiqTokenBal[1] = await ethFunc.getTokenBalance(
        context.getters.getLiqDialog.DialnumAdd[1],
        context.rootState.account0
      );
      if (
        context.getters.getLiqDialog.DialnumAdd[0] === process.env.VUE_APP_WETH
      ) {
        context.rootState.balance = context.getters.getLiqTokenBal[0];
      } else if (
        context.getters.getLiqDialog.DialnumAdd[1] === process.env.VUE_APP_WETH
      ) {
        context.rootState.balance = context.getters.getLiqTokenBal[1];
      }
      context.dispatch("toggleOperationUnderProcess", {
        val: false,
        location: "DispResPool",
      });
    } catch {
      console.log(
        "There seems to be some error retrieving Reserves! Sorry for the inconvenience caused!"
      );
      alert(
        "There seems to be some error retrieving Reserves! Sorry for the inconvenience caused!"
      );
      context.dispatch("toggleOperationUnderProcess", {
        val: false,
        location: "DispResPool",
      });
    }
  },

  async fillLiqTokenAmt(context, payload) {
    context.dispatch("toggleOperationUnderProcess", {
      val: true,
      location: "fillLiqTokAmt",
    });
    let address0 = context.getters.getLiqDialog.DialnumAdd[0];
    let address1 = context.getters.getLiqDialog.DialnumAdd[1];
    const token0 = new web3.eth.Contract(ERC20.abi, address0);
    const token1 = new web3.eth.Contract(ERC20.abi, address1);
    const approvedAmt0 = web3.utils.fromWei(
      await token0.methods
        .allowance(context.rootState.account0, process.env.VUE_APP_ROUTER)
        .call(),
      "ether"
    );
    const approvedAmt1 = web3.utils.fromWei(
      await token1.methods
        .allowance(context.rootState.account0, process.env.VUE_APP_ROUTER)
        .call(),
      "ether"
    );
    if (
      approvedAmt0 < context.state.liqTokenAmount0 ||
      approvedAmt1 < context.state.liqTokenAmount1
    ) {
      context.rootState.tokenApprovalInProcess = true;
    } else {
      context.rootState.tokenApprovalInProcess = false;
    }
    let amount;
    if (
      payload === 1 &&
      ((!context.state.liqWatchInps[0] && !context.state.liqWatchInps[1]) ||
        (context.state.liqWatchInps[0] && !context.state.liqWatchInps[1]))
    ) {
      context.state.liqWatchInps[0] = true;
      amount =
        context.state.liqTokenAmount0 *
        (context.getters.getLiqTokenRes[1] / context.getters.getLiqTokenRes[0]);
      await ethFunc
        .quoteAddLiquidity(
          address0,
          address1,
          context.state.liqTokenAmount0,
          amount,
          factory,
          0
        )
        .then((data) => {
          context.state.predictedLiq = data;
          context.state.liqTokenAmount1 = context.state.predictedLiq[1];
        });
      setTimeout(() => {
        context.state.liqWatchInps[0] = false;
        context.state.liqWatchInps[1] = false;
        context.dispatch("toggleOperationUnderProcess", {
          val: false,
          location: "fillLiqTokAmt",
        });
      }, 2000);
    } else if (
      payload === 0 &&
      ((!context.state.liqWatchInps[0] && !context.state.liqWatchInps[1]) ||
        (!context.state.liqWatchInps[0] && context.state.liqWatchInps[1]))
    ) {
      context.state.liqWatchInps[1] = true;
      amount =
        context.state.liqTokenAmount1 *
        (context.getters.getLiqTokenRes[0] / context.getters.getLiqTokenRes[1]);
      await ethFunc
        .quoteAddLiquidity(
          address0,
          address1,
          amount,
          context.state.liqTokenAmount1,
          factory,
          1
        )
        .then((data) => {
          context.state.predictedLiq = data;
          context.state.liqTokenAmount0 = context.state.predictedLiq[0];
        });
      setTimeout(() => {
        context.state.liqWatchInps[0] = false;
        context.state.liqWatchInps[1] = false;
        context.dispatch("toggleOperationUnderProcess", {
          val: false,
          location: "fillLiqTokAmt",
        });
      }, 2000);
    }
  },
};
