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
//   "0x683d67cbccfa18cf2abb0411aedc28b8b542c265"
// );
// routerAddress.set(
//   ChainId.ROPSTEN,
//   "0x683d67cbccfa18cf2abb0411aedc28b8b542c265"
// );
routerAddress.set(
  ChainId.RINKEBY,
  "0x683d67cbccfa18cf2abb0411aedc28b8b542c265"
);
// routerAddress.set(ChainId.GÖRLI, "0x683d67cbccfa18cf2abb0411aedc28b8b542c265");
// routerAddress.set(ChainId.KOVAN, "0x683d67cbccfa18cf2abb0411aedc28b8b542c265");
