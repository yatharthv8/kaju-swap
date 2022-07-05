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
//   "0x3D03148E5fb9B6B933B2445F161bA8444735BF9a"
// );
// routerAddress.set(
//   ChainId.ROPSTEN,
//   "0x3D03148E5fb9B6B933B2445F161bA8444735BF9a"
// );
routerAddress.set(
  ChainId.RINKEBY,
  "0x3D03148E5fb9B6B933B2445F161bA8444735BF9a"
);
// routerAddress.set(ChainId.GÖRLI, "0x3D03148E5fb9B6B933B2445F161bA8444735BF9a");
// routerAddress.set(ChainId.KOVAN, "0x3D03148E5fb9B6B933B2445F161bA8444735BF9a");
