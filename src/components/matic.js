import React, { Component } from 'react';
import Web3 from 'web3';
import Portis from '@portis/web3';
import Matic from "@maticnetwork/maticjs";
const bn = require("bn.js");
const Network = require("@maticnetwork/meta/network");
const SCALING_FACTOR = new bn(10).pow(new bn(18));


//const token = "0xfA08B72137eF907dEB3F202a60EfBc610D2f224b" // ERC721 token address
//const tokenId = '100' // ERC721 token ID
// const from = "0x0C3388508dB0CA289B49B45422E56479bCD5ddf9"

class Pos extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
          account: '',
          web3: {},
        };
        this.loadBlockchainData = this.loadBlockchainData.bind(this);
      
    }
  
    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()

    }

    async loadWeb3() {
        const portisMumbai = new Portis('a16b70b3-8f7c-49cc-b33f-98db6607f425', {
            nodeUrl: 'https://rpc-mumbai.matic.today', 
            chainId: 80001
        });
        const portisGoerli = new Portis('a16b70b3-8f7c-49cc-b33f-98db6607f425', {
            nodeUrl: 'https://rpc.goerli.mudit.blog/', 
            chainId: 5
        });
        this.setState({
            portisMumbai: portisMumbai,
            portisGoerli: portisGoerli
        })
        const web3 = new Web3(portisMumbai.provider);
        this.setState({ 
            web3: web3 })
        let acc = await web3.eth.getAccounts();
        this.setState({
            account: acc[0]
        })

        // if (window.ethereum) {
        // window.web3 = new Web3(window.ethereum)
        // await window.ethereum.enable()
        // }
        // else if (window.web3) {
        // window.web3 = new Web3(window.web3.currentProvider)
        // }
        // else {
        // window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        // }

    }
  

    async loadBlockchainData() {
        // const web3 = window.web3

        // const accounts = await web3.eth.getAccounts()
        // this.setState({ account: accounts[0] })
        

        // const ethBalance = await web3.eth.getBalance(this.state.account)
        // this.setState({ ethBalance })
        // console.log(ethBalance);

        // Load Token
        //const networkId =  await web3.eth.net.getId()

  }
  
    async getMaticClient(_network = "testnet", _version = "mumbai") {
        console.log({
            network: _network,
            version: _version,
            parentProvider: this.state.portisMumbai.provider,
            maticProvider: this.state.portisGoerli.provider,  
            parentDefaultOptions:  this.state.account , 
            maticDefaultOptions: this.state.account,
        }); 

        const network = new Network(_network, _version);
        const matic = new Matic({
            network: _network,
            version: _version,
            parentProvider: this.state.portisMumbai.provider,
            maticProvider: this.state.portisGoerli.provider,  
            parentDefaultOptions:  this.state.account , 
            maticDefaultOptions: this.state.account,
        });
        await matic.initialize();

        return { matic, network };
    }


    async execute() {
        const { matic, network } = await this.getMaticClient();
        console.log(matic);
        console.log(network);
        // burning erc721 tokens are also supported
        //Matic chain address
        const token = "0x6E441c6E95387c6761Ec44CB006891583c4Bed06";
        console.log(token);
    
        // or provide the tokenId in case of an erc721
        const tokenId = "39713";
        const hash = await matic.startWithdrawForNFT(token, tokenId, {from: this.state.account});
        await this.setState({
            hash: hash.transactionHash
        });
        console.log(hash.transactionHash);
        console.log(this.state.hash);
        localStorage.setItem('hash',this.state.hash); 
        
        
    }

    async execute1() {
        const hash1 = localStorage.getItem('hash');
        console.log(hash1);  
        const { matic, network } = await this.getMaticClient();
        
            // provide the burn tx hash
        const chash = await matic.withdrawNFT(hash1, { from: this.state.account , gas: "2000000" });
        console.log(chash.transactionHash);
        localStorage.setItem('chash',chash.transactionHash);
    }


  // Withdraw process is completed, funds will be transfered to your account after challege period is over.

    async execute2() {
        const { matic, network } = await this.getMaticClient();
        
        //Goerli chain address
        const token = "0x1C250633D9e29a2353dE9FF04aBd8bBb316eE4c5";
        const phash = await matic.processExits(token, { from: this.state.account, gas: 7000000 })
        console.log(phash.transactionHash);
        localStorage.setItem('phash',phash.transactionHash);
    }
  
    async execute3() {
        const { matic, network } = await this.getMaticClient();
    
        const token = "0x1C250633D9e29a2353dE9FF04aBd8bBb316eE4c5";
        const tokenId = "39713";
    
        
        await matic.approveERC20TokensForDeposit(token, tokenId).then((res) => {
        console.log("approve hash: ", res.transactionHash);
        });
    

        await matic.safeDepositERC721Tokens(token, tokenId, { from: this.state.account }).then((res) => {
        console.log("desposit hash: ", res.transactionHash);
        });
    }
  
    render() {
        return (
        <div>
            <button onClick={() => this.execute()}>Burn</button><br></br>
            <h1>{this.state.hash}</h1>
            <a href={`https://mumbai-explorer.matic.today/tx/${localStorage.getItem('hash')}/token_transfers`} target="_blank">Hash</a><br></br>
            <button onClick={() => this.execute1()}>Confirm Withdraw</button><br></br>
            <a href={`https://goerli.etherscan.io/tx/${localStorage.getItem('chash')}`} target="_blank">Hash</a><br></br>
            
            <button onClick={() => this.execute2()}>Process Exit</button><br></br>
            <a href={`https://goerli.etherscan.io/tx/${localStorage.getItem('phash')}`} target="_blank">Hash</a><br></br>
            
            <button onClick={() => this.execute3()}>Deposit</button><br></br>
            <a href={`https://goerli.etherscan.io/tx/${localStorage.getItem('dhash')}`}  target="_blank">Hash</a><br></br>
            
        </div>
        );
    } 

}

export default Pos;