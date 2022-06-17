const KajuswapFactory = artifacts.require("./KajuswapFactory.sol");

let factoryAddress;
module.exports = function (deployer) {
  deployer.deploy(KajuswapFactory).then(() => {
    factoryAddress = KajuswapFactory.address;
  });
};
