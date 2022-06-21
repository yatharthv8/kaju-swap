import * as chains from "./chains";

export const RINKEBYCoins = [
  {
    name: "Wrapped Ether",
    abbr: "WETH",
    address: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
  },
  {
    name: "Dai",
    abbr: "DAI",
    address: "0x95b58a6bff3d14b7db2f5cb5f0ad413dc2940658",
  },
  {
    name: "Tether USD",
    abbr: "USDT",
    address: "0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad",
  },
];

// console.log("Weth add->", RINKEBYCoins[0].address);

const COINS = new Map();
// COINS.set(chains.ChainId.MAINNET, MAINNETCoins);
// COINS.set(chains.ChainId.ROPSTEN, ROPSTENCoins);
COINS.set(chains.ChainId.RINKEBY, RINKEBYCoins);
// COINS.set(chains.ChainId.GÖRLI, GÖRLICoins);
// COINS.set(chains.ChainId.KOVAN, KOVANCoins);
export default COINS;
