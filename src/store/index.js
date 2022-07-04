import { createStore } from "vuex";
import walletConnect from "./walletConnect/walletConnect.js";
import web3 from "../../ethereum/web3.js";
import detectEthereumProvider from "@metamask/detect-provider";
import * as ethFunc from "../ethereumFunctions.js";

const router = ethFunc.getRouter(process.env.VUE_APP_ROUTER);
const factory = ethFunc.getFactory(process.env.VUE_APP_FACTORY);
const Weth = ethFunc.getWeth(process.env.VUE_APP_WETH);

const { ethereum } = window;

const store = createStore({
  modules: {
    walletConnect: walletConnect,
  },
  state() {
    return {
      displayConnectWalletButton: false,
      account0: null,
      balance: null,
      isLoading: false,
      swapDialog: {
        bool: false,
        DialnumAdd: [
          process.env.VUE_APP_WETH,
          "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        ],
      },
      // symbolButtonIndex: null,
      swapTokenSymbol: ["WETH", "UNI"],
      amountToken0: null,
      amountToken1: null,
      tokenBalText: [0, 0],
      tokenReserves: [0, 0],
      selectedPoolLiq: null,
      liquidityPageVar: {
        liqTokenSymbol: ["WETH", "UNI"],
        liqTokenAmount0: null, //For inputing in the form
        liqTokenAmount1: null, //For inputing in the form
        liqTokenBal: [0, 0], //Token Balance in Wallet - Display in BalResLiq
        liqTokenRes: [0, 0], //Token Reserves in Contract - Display in BalResLiq
        liqDialog: {
          //Dialog variable maintainence
          bool: false,
          DialnumAdd: [
            process.env.VUE_APP_WETH,
            "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
          ],
        },
        pairLiquidity: 0,
      },
    };
  },
  mutations: {
    toggleConnectWalletButton(state) {
      // console.log("5");
      state.displayConnectWalletButton = !state.displayConnectWalletButton;
    },
    openSwapDialog(state) {
      state.swapDialog.bool = true;
    },
    openLiqDialog(state) {
      state.liquidityPageVar.liqDialog.bool = true;
    },
    closeSwapDialog(state) {
      state.swapDialog.bool = false;
    },
    closeLiqDialog(state) {
      state.liquidityPageVar.liqDialog.bool = false;
    },
    displayReservesInConsole(state) {
      console.log(
        "token balance->",
        state.swapTokenSymbol[0],
        state.swapDialog.DialnumAdd[0],
        state.tokenBalText[0],
        "\n",
        state.swapTokenSymbol[1],
        state.swapDialog.DialnumAdd[1],
        state.tokenBalText[1]
      );
    },
  },
  actions: {
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
      } else {
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
      if (payload === 1) {
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
      context.commit("closeSwapDialog");
    },
    closeLiqDialog(context) {
      context.commit("closeLiqDialog");
    },
    openSwapDialog(context) {
      context.commit("openSwapDialog");
    },
    openLiqDialog(context) {
      context.commit("openLiqDialog");
    },
    toggleConnectWalletButton(context) {
      context.commit("toggleConnectWalletButton"); //Not the actual implementation. Needs some refactoring. Will do later
    },
    async onConnect(context) {
      this.state.isLoading = true;
      if (typeof ethereum !== "undefined") {
        const provider = await detectEthereumProvider();
        if (provider) {
          const accounts = await web3.eth.getAccounts();
          if (accounts.length > 0) {
            context.dispatch("toggleConnectWalletButton");
            this.state.account0 = accounts[0];
            this.state.balance = parseFloat(
              web3.utils.fromWei(
                await web3.eth.getBalance(this.state.account0),
                "ether"
              )
            ).toFixed(2);
            // console.log("type of balance", typeof this.state.balance);
            // this.state.balance = this.state.balance.toFixed(2);
          } else {
            if (ethereum.isMetaMask) {
              ethereum.request({ method: "eth_requestAccounts" });
              console.log("The connected wallet is metamask");
              context.dispatch("toggleConnectWalletButton");
            } else {
              alert(
                "Wallets other than Metamask are not supported at the moment! Sorry for the inconvinience caused."
              );
            }
          }
        }
      } else {
        console.log("Please install a Wallet Provider");
        alert("Please install a Wallet Provider preferably Metamask.");
      }
      this.state.isLoading = false;
    },
  },
});

export default store;
