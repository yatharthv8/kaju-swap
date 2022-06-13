import { createStore } from "vuex";
import walletConnect from "./walletConnect/walletConnect.js";
import web3 from "../../ethereum/web3.js";
import detectEthereumProvider from "@metamask/detect-provider";

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
    };
  },
  mutations: {
    toggleConnectWalletButton(state) {
      // console.log("5");
      state.displayConnectWalletButton = !state.displayConnectWalletButton;
    },
  },
  actions: {
    // async isConnectedToProvider(context) {
    //   console.log("2");
    //   const accounts = await web3.eth.getAccounts();
    //   console.log("3");
    //   if (accounts.length > 0) {
    //     context.dispatch("toggleConnectWalletButton");
    //     console.log("4");
    //   }
    // },
    toggleConnectWalletButton(context) {
      context.commit("toggleConnectWalletButton"); //Not the actual implementation. Needs some refactoring. Will do later
    },
    async onConnect(context) {
      this.state.isLoading = true;
      if (typeof window.ethereum !== "undefined") {
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
            if (window.ethereum.isMetaMask) {
              window.ethereum.request({ method: "eth_requestAccounts" });
              console.log("The connected wallet is metamask");
              context.dispatch("toggleConnectWalletButton");
            } else {
              alert(
                "Wallets other than Metamask are not supported at the moment! sorry for the inconviniece caused."
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
