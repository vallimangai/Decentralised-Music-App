const music = artifacts.require('../contracts/Music.sol')

module.exports = function(deployer){
    deployer.deploy(music);
}
