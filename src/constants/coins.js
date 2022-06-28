// import web3 from "../../ethereum/web3";
import * as chains from "./chains";

// const ERC20 = require("../../ethereum/.deps/npm/@rari-capital/solmate/src/tokens/artifacts/ERC20.json");

export const RINKEBYCoins = [
  {
    name: "Wrapped Ether",
    abbr: "WETH",
    address: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
    // balance: getBalance("0xc778417e063141139fce010982780140aa0cd5ab"),
  },
  {
    name: "Dai",
    abbr: "DAI",
    address: "0x95b58a6Bff3D14B7DB2f5cb5F0Ad413DC2940658",
    // balance: getBalance("0x95b58a6bff3d14b7db2f5cb5f0ad413dc2940658"),
  },
  {
    name: "Tether USD",
    abbr: "USDT",
    address: "0x3B00Ef435fA4FcFF5C209a37d1f3dcff37c705aD",
    // balance: getBalance("0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad"),
  },
  {
    name: "Uniswap",
    abbr: "UNI",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    // balance: getBalance("0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"),
  },
  {
    name: "Maker",
    abbr: "MKR",
    address: "0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85",
    // balance: getBalance("0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"),
  },
];

const COINS = new Map();
// COINS.set(chains.ChainId.MAINNET, MAINNETCoins);
// COINS.set(chains.ChainId.ROPSTEN, ROPSTENCoins);
COINS.set(chains.ChainId.RINKEBY, RINKEBYCoins);
// COINS.set(chains.ChainId.GÖRLI, GÖRLICoins);
// COINS.set(chains.ChainId.KOVAN, KOVANCoins);
export default COINS;
