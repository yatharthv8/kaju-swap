import web3 from "../../../ethereum/web3.js";
import detectEthereumProvider from "@metamask/detect-provider";
import * as chains from "../../constants/chains.js";

const { ethereum } = window;

export default {
  toggleConnectWalletButton(context) {
    context.commit("toggleConnectWalletButton");
  },

  async onConnect(context) {
    context.state.isLoading = true;
    let check = false;
    const provider = await detectEthereumProvider();
    if (provider) {
      if (provider !== ethereum) {
        console.error("Do you have multiple wallets installed?");
      }
      await web3.eth.getAccounts().then(async (accounts) => {
        if (accounts.length > 0) {
          check = true;
          await ethereum
            .request({ method: "eth_chainId" })
            .then((networkHex) => {
              context.rootState.network =
                chains.Hex[Number(networkHex[networkHex.length - 1])];
            });
          context.rootState.account0 = accounts[0];
          context.rootState.balance = parseFloat(
            web3.utils.fromWei(
              await web3.eth.getBalance(context.rootState.account0),
              "ether"
            )
          ).toFixed(2);
          context.state.isLoading = false;
        } else {
          await ethereum
            .request({ method: "eth_requestAccounts" })
            .then(async () => {
              check = true;
              context.state.isLoading = false;
              await ethereum
                .request({ method: "eth_chainId" })
                .then((networkHex) => {
                  context.rootState.network =
                    chains.Hex[Number(networkHex[networkHex.length - 1])];
                });
              const acc = await web3.eth.getAccounts();
              context.rootState.account0 = acc[0];
              context.rootState.balance = parseFloat(
                web3.utils.fromWei(
                  await web3.eth.getBalance(context.rootState.account0),
                  "ether"
                )
              ).toFixed(2);
            })
            .catch((err) => {
              context.state.isLoading = false;
              console.log(err);
            });
          console.log("The connected wallet is metamask");
        }
      });
    } else {
      context.state.isLoading = false;
      console.log("Please install a Wallet Provider");
      alert(
        "Please install a Wallet Provider! Wallets other than Metamask are not supported at the moment! Sorry for the inconvinience caused."
      );
    }
    if (context.state.isLoading === false && check) {
      context.dispatch("toggleConnectWalletButton");
    }
  },
};
