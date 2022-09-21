import * as ethFunc from "../../ethereumFunctions.js";
import web3 from "../../../ethereum/web3.js";

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
          web3.utils.toWei(String(context.state.pairLiquidity), "ether")
        )
        .send({ from: context.rootState.account0 })
        .then(() => {
          context.rootState.tokenApprovalInProcess = false;
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
    context.rootState.tokenApprovalInProcess = false;
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
        context.rootState.tokenApprovalInProcess = true;
      })
      .catch((err) => {
        context.dispatch("toggleOperationUnderProcess", {
          val: false,
          location: "RemLiq",
        });
        context.rootState.canLeave = true;
        console.log(err);
        context.rootState.tokenApprovalInProcess = true;
      });
  },
};
