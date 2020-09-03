import { Button} from 'semantic-ui-react'
import React, { Component } from 'react'
import Web3 from 'web3'
import Policy from '../policy.json';
import Portis from '@portis/web3';

const ClaimCard = props => (
  <tr>
    <td>{props.claimCard[0]}</td>
    <td>{props.claimCard[7]}</td>
    <td>{props.claimCard[1]}</td>
    <td>{props.claimCard[2]}</td>
    <td>{props.claimCard[3]}</td>
    <td data-label="hash">
      <a href={`https://ipfs.infura.io/ipfs/${props.claimCard[5]}`}>{props.claimCard[5]}</a>
    </td>
    <td>{props.claimCard[4]}</td>
    <td>{props.claimCard[6]}</td>
    { 
      props.handleClaimButton(props.claimCard[0], props.claimCard[6])
    }

  </tr>
)

const PolicyCard = props => (
  <tr>
    <td data-label="policyid">{props.policyCard[0]}</td>
    <td data-label="custID">{props.policyCard[2]}</td>
    <td data-label="poltype">{props.policyCard[4]}</td>
    <td data-label="hash">
      <a href={`https://ipfs.infura.io/ipfs/${props.policyCard[3]}`}>{props.policyCard[3]}</a>
    </td>
  </tr>
)

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
      web3: {},
      address: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.loadBlockchainData = this.loadBlockchainData.bind(this);
    this.handleClaimButton = this.handleClaimButton.bind(this);
    this.claimReject = this.claimReject.bind(this);
    this.claimApprove = this.claimApprove.bind(this);
  
  }
  async componentWillMount() {
    try{
      if(this.props.loginstatus === true)
      {
        await this.setState({
          policy: this.props.policy,
          web3: this.props.web3,
          portis: this.props.portis,
          account: this.props.account
        })
        await this.loadBlockchainData();
        await this.handleLoop();
      }
    }
    catch {

    }
  }

  async loadBlockchainData(){
    const policy = new this.state.web3.eth.Contract(Policy, this.props.address);
    this.setState({policy});

    let b = await this.state.policy.methods.getPolicyIds()
    .call({from: this.state.account});

    let c = await this.state.policy.methods.getAllClaimIds()
    .call({from: this.state.account});

    this.setState({
      policyIds: b,
      claimIds: c
    })
  }

  async claimApprove (id){
    await this.state.policy.methods.approveClaim(
      id)
    .send({from: this.state.account, gas:500000, gasPrice:10000000000})
    .then ((receipt) => {
      console.log(receipt);
    })
    .catch((err)=> {
      console.log(err);
    });
  }

  async claimReject (id){
    await this.state.policy.methods.rejectClaim(
      id)
    .send({from: this.state.account, gas:500000, gasPrice:10000000000})
    .then ((receipt) => {
      console.log(receipt);
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
    
    var arr1 = [];
    for(let i = 0; i <pol_ids.length; i++) {
      let details = await this.state.policy.methods.getPolicy(pol_ids[i])
        .call({from: this.state.account});
      arr1.push(details);
    }

    var claim_ids = this.state.claimIds;
    var arr2 = [];
    for(let i = 0; i <claim_ids.length; i++) {
      let details = await this.state.policy.methods.getClaim(claim_ids[i])
        .call({from: this.state.account});
      arr2.push(details);
    }
    this.setState({
      policiesList: arr1,
      claimsList: arr2
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

  handlePolicyList() {
    return this.state.policiesList.map(currentpolicy => {
      return <PolicyCard policyCard={currentpolicy} key={currentpolicy[0]}/>;
    })
  }

  handleClaimList() {
    return this.state.claimsList.map(currentclaim => {
      return <ClaimCard claimCard={currentclaim} 
        handleClaimButton = {this.handleClaimButton}
        key={currentclaim[0]}/>;
    })
  }


  render() {
    if(this.props.loginstatus===true && this.state.account === this.props.owner){
      return (
        <div>
          <div style={{margin:"30px"}}>
                <div style={{fontSize:"25px"}} align = "center"><strong>All Policies</strong></div>
                <table className="ui celled table ">
                  <thead>
                  <tr>
                    <th>Policy Id</th>
                    <th>Customer ID</th>
                    <th>Policy Type</th>
                    <th>KYC Hash</th>
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
                      <th>ClaimId</th>
                      <th>PolicyId</th>
                      <th>Date</th>
                      <th>Hospital Name</th>
                      <th>Description</th>
                      <th>Docs</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    { this.handleClaimList() }
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