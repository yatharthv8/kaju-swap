export const networks = [
  // 1, 3,
  4,
  // , 5, 42
];

export const ChainId = {
  // MAINNET: 1,
  // ROPSTEN: 3,
  RINKEBY: 4,
  // GÖRLI: 5,
  // KOVAN: 42,
};

export const routerAddress = new Map();
// routerAddress.set(
//   ChainId.MAINNET,
//   "0xfb88fd19547Ea3952BA66111398fAB5D7cb01141"
// );
// routerAddress.set(
//   ChainId.ROPSTEN,
//   "0xfb88fd19547Ea3952BA66111398fAB5D7cb01141"
// );
routerAddress.set(
  ChainId.RINKEBY,
  "0xfb88fd19547Ea3952BA66111398fAB5D7cb01141"
);
// routerAddress.set(ChainId.GÖRLI, "0xfb88fd19547Ea3952BA66111398fAB5D7cb01141");
// routerAddress.set(ChainId.KOVAN, "0xfb88fd19547Ea3952BA66111398fAB5D7cb01141");
