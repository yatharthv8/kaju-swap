import * as ethFunc from "../ethereumFunctions.js";

const router = ethFunc.getRouter(process.env.VUE_APP_ROUTER);
const factory = ethFunc.getFactory(process.env.VUE_APP_FACTORY);

export default {
  async getDataForLiqRemPage(_, payload) {
    const resAndSymb = await ethFunc.getDataForPairs(
      this.state.account0,
      payload
    );
    this.state.removeLiquidityPage.pairTokenAddress[0] = resAndSymb[2];
    this.state.removeLiquidityPage.pairTokenAddress[1] = resAndSymb[3];
    this.state.removeLiquidityPage.liqToken0 = resAndSymb[4];
    this.state.removeLiquidityPage.liqToken1 = resAndSymb[5];
    const liqReserves = await ethFunc.getReserves(
      this.state.removeLiquidityPage.pairTokenAddress[0],
      this.state.removeLiquidityPage.pairTokenAddress[1],
      factory,
      this.state.account0
    );
    this.state.removeLiquidityPage.symbol[0] = resAndSymb[0];
    this.state.removeLiquidityPage.symbol[1] = resAndSymb[1];
    this.state.removeLiquidityPage.pairLiquidity = liqReserves[2];
  },

  async removeLiquidity() {
    await ethFunc.removeLiquidity(
      this.state.removeLiquidityPage.pairTokenAddress[0],
      this.state.removeLiquidityPage.pairTokenAddress[1],
      this.state.removeLiquidityPage.pairLiqInp,
      0,
      0,
      router,
      this.state.account0,
      factory
    );
  },

  async getPairsFromFactory() {
    this.state.allPairs = await ethFunc.getPairs(factory);
  },

  async addLiquidity() {
    await ethFunc.addLiquidity(
      this.state.liquidityPageVar.liqDialog.DialnumAdd[0],
      this.state.liquidityPageVar.liqDialog.DialnumAdd[1],
      this.state.liquidityPageVar.liqTokenAmount0,
      this.state.liquidityPageVar.liqTokenAmount1,
      0,
      0,
      router,
      this.state.account0
    );
  },

  async displayReserves(context, payload) {
    // console.log("address->", this.state.account0);
    if (payload === "swap") {
      await ethFunc
        .getReserves(
          this.state.swapDialog.DialnumAdd[0],
          this.state.swapDialog.DialnumAdd[1],
          factory,
          this.state.account0
        )
        .then((swapReserves) => {
          this.state.tokenReserves[0] = swapReserves[0];
          this.state.tokenReserves[1] = swapReserves[1];
        });
      this.state.tokenBalText[0] = await ethFunc.getTokenBalance(
        this.state.swapDialog.DialnumAdd[0]
      );
      this.state.tokenBalText[1] = await ethFunc.getTokenBalance(
        this.state.swapDialog.DialnumAdd[1]
      );
    } else if (payload === "pool") {
      const liqReserves = await ethFunc.getReserves(
        this.state.liquidityPageVar.liqDialog.DialnumAdd[0],
        this.state.liquidityPageVar.liqDialog.DialnumAdd[1],
        factory,
        this.state.account0
      );
      // .then((liqReserves) => {
      this.state.liquidityPageVar.liqTokenRes[0] = liqReserves[0];
      this.state.liquidityPageVar.liqTokenRes[1] = liqReserves[1];
      this.state.liquidityPageVar.pairLiquidity = liqReserves[2];
      // });
      console.log("then inside displayReserves->", payload, liqReserves);
      this.state.liquidityPageVar.liqTokenBal[0] =
        await ethFunc.getTokenBalance(
          this.state.liquidityPageVar.liqDialog.DialnumAdd[0]
        );
      this.state.liquidityPageVar.liqTokenBal[1] =
        await ethFunc.getTokenBalance(
          this.state.liquidityPageVar.liqDialog.DialnumAdd[1]
        );
    }
    // context.commit("displayReservesInConsole");

    // this.state.selectedPoolLiq = reserves[2];
  },

  async swapToken() {
    // try {
    await ethFunc.swapTokens(
      this.state.swapDialog.DialnumAdd[0],
      this.state.swapDialog.DialnumAdd[1],
      this.state.amountToken0,
      router,
      this.state.account0
    );
    // console.log("here");
    // } catch (err) {
    //   return false;
    // }
  },

  async fillLiqTokenAmt(_, payload) {
    let address0;
    let address1;
    // if (payload.page === "addLiq") {
    if (payload.inpBox === 1) {
      address0 = this.state.liquidityPageVar.liqDialog.DialnumAdd[0];
      address1 = this.state.liquidityPageVar.liqDialog.DialnumAdd[1];
    } else {
      address1 = this.state.liquidityPageVar.liqDialog.DialnumAdd[0];
      address0 = this.state.liquidityPageVar.liqDialog.DialnumAdd[1];
    }
    this.state.liquidityPageVar.liqTokenAmount1 = await ethFunc.getAmountOut(
      address0,
      address1,
      this.state.liquidityPageVar.liqTokenAmount0,
      router
    );
    // }
    // if (payload.page === "removeLiq") {
    //   if (payload.inpBox === 1) {
    //     address0 = this.state.removeLiquidityPage.pairTokenAddress[0];
    //     address1 = this.state.removeLiquidityPage.pairTokenAddress[1];
    //   } else {
    //     address1 = this.state.removeLiquidityPage.pairTokenAddress[0];
    //     address0 = this.state.removeLiquidityPage.pairTokenAddress[1];
    //   }
    //   this.state.removeLiquidityPage.liqToken1InputAmount =
    //     await ethFunc.getAmountOut(
    //       address0,
    //       address1,
    //       this.state.removeLiquidityPage.liqToken0InputAmount,
    //       router
    //     );
    // }
  },

  async fillTokenAmount(_, payload) {
    let address0;
    let address1;
    if (payload === 1) {
      address0 = this.state.swapDialog.DialnumAdd[0];
      address1 = this.state.swapDialog.DialnumAdd[1];
    } else {
      address1 = this.state.swapDialog.DialnumAdd[0];
      address0 = this.state.swapDialog.DialnumAdd[1];
    }
    this.state.amountToken1 = await ethFunc.getAmountOut(
      address0,
      address1,
      this.state.amountToken0,
      router
    );
  },

  async displayMaxTokenBalance(_, payload) {
    this.state.tokenBalText[payload.ind] = await ethFunc.getTokenBalance(
      payload.add
    );
  },

  async displayMaxTokenBalanceLiq(_, payload) {
    this.state.liquidityPageVar.liqTokenBal[payload.ind] =
      await ethFunc.getTokenBalance(payload.add);
  },

  closeSwapDialog(context) {
    context.commit("swapDialog", false);
  },

  closeLiqDialog(context) {
    context.commit("liqDialog", false);
  },

  openSwapDialog(context) {
    context.commit("swapDialog", true);
  },

  openLiqDialog(context) {
    context.commit("liqDialog", true);
  },

  toggleConnectWalletButton(context) {
    context.commit("toggleConnectWalletButton"); //Not the actual implementation. Needs some refactoring. Will do later
  },
};
