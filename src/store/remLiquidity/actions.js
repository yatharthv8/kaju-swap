import * as ethFunc from "../../ethereumFunctions.js";
import web3 from "../../../ethereum/web3.js";
import swal from "sweetalert";

const PAIR = require("../../../ethereum/contracts/artifacts/KajuswapPair.json");

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

  async approveRemLiq(context) {
    context.dispatch("toggleOperationUnderProcess", {
      val: true,
      location: "ApprovTokRL",
    });
    try {
      const pair = new web3.eth.Contract(PAIR.abi, context.state.pairAddress);

      await pair.methods
        .approve(
          router.options.address,
          web3.utils.toWei("10000000000", "ether")
        )
        .send({ from: context.rootState.account0 })
        .then(() => {
          context.rootState.tokenApprovalInProcess = false;
          swal("Success", "LP Token approval Successful!", "success");
        })
        .catch((err) => {
          swal("Oops!", "Approval Unsuccessful!", "error");
        });
      context.dispatch("toggleOperationUnderProcess", {
        val: false,
        location: "ApprovTokRL",
      });
    } catch (err) {
      console.log(err);
      context.dispatch("toggleOperationUnderProcess", {
        val: false,
        location: "ApprovTokRL",
      });
    }
  },

  async getDataForLiqRemPage(context, payload) {
    context.dispatch("toggleOperationUnderProcess", {
      val: true,
      location: "DataLiqRemPage",
    });
    context.state.pairAddress = payload;
    const resAndSymb = await ethFunc.getDataForPairs(
      context.rootState.account0,
      payload,
      true
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
    context.state.pairLiquidityPer = liqReserves[3];
    const pair = new web3.eth.Contract(PAIR.abi, context.state.pairAddress);
    const approvedAmt = web3.utils.fromWei(
      await pair.methods
        .allowance(context.rootState.account0, process.env.VUE_APP_ROUTER)
        .call(),
      "ether"
    );
    if (approvedAmt < context.state.pairLiquidity) {
      context.rootState.tokenApprovalInProcess = true;
    } else {
      context.rootState.tokenApprovalInProcess = false;
    }
    if (context.getters.getPairTokenAddress[0] === process.env.VUE_APP_WETH) {
      context.rootState.balance = context.getters.getRemLiqTokenBal[0];
    } else if (
      context.getters.getPairTokenAddress[1] === process.env.VUE_APP_WETH
    ) {
      context.rootState.balance = context.getters.getRemLiqTokenBal[1];
    }
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
        context.state.deadlineRemLiq
      )
      .then(async (data) => {
        if (data === true) {
          context.dispatch("getDataForLiqRemPage", context.state.pairAddress);
          context.dispatch("registerExistingLiquidity");
        }
        context.dispatch("toggleOperationUnderProcess", {
          val: false,
          location: "RemLiq",
        });
        if (context.rootState.coins === null) {
          context.rootState.coins = JSON.parse(localStorage.getItem("coins"));
        }
        for (let i = 0; i < context.rootState.coins.length; ++i) {
          context.rootState.coins[i].balance = await ethFunc.getTokenBalance(
            context.rootState.coins[i].address,
            context.rootState.account0,
            context.rootState.coins[i].marker
          );
        }
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
