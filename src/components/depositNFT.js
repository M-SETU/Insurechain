const Matic = require('@maticnetwork/maticjs').default
const config = require('./config.json')

const from = "0x720E1fa107A1Df39Db4E78A3633121ac36Bec132" // from address

// Create object of Matic
const matic = new Matic({
    maticProvider: config.MATIC_PROVIDER,
    parentProvider: config.PARENT_PROVIDER,
    rootChain: config.ROOTCHAIN_ADDRESS,
    withdrawManager: config.WITHDRAWMANAGER_ADDRESS,
    depositManager: config.DEPOSITMANAGER_ADDRESS,
    registry: config.REGISTRY,
})


// const token = "0xfA08B72137eF907dEB3F202a60EfBc610D2f224b" // ERC721 token address
// const tokenId = '100' // ERC721 token ID

// async function execute() {
//     await matic.initialize()
//     matic.setWallet("PRIVATE_KEY")
//     // Depsoit NFT Token
//     let response = await matic.safeDepositERC721Tokens(token,tokenId,{ from, gasPrice: '10000000000' })
//     console.log(response);
//     return response;
// }



// const token = "0x33FC58F12A56280503b04AC7911D1EceEBcE179c" // ERC721 token address
// const tokenId = '100' // ERC721 token ID

// matic.initialize().then(() => {
//     matic.setWallet("PRIVATE_KEY")
//     // Initiate withdraw from matic/ Burn NFT on Matic
//     matic.startWithdrawForNFT(token, tokenId, {
//             from,
//         }).then((res) => {
//             console.log(res.transactionHash) // eslint-disable-line

        
//         })
// })


// var transactionHash = "0xbb09d6db0e7386ef30fc0a0e63838f83a4695fbaba8db0e136c688fd7b3fb56c";
// //Wait for 5 mins till the checkpoint is submitted, then run the confirm withdraw
// matic.initialize().then(() => {
//     matic.setWallet("PRIVATE_KEY")
//     // Submit proof of burn on Goerli
//     matic.withdrawNFT(transactionHash, {
//         from,
//     }).then((res) => {
//         console.log(res.transactionHash) // eslint-disable-line
//     })
// })


//Withdraw process is completed, funds will be transfered to your account after challege period is over. 

//const token = GOERLI_ERC20                 // For ERC20 Token
//const token = GOERLI_ERC721                // For ERC721 Token
//const token = GOERLI_WETH                  // For ETH
const rootTokenAddress = "0xfA08B72137eF907dEB3F202a60EfBc610D2f224b";  // Root token address

matic.initialize().then(() => {
    matic.setWallet("PRIVATE_KEY")
    // Get back tokens to ethereum account after 7 day challenge period
    matic.processExits(rootTokenAddress, {
        from,
    }).then((res) => {
        console.log(res.transactionHash) // eslint-disable-line
    })
})




