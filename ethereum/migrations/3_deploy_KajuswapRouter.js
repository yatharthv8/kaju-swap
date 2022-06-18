const KajuswapRouter = artifacts.require("./KajuswapRouter.sol");
const KajuswapFactory = artifacts.require("./KajuswapFactory.sol");

// console.log("factory address->", KajuswapFactory.address);

module.exports = function (deployer) {
  deployer.deploy(KajuswapRouter, KajuswapFactory.address);
};
