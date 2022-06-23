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
//   "0x0c7122fF191286fECe5B0bc8c2f385F01F9f20a8"
// );
// routerAddress.set(
//   ChainId.ROPSTEN,
//   "0x0c7122fF191286fECe5B0bc8c2f385F01F9f20a8"
// );
routerAddress.set(
  ChainId.RINKEBY,
  "0x0c7122fF191286fECe5B0bc8c2f385F01F9f20a8"
);
// routerAddress.set(ChainId.GÖRLI, "0x0c7122fF191286fECe5B0bc8c2f385F01F9f20a8");
// routerAddress.set(ChainId.KOVAN, "0x0c7122fF191286fECe5B0bc8c2f385F01F9f20a8");
