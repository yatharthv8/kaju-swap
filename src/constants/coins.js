// import web3 from "../../ethereum/web3";
import * as chains from "./chains";

// const ERC20 = require("../../ethereum/.deps/npm/@rari-capital/solmate/src/tokens/artifacts/ERC20.json");

export const GÖRLICoins = [
  {
    name: "Ether",
    abbr: "ETH",
    address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  },
  // {
  //   name: "Wrapped Ether",
  //   abbr: "WETH",
  //   address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  //   // balance: getBalance("0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"),
  // },
  {
    name: "Dai",
    abbr: "DAI",
    address: "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844",
    // balance: getBalance("0x95b58a6bff3d14b7db2f5cb5f0ad413dc2940658"),
  },
  {
    name: "Uniswap",
    abbr: "UNI",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    // balance: getBalance("0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"),
  },
  {
    name: "Kaju Token",
    abbr: "KAJU",
    address: "0x36200cA470824efab2581aa985B78152f38a4cd4",
    // balance: getBalance("0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"),
  },
  {
    name: "Test Token",
    abbr: "TEST",
    address: "0x610146F3545b25B01D1C083aEF0355822f0D3514",
    // balance: getBalance("0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"),
  },
];

const COINS = new Map();
// COINS.set(chains.ChainId.MAINNET, MAINNETCoins);
// COINS.set(chains.ChainId.ROPSTEN, ROPSTENCoins);
// COINS.set(chains.ChainId.RINKEBY, RINKEBYCoins);
COINS.set(chains.ChainId.GÖRLI, GÖRLICoins);
// COINS.set(chains.ChainId.KOVAN, KOVANCoins);
export default COINS;
