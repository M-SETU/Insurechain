require('babel-register');
require('babel-polyfill');
const HDWalletProvider = require('truffle-hdwallet-provider');
const fs = require('fs');
const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    matic: {
      provider: function () {
        return new HDWalletProvider(mnemonic, `https://rpc-mumbai.matic.today`);
      },
      network_id: 80001,
      gasPrice: 0xfffffffff,
      gas:10000000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  migrations_directory: './src/migrations',
  compilers: {
    solc: {
      version: "0.6.2"
    }
  }
}
