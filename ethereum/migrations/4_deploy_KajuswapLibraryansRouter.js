const KajuswapLibrary = artifacts.require("./KajuswapLibrary.sol");
const KajuswapRouter = artifacts.require("./KajuswapRouter.sol");
const KajuswapFactory = artifacts.require("./KajuswapFactory.sol");

console.log("factory address->", KajuswapFactory.address);

module.exports = function (deployer) {
  deployer.deploy(KajuswapLibrary);
  deployer.link(KajuswapLibrary, KajuswapRouter);
  deployer.deploy(KajuswapRouter, KajuswapFactory.address);
};
