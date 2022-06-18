import web3 from "./web3.js";
import KajuswapFactory from "./contracts/artifacts/KajuswapFactory.json";

export default (address) => {
  return new web3.eth.Contract(KajuswapFactory.abi, address);
};
