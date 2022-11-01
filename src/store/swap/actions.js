import * as ethFunc from "../../ethereumFunctions.js";
import web3 from "../../../ethereum/web3.js";
import swal from "sweetalert";

const ERC20 = require("../../../ethereum/.deps/npm/@rari-capital/solmate/src/tokens/artifacts/ERC20.json");

const router = ethFunc.getRouter(process.env.VUE_APP_ROUTER);
const factory = ethFunc.getFactory(process.env.VUE_APP_FACTORY);
const weth = ethFunc.getWeth(process.env.VUE_APP_WETH);

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

  async conversionRateSwap(context) {
    await ethFunc.getAmountOut(context.state.path, 1, router).then((data) => {
      if (context.state.pathExists) {
        // console.log(data);
        context.state.convertRate = data.toFixed(4);
      }
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
      swal("Success!!", "Token Approval Successful", "success");
    } catch (err) {
      console.log(err);
      swal("Oops!", "Token Approval Unsuccessful", "error");
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
    // context.dispatch("WETHnETHDealings", "Wap");
    await ethFunc
      .swapTokens(
        context.state.path,
        context.state.amountToken0,
        router,
        context.rootState.account0,
        context.state.slippage,
        context.state.deadline,
        context.rootState.marker
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

  async WETHnETHDealings(context) {
    context.dispatch("toggleOperationUnderProcess", {
      val: true,
      location: "WUw",
    });
    try {
      if (context.state.WrapUnwrap === "Wrap") {
        //Wrap
        await weth.methods.deposit().send({
          from: context.rootState.account0,
          value: web3.utils.toWei(String(context.state.amountToken0), "ether"),
        });
        await weth.methods
          .transfer(
            context.rootState.account0,
            web3.utils.toWei(String(context.state.amountToken0), "ether")
          )
          .call();
      } else {
        await weth.methods
          .withdraw(
            web3.utils.toWei(String(context.state.amountToken0), "ether")
          )
          .send({
            from: context.rootState.account0,
          });
      }
      context.dispatch("displayReservesSwap");
      swal(
        "Success!!",
        `Token ${context.state.WrapUnwrap}ing Successful`,
        "success"
      );
      context.dispatch("toggleOperationUnderProcess", {
        val: false,
        location: "WUw",
      });
    } catch (err) {
      console.log(`${context.state.WrapUnwrap}ing was not possible`);
      swal(
        "Oops!",
        `Token ${context.state.WrapUnwrap}ing Unsuccessful`,
        "error"
      );
      context.dispatch("toggleOperationUnderProcess", {
        val: false,
        location: "WUw",
      });
    }
  },

  async displayMaxTokenBalance(context, payload) {
    context.getters.getTokenBalText[payload.ind] =
      await ethFunc.getTokenBalance(
        payload.add,
        context.rootState.account0,
        payload.marker
      );
    context.commit("checkMaxBal");
  },

  checkIfPathExists(context) {
    const address0 = context.getters.getSwapDialog.DialnumAdd[0];
    const address1 = context.getters.getSwapDialog.DialnumAdd[1];
    const gAdd = ethFunc.bfs(context.rootState.graph.sides, address0);
    // console.log(
    //   context.rootState.symbolsGraph.sides,
    //   context.rootState.graph.sides
    // );
    let gSymb;
    if (
      context.rootState.marker === false &&
      context.state.swapTokenSymbol[0] === "WETH"
    ) {
      gSymb = ethFunc.bfs(context.rootState.symbolsGraph.sides, "ETH");
    } else {
      gSymb = ethFunc.bfs(
        context.rootState.symbolsGraph.sides,
        context.state.swapTokenSymbol[0]
      );
    }
    if (gAdd[address1] === undefined) {
      context.state.pathExists = false;
    } else {
      context.state.pathExists = true;
    }
    if (context.state.pathExists) {
      context.dispatch("makePath", { Add: gAdd, Symb: gSymb });
    }
  },

  makePath(context, payload) {
    const address0 = context.getters.getSwapDialog.DialnumAdd[0];
    const address1 = context.getters.getSwapDialog.DialnumAdd[1];
    let p = [address1];
    let s = [context.state.swapTokenSymbol[1]];
    let add = address1;
    let sy;
    if (
      context.rootState.marker === false &&
      context.state.swapTokenSymbol[1] === "WETH"
    ) {
      sy = "ETH";
    } else {
      sy = context.state.swapTokenSymbol[1];
    }
    while (add != address0) {
      p.push(payload.Add[add][0]);
      // console.log(payload.Symb[sy]);
      if (context.rootState.marker === false && payload.Symb[sy][0] === "ETH") {
        s.push("WETH");
      } else {
        s.push(payload.Symb[sy][0]);
      }
      add = payload.Add[add][0];
      sy = payload.Symb[sy][0];
    }
    context.state.path = p.reverse();
    context.state.symbolsPath = s.reverse();
    // console.log("here", context.state.path[0]);
  },

  async fillTokenAmount(context, payload) {
    context.dispatch("toggleOperationUnderProcess", {
      val: true,
      location: "fillTokAmt",
    });
    let address0 = context.getters.getSwapDialog.DialnumAdd[0];
    // let address1 = context.getters.getSwapDialog.DialnumAdd[1];
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
    if (context.state.pathExists) {
      if (
        payload === 1 &&
        ((!context.state.watchInputs[0] && !context.state.watchInputs[1]) ||
          (context.state.watchInputs[0] && !context.state.watchInputs[1]))
      ) {
        context.state.swapWatchInp = true;
        context.state.watchInputs[0] = true;
        await ethFunc
          .getAmountOut(context.state.path, context.state.amountToken0, router)
          .then((data) => {
            if (data === false || Number(data) < 1e-12) {
              context.state.insuffLiq = true;
              context.state.dispPriceImp = false;
            } else {
              context.state.dispPriceImp = true;
              context.dispatch("calcPriceImp");
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
          .getAmountIn(context.state.path, context.state.amountToken1, router)
          .then((data) => {
            if (data === false || Number(data) < 1e-12) {
              context.state.insuffLiq = true;
              context.state.dispPriceImp = false;
            } else {
              context.state.dispPriceImp = true;
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
    } else if (context.state.WrapUnwrap != null) {
      // --------
      context.state.insuffLiq = false;
      context.state.dispPriceImp = false;
      if (payload === 1) {
        context.state.amountToken1 = context.state.amountToken0;
      } else {
        context.state.amountToken0 = context.state.amountToken1;
      }
      context.dispatch("toggleOperationUnderProcess", {
        val: false,
        location: "fillTokAmt",
      });
    } else {
      swal(
        "Alert",
        "No route is available! Please Add Liquidity to make a path for swapping!",
        "warning"
      );
      context.dispatch("toggleOperationUnderProcess", {
        val: false,
        location: "fillTokAmt",
      });
    }
  },

  async calcPriceImp(context) {
    let PIA = 0;
    for (let i = 0; i < context.state.path.length - 1; ++i) {
      await ethFunc
        .getReserves(
          context.state.path[i],
          context.state.path[i + 1],
          factory,
          context.rootState.account0
        )
        .then((swapReserves) => {
          const a = swapReserves[0];
          const b = swapReserves[1];
          // console.log("reserves->", a, b);
          context.commit("calcPriceImp", { TA1: a, TA2: b });
          PIA += Number(context.state.priceImpValBack);
          // console.log(context.state.priceImpVal);
        });
    }
    // console.log(PIA);
    PIA = PIA / (context.state.path.length - 1);
    context.state.priceImpVal = PIA.toFixed(4);
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
    let TF = context.rootState.marker;
    if (context.state.WrapUnwrap != null) {
      if (context.state.WrapUnwrap === "Wrap") {
        TF = true;
      } else {
        TF = false;
      }
    }
    context.getters.getTokenBalText[0] = await ethFunc.getTokenBalance(
      context.getters.getSwapDialog.DialnumAdd[0],
      context.rootState.account0,
      TF
    );
    if (context.state.WrapUnwrap != null) {
      if (context.state.WrapUnwrap === "Unwrap") {
        TF = true;
      } else {
        TF = false;
      }
    }
    context.getters.getTokenBalText[1] = await ethFunc.getTokenBalance(
      context.getters.getSwapDialog.DialnumAdd[1],
      context.rootState.account0,
      TF
    );
    if (context.rootState.coins === null) {
      context.rootState.coins = JSON.parse(localStorage.getItem("coins"));
    }
    for (let i = 0; i < context.rootState.coins.length; ++i) {
      context.rootState.coins[i].balance = await ethFunc.getTokenBalance(
        context.rootState.coins[i].address,
        context.rootState.account0,
        context.rootState.coins[i].marker
      );
      if (context.rootState.coins[i].marker) {
        context.rootState.balance = context.rootState.coins[i].balance;
      }
    }
    context.dispatch("toggleOperationUnderProcess", {
      val: false,
      location: "DispResSwap",
    });
  },
};
