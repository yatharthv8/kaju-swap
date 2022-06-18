import web3 from "./web3.js";
import KajuswapRouter from "./contracts/artifacts/KajuswapRouter.json";

export default (address) => {
  return new web3.eth.Contract(KajuswapRouter.abi, address);
};
