import Web3Modal from "web3modal";
const providerOptions = {
};

const web3Modal = new Web3Modal({
  network: "testnet", // optional
  cacheProvider: true, // optional
  providerOptions, // required
  disableInjectedProvider: false // optional. For MetaMask / Brave / Opera.
});

export default web3Modal;
