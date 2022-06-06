const KajuswapPair = artifacts.require("./KajuswapPair.sol");

module.exports = function (deployer) {
  deployer.deploy(KajuswapPair);
};
