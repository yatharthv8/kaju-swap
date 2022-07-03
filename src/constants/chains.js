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
//   "0x366aC572c8AF8d17Ef33fc4468d467aaBccA8C50"
// );
// routerAddress.set(
//   ChainId.ROPSTEN,
//   "0x366aC572c8AF8d17Ef33fc4468d467aaBccA8C50"
// );
routerAddress.set(
  ChainId.RINKEBY,
  "0x366aC572c8AF8d17Ef33fc4468d467aaBccA8C50"
);
// routerAddress.set(ChainId.GÖRLI, "0x366aC572c8AF8d17Ef33fc4468d467aaBccA8C50");
// routerAddress.set(ChainId.KOVAN, "0x366aC572c8AF8d17Ef33fc4468d467aaBccA8C50");
