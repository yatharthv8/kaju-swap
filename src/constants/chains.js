export const networks = [1, 3, 4, 5];

export const ChainId = {
  MAINNET: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  GÖRLI: 5,
  // KOVAN: 42,
};

export const Hex = {
  0x1: "Ethereum",
  0x3: "Ropsten",
  0x4: "Rinkeby",
  0x5: "Goerli",
  // 0x2a: "Kovan",
};

export const routerAddress = new Map();
// routerAddress.set(
//   ChainId.MAINNET,
//   process.env.VUE_APP_ROUTER
// );
// routerAddress.set(
//   ChainId.ROPSTEN,
//   process.env.VUE_APP_ROUTER
// );
// routerAddress.set(ChainId.RINKEBY, process.env.VUE_APP_ROUTER);
routerAddress.set(ChainId.GÖRLI, process.env.VUE_APP_ROUTER);
// routerAddress.set(ChainId.KOVAN, process.env.VUE_APP_ROUTER);
