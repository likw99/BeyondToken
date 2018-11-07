var factory = artifacts.require("./TokenTimelockFactory.sol");
  
module.exports = function(deployer) {
  deployer.deploy(factory);
};
