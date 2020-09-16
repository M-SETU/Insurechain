import { Button} from 'semantic-ui-react'
import React, { Component } from 'react'
import Policy from '../abis/policy_1.json';
import Consortium from '../abis/consortium.json';
import PortCardVendor from './Vendor/PortCardVendor';
import ClaimCardVendor from './Vendor/ClaimCardVendor';
import PolicyCardvendor from './Vendor/PolicyCardVendor';

const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');






class Vendor extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      policy:{},
      portis: {},
      policyIds: [],
      claimIds: [],
      policiesList: [],
      claimsList: [],
      portsList: [],
      web3: {},
      address: "",
      goerliAddress: "0x4Ce44d92273bc9cd4efF18E2dC4acB731B3a0738"
    };

    this.handleChange = this.handleChange.bind(this);
    this.loadBlockchainData = this.loadBlockchainData.bind(this);
    this.handleClaimButton = this.handleClaimButton.bind(this);
    this.claimReject = this.claimReject.bind(this);
    this.claimApprove = this.claimApprove.bind(this);
    this.handleApproveRequestButton = this.handleApproveRequestButton.bind(this);
    this.handleRejectRequestButton = this.handleRejectRequestButton.bind(this);
    this.handleTransferRequestButton = this.handleTransferRequestButton.bind(this);

  
  }
  async componentWillMount() {
    try{
      if(this.props.loginStatus === true)
      {
        await this.setState({
          policy: this.props.policy,
          web3: this.props.web3,
          portis: this.props.portis,
          portisGoerli: this.props.portisGoerli,
          account: this.props.account,
          web3Goerli: this.props.web3Goerli,
          otherVendor: this.props.otherVendor,
        })
        this.loadBlockchainData();
        
      }
    }
    catch {

    }
  }

  async loadBlockchainData(){
    const policy = new this.state.web3.eth.Contract(Policy, this.props.address);
    this.setState({policy});

    let b = await policy.methods.getPolicyIds()
    .call({from: this.state.account});

    let c = await policy.methods.getAllClaimIds()
    .call({from: this.state.account});

    this.setState({
      policyIds: b,
      claimIds: c
    })
    await this.handleLoop();
    await this.handlePortsLoop();
  }

  async claimApprove (id){
    const policy = new this.state.web3.eth.Contract(Policy, this.props.address);
    await policy.methods.approveClaim(
      id)
    .send({from: this.state.account, gas:500000, gasPrice:10000000000})
    .then (async (receipt) => {
      console.log(receipt);
      await this.loadBlockchainData();
    })
    .catch((err)=> {
      console.log(err);
    });
  }

  async claimReject (id){
    const policy = new this.state.web3.eth.Contract(Policy, this.props.address);
    await policy.methods.rejectClaim(
      id)
    .send({from: this.state.account, gas:500000, gasPrice:10000000000})
    .then (async (receipt) => {
      console.log(receipt);
      await this.loadBlockchainData();
    })
    .catch((err)=> {
      console.log(err);
    });
  }

  handleChange (evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  async handleLoop(){

    var pol_ids = this.state.policyIds;
    const policy = new this.state.web3.eth.Contract(Policy, this.props.address);
    var arr1 = [];
    for(let i = 0; i <pol_ids.length; i++) {
      let details = await policy.methods.getPolicy(pol_ids[i])
        .call({from: this.state.account});
      arr1.push(details);
    }

    var claim_ids = this.state.claimIds;
    var arr2 = [];
    for(let i = 0; i <claim_ids.length; i++) {
      let details = await policy.methods.getClaim(claim_ids[i])
        .call({from: this.state.account});
      arr2.push(details);
    }
    this.setState({
      policiesList: arr1,
      claimsList: arr2
    })
  }

  async handlePortsLoop(){
    const policy = new this.state.web3Goerli.eth.Contract(Consortium, this.state.goerliAddress);
    var ids = await policy.methods.getAllIds()
    .call({from: this.state.account});
    var arr = [];
    for(let i = 0; i <ids.length; i++) {
      if(ids[i]!="0"){

        let details = await policy.methods.getPortPolicyDetails(ids[i])
          .call({from: this.state.account});
        if(details){ 
            arr.push(details);
        }
      }
    }
    this.setState({
      portsList: arr
    })
  } 

  handleClaimButton(id, status){
    if(status==="unprocessed"){
      return (<td>
        <Button onClick={() => { this.claimApprove(id) }} basic color='green'>
          Approve
        </Button>
        <Button onClick={() => { this.claimReject(id) }} basic color='red'>
          Reject
        </Button>
      </td>)
    }
    else{
      return <td>
        <Button onClick={() => { this.claimApprove(id) }} basic color='green' disabled={true}>
          Approve
        </Button>
        <Button onClick={() => { this.claimReject(id) }} basic color='red' disabled={true}>
          Reject
        </Button></td>
    }
  }

  async handleRequestApprove(id){
    const policy = new this.state.web3Goerli.eth.Contract(Consortium, this.state.goerliAddress);
    policy.methods.approveRequest(
      id)
    .send({from: this.state.account, gas:500000, gasPrice:10000000000})
    .then (async (receipt) => {
      console.log(receipt);
      this.handlePortsLoop();
    })
    .catch((err)=> {
      console.log(err);   
    });
  }

  async handleRequestReject(id){
    const policy = new this.state.web3Goerli.eth.Contract(Consortium, this.state.goerliAddress);
    policy.methods.deleteRequest(
      id)
    .send({from: this.state.account, gas:500000, gasPrice:10000000000})
    .then (async (receipt) => {
      console.log(receipt);
      this.handlePortsLoop();
    })
    .catch((err)=> {
      console.log(err);   
    });
  }

  async handleRequestTransfer(pol){
    const decrypted = cryptr.decrypt(pol[1]); 
    const obj = JSON.parse(decrypted);
    const kycHash = obj['kycHash'];
    const policyType = obj['policyType'];

    const policy = new this.state.web3Goerli.eth.Contract(Consortium, this.state.goerliAddress);
    console.log(pol[0]);
    policy.methods.deleteRequest(
      pol[0])
    .send({from: this.state.account, gas:500000, gasPrice:10000000000})
    .then (async (receipt) => {
      console.log(receipt);
      const policy = new this.state.web3.eth.Contract(Policy, this.props.address);
      policy.methods.addPortData(
        pol[4],
        pol[0],
        kycHash,
        policyType
        )
      .send({from: this.state.account, gas:500000, gasPrice:10000000000})
      .then(async (rec) => {
        console.log(rec);
        localStorage.setItem("mintHash",rec['transactionHash']);
        let b = await policy.methods.getPolicyIds()
        .call({from: this.state.account});

        let c = await policy.methods.getAllClaimIds()
        .call({from: this.state.account});

        this.setState({
          policyIds: b,
          claimIds: c
        })
        await this.handleLoop();
        await this.handlePortsLoop();
      })
      .catch((err)=> {
        console.log(err);
      })
    })
    .catch((err)=> {
      console.log(err);   
    });
  }

  async handleApproveRequestButton(pol){
    if(pol[5] ==="active" && this.state.account === pol[3]){
      this.handleRequestApprove(pol[0]);
    } else if (this.state.account !== pol[3]) {
      window.alert("You are not newVendor");
    }
    else{
      window.alert("Request Already Approved");
    }
  }

  async handleRejectRequestButton(pol){
    if(pol[5] === "active" && this.state.account === pol[3]){
      this.handleRequestReject(pol[0]);
    } else if (this.state.account !== pol[3]) {
      window.alert("You are not newVendor");
    }
    else{
      window.alert("Request Already Approved");
    }
  }

  async handleTransferRequestButton(pol){
    if(pol[5] === "active" && this.state.account === pol[3]){
      window.alert("Request Not approved Yet");
    } else if (this.state.account !== pol[3]) {
      window.alert("You are not newVendor");
    }
    else if(pol[5] === "completed" && this.state.account === pol[3]){
      this.handleRequestTransfer(pol);
    }
    else{
      window.alert("waiting to be completed");
    }
  }

  handlePolicyList() {
    return this.state.policiesList.map(currentpolicy => {
      return <PolicyCardvendor policyCard={currentpolicy} key={currentpolicy[0]}/>;
    })
  }

  handleClaimList() {
    return this.state.claimsList.map(currentclaim => {
      return <ClaimCardVendor claimCard={currentclaim} 
        handleClaimButton = {this.handleClaimButton}
        key={currentclaim[0]}/>;
    })
  }

  handlePortList() {
    return this.state.portsList.map(currentport => {
      return <PortCardVendor portCard={currentport} 
      handleApproveRequestButton = {this.handleApproveRequestButton} 
      handleRejectRequestButton = {this.handleRejectRequestButton} 
      handleTransferRequestButton = {this.handleTransferRequestButton} 
      key={currentport[0]}/>;
    })
  }
  

  render() {
    if(this.props.loginStatus===true && this.state.account === this.props.myOwner){
      return (
        <div>
          <div style={{margin:"30px"}}>
                <div style={{fontSize:"25px"}} align = "center"><strong>All Policies</strong></div>
                <table className="ui celled table ">
                  <thead>
                  <tr>
                    <th style={{textAlign:"center"}}>Policy ID</th>
                    <th style={{textAlign:"center"}}>Customer ID</th>
                    <th style={{textAlign:"center"}}>Policy Type</th>
                    <th style={{textAlign:"center"}}>KYC Documents</th>
                    <th style={{textAlign:"center"}}>Hash</th>
                  </tr></thead>
                  <tbody>
                    { this.handlePolicyList() }
                  </tbody>
                </table>
          </div>
          <br></br>
          <div style={{margin: "30px"}}>
                <div style={{fontSize:"25px"}} align = "center"><strong>All Claims</strong></div>
                <table className="ui celled table">
                  <thead>
                    <tr>
                      <th style={{textAlign:"center"}}>Claim ID</th>
                      <th style={{textAlign:"center"}}>Policy ID</th>
                      <th style={{textAlign:"center"}}>Date</th>
                      <th style={{textAlign:"center"}}> Hospital Name</th>
                      <th style={{textAlign:"center"}}>Description</th>
                      <th style={{textAlign:"center"}}>Documents</th>
                      <th style={{textAlign:"center"}}>Amount</th>
                      <th style={{textAlign:"center"}}>Status</th>
                      <th style={{textAlign:"center"}}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    { this.handleClaimList() }
                  </tbody>
                </table>
        </div> 

        <br></br>
          <div style={{margin: "30px"}}>
              <div style={{fontSize:"25px"}} align = "center"><strong>All Port Requests</strong></div>
              <table className="ui celled table ">
                <thead>
                  <tr>
                    <th>Policy ID</th>
                    <th>New Vendor</th>
                    <th>Status</th>
                    
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  { this.handlePortList() }
                </tbody>
              </table>
          </div>    
      </div>
      )
    }else{
      return (
          <div style={{position: "center", fontSize: "30px", color: "black"}} align="center">
          <br></br><br></br>
          <strong>You Should be Vendor</strong><br></br><br></br>
          Login with Vendor Account
      </div>
    );
    }
  }
}

export default Vendor;