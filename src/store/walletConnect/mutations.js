export default {
  toggleConnectWalletButton(state, payload) {
    // console.log("TCWB");
    state.displayConnectWalletButton = payload;
    // console.log(state.displayConnectWalletButton);
  },
};
