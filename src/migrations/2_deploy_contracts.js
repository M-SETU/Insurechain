const cryptoPolicy = artifacts.require("cryptoPolicy");

module.exports = async function(deployer) {
  await deployer.deploy(cryptoPolicy, "HDFC", "HF");
  cryptoPolicyInstance = await cryptoPolicy.deployed();
  await cryptoPolicyInstance.initialize();
};

