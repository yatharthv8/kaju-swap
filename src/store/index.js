import { createStore } from "vuex";
import walletConnect from "./walletConnect/walletConnect.js";

const store = createStore({
  modules: {
    walletConnect: walletConnect,
  },
  state() {
    return {
      displayConnectWalletButton: false,
    };
  },
  mutations: {
    toggleConnectWalletButton(state) {
      state.displayConnectWalletButton = !state.displayConnectWalletButton;
    },
  },
  actions: {
    toggleConnectWalletButton(context) {
      context.commit("toggleConnectWalletButton");
    },
  },
});

export default store;
