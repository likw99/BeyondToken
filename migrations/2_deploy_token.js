var token = artifacts.require("./BeyondToken.sol");
  
module.exports = function(deployer) {
  deployer.deploy(token);
};
