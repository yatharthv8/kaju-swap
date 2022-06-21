import Web3 from "web3";

// window.ethereum.request({ method: "eth_requestAccounts" });
const { ethereum } = window;
const web3 = new Web3(ethereum);

export default web3;
