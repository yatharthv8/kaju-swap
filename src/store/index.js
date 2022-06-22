import { createStore } from "vuex";
import walletConnect from "./walletConnect/walletConnect.js";
import web3 from "../../ethereum/web3.js";
import detectEthereumProvider from "@metamask/detect-provider";

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
      swapDialog: [false, null],
      swapTokenSymbol: ["WETH", "UNI"],
    };
  },
  mutations: {
    toggleConnectWalletButton(state) {
      // console.log("5");
      state.displayConnectWalletButton = !state.displayConnectWalletButton;
    },
    openSwapDialog(state, payload) {
      state.swapDialog[0] = true;
      state.swapDialog[1] = payload;
    },
    closeSwapDialog(state) {
      state.swapDialog[0] = false;
    },
  },
  actions: {
    closeSwapDialog(context) {
      context.commit("closeSwapDialog");
    },
    openSwapDialog(context, payload) {
      context.commit("openSwapDialog", payload);
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
