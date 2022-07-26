const server = artifacts.require('Bet.sol');

module.exports = function(deployer) {
    deployer.deploy(server);
};