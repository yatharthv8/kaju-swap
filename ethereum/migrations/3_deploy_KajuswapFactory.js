const KajuswapFactory = artifacts.require("./KajuswapFactory.sol");

module.exports = function (deployer) {
  deployer.deploy(KajuswapFactory);
};
