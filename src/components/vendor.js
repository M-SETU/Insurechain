import React, { Component } from 'react'
import Modal from "react-bootstrap/Modal";
import Policy from '../abis/policy_1.json';
import Consortium from '../abis/consortium.json';
import PortCardVendor from './Vendor/PortCardVendor';
import ClaimCardVendor from './Vendor/ClaimCardVendor';
import PolicyCardvendor from './Vendor/PolicyCardVendor';
import ipfs from './ipfs.js'
import { Button } from 'semantic-ui-react'
// const Cryptr = require('cryptr');
// const cryptr = new Cryptr('myTotalySecretKey');

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
      goerliAddress: "0x96e78929dD5fBbaB0ab6AeF097B97dd97728952d",
      vendorMapping: {
        "0x0C3388508dB0CA289B49B45422E56479bCD5ddf9":"WellCare New York",
        "0xFE6c916d868626Becc2eE0E5014fA785A17893ec":"Health Net California",
      },
      showRequestDetails: false,
      showSendDetails: false,
      showOnboardDetails: false,
      showRejectRequest: false, 
      showCompletePortingModal: false

    };

    this.handleChange = this.handleChange.bind(this);
    this.loadBlockchainData = this.loadBlockchainData.bind(this);
    this.claimAction = this.claimAction.bind(this);
    this.handlePortButtons = this.handlePortButtons.bind(this);
    this.requestDetails = this.requestDetails.bind(this);
    this.handleStatusComment = this.handleStatusComment.bind(this);
    this.hideSendDetailsModal = this.hideSendDetailsModal.bind(this);
    this.showSendDetailsModal = this.showSendDetailsModal.bind(this);
    this.hideOnboardDetailsModal = this.hideOnboardDetailsModal.bind(this);
    this.showOnboardDetailsModal = this.showOnboardDetailsModal.bind(this);
    this.showRejectRequestModal = this.showRejectRequestModal.bind(this);
    this.hideRejectRequestModal = this.hideRejectRequestModal.bind(this);
    this.showCompletePortingModal = this.showCompletePortingModal.bind(this);
    this.hideCompletePortingModal = this.hideCompletePortingModal.bind(this);

  }

  async UNSAFE_componentWillMount() {
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

    await this.handleLoop();
    await this.handlePortsLoop();
  }

  async claimAction (id, polId, action){
    const policy = new this.state.web3.eth.Contract(Policy, this.props.address);
    await policy.methods.actionClaim(
      id, polId, action)
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
    const policy = new this.state.web3.eth.Contract(Policy, this.props.address);
    this.setState({policy});
    let ids = await policy.methods.getPolicyIds()
    .call({from: this.state.account});
    this.setState({
      policyIds: ids,
    })
    let policies = [];
    var claims = [];
    for(let i = 0; i <ids.length; i++) {
      let id = ids[i];
      let details = await policy.methods.getPolicy(id)
        .call({from: this.state.account});
      if(details[7]===true){
        let a = await ipfs.cat(details[3])
        let b = JSON.parse(a);
        policies.push([
          details[0],
          details[1],
          details[2],
          b,
          details[4],
          details[5],
          details[6],
          details[7],
          details[8],
        ]);
        let arr1 = details[5];
        let arr2 = details[6];
        for (let i=0; i < arr1.length; i++){
          let c = await ipfs.cat(arr2[i][0])
          let d = JSON.parse(c);
          claims.push([arr1[i][0], arr1[i][1], d, arr2[i][1]])
        }
      }
    }
    await this.setState({
      policiesList: policies,
      claimsList: claims
    })
  }

  async handlePortsLoop(){
    const policy = new this.state.web3Goerli.eth.Contract(Consortium, this.state.goerliAddress);
    var ids = await policy.methods.getAllIds()
    .call({from: this.state.account});
    var arr = [];
    for(let i = 0; i <ids.length; i++) {
      if(ids[i]!=="0"){

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

  async requestDetails(id){
    await this.showRequestDetailsModal();
    const policy = new this.state.web3Goerli.eth.Contract(Consortium, this.state.goerliAddress);
    policy.methods.requestDetails(id)
    .send({from: this.state.account, gas:500000, gasPrice:10000000000})   
    .then (async (receipt) => {
      console.log(receipt);
      await this.hideRequestDetailsModal();
      await this.handleLoop();
      await this.handlePortsLoop();
    })
    .catch(async ()=> {
      await this.hideRequestDetailsModal();
      await this.handleLoop();
      await this.handlePortsLoop();
    })
  }

  async sendDetails(id){
    await this.showSendDetailsModal();
    const policy = new this.state.web3.eth.Contract(Policy, this.props.address);
    let details = await policy.methods.getPolicy(id)
        .call({from: this.state.account});
    if(details && details[7]===true){
      const det = JSON.stringify({
        policyId: details[0], 
        owner: details[1],
        customerId: details[2],
        kycHash: details[3],
        policyType: details[4],
        claimIds: details[5],
        claimDetails: details[6],
        typeOfApplication: details[8]
      });
      const pi = await ipfs.add(det);

      const policyGoerli = new this.state.web3Goerli.eth.Contract(Consortium, this.state.goerliAddress);
      policyGoerli.methods.sendDetails(id, pi)
      .send({from: this.state.account, gas:500000, gasPrice:10000000000})   
      .then (async (receipt) => {
        console.log(receipt);
        await this.hideSendDetailsModal();
        await this.handleLoop();
        await this.handlePortsLoop();
      })
      .catch(async ()=> {
        await this.hideSendDetailsModal();
        await this.handleLoop();
        await this.handlePortsLoop();
      })

    }

    
  }

  async onBoardPolicy(id, details, policyType, oldVendor){
    await this.showOnboardDetailsModal();
    let a = await ipfs.cat(details);
    let b = JSON.parse(a);

    const policy = new this.state.web3.eth.Contract(Policy, this.props.address);
    await policy.methods.addPortData(
      b["owner"],
      b["policyId"],
      b["kycHash"],
      policyType,
      "Ported from "+this.state.vendorMapping[oldVendor],
      b["claimIds"],
      b["claimDetails"]
    )
    .send({from: this.state.account, gas:900000, gasPrice:15000000000})
    .then (async (receipt) => {
      console.log(receipt);
      const policyGoerli = new this.state.web3Goerli.eth.Contract(Consortium, this.state.goerliAddress);
      await policyGoerli.methods.approveDetails(id)
      .send({from: this.state.account, gas:500000, gasPrice:10000000000})
      .then (async (receipt) => {
        console.log(receipt);
        await this.hideOnboardDetailsModal();
        await this.loadBlockchainData();
      })
      .catch(async (err)=> {
        console.log(err);
        await this.hideOnboardDetailsModal();
        await this.loadBlockchainData();
      });
    })
    .catch(async (err)=> {
      console.log(err);
      await this.hideOnboardDetailsModal();
    });

  }

  async rejectRequest(id){
    await this.showRejectRequestModal();
    const policy = new this.state.web3Goerli.eth.Contract(Consortium, this.state.goerliAddress);
    policy.methods.deleteRequest(id)
    .send({from: this.state.account, gas:500000, gasPrice:10000000000})   
    .then (async (receipt) => {
      console.log(receipt);
      await this.hideRejectRequestModal();
      await this.handleLoop();
      await this.handlePortsLoop();
    })
    .catch(async ()=> {
      await this.hideRejectRequestModal();
      await this.handleLoop();
      await this.handlePortsLoop();
    })
  }

  async completePorting(id){
    await this.showCompletePortingModal();
    const policy = new this.state.web3.eth.Contract(Policy, this.props.address);
    await policy.methods.burn(id)
    .send({from: this.state.account, gas:500000, gasPrice:10000000000})
    .then (async (receipt) => {
      console.log(receipt);
      const policyGoerli = new this.state.web3Goerli.eth.Contract(Consortium, this.state.goerliAddress);
      await policyGoerli.methods.deleteRequest(id)
      .send({from: this.state.account, gas:500000, gasPrice:10000000000})
      .then (async (receipt) => {
        console.log(receipt);
        await this.hideCompletePortingModal();
        await this.loadBlockchainData();
      })
      .catch(async (err)=> {
        console.log(err);
        await this.hideCompletePortingModal();
        await this.loadBlockchainData();
      });
    })
    .catch(async (err)=> {
      console.log(err);
      await this.hideCompletePortingModal();
    });

  }

  handleStatusComment(oldVendor, newVendor, status){
    if(oldVendor===this.state.account){
      const statusmapping = {
        "Application Submitted": "Port Requested by User",
        "Request Initiated": "Details Requested by "+this.state.vendorMapping[newVendor],
        "Details Sent": "Details sent to "+ this.state.vendorMapping[newVendor],
        "Approved": "Application Approved by "+ this.state.vendorMapping[newVendor]+", waiting for completion",
      }
      return(<td data-label="status" style={{textAlign:"center"}}>
        {statusmapping[status]}
      </td>)
    } else {
      const statusmapping = {
        "Application Submitted": "Application Received",
        "Request Initiated": "Details Requested to "+ this.state.vendorMapping[oldVendor],
        "Details Sent": "Details Received by "+ this.state.vendorMapping[oldVendor] + ", Awaiting Onboard",
        "Approved": "Application Onboarded, awaiting completion by "+this.state.vendorMapping[oldVendor]
      }
      return(<td data-label="status" style={{textAlign:"center"}}>
        {statusmapping[status]}
      </td>)
    }
  }

  handlePortButtons(oldVendor, newVendor, id, status, details, policyType){
    if(oldVendor===this.state.account){
      const sdb = {
        "Application Submitted": true,
        "Request Initiated": false,
        "Details Sent": true,
        "Approved": true
      }
      const rrb = {
        "Application Submitted": true,
        "Request Initiated": false,
        "Details Sent": true,
        "Approved": true
      }
      const cpb = {
        "Application Submitted": true,
        "Request Initiated": true,
        "Details Sent": true,
        "Approved": false
      }

      return (<td>
        <Button onClick={() => { this.sendDetails(id) }} basic color='green' disabled={sdb[status]}>
          Transfer Details
        </Button>
        <Button onClick={() => { this.rejectRequest(id) }} basic color='red' disabled={rrb[status]}>
          Reject Request
        </Button>
        <Button onClick={() => { this.completePorting(id) }} basic color='pink' disabled={cpb[status]}>
          Complete Transfer
        </Button>
      </td>)
    }
    else if(newVendor===this.state.account){
      const rdb = {
        "Application Submitted": false,
        "Request Initiated": true,
        "Details Sent": true,
        "Approved": true
      }
      const opb = {
        "Application Submitted": true,
        "Request Initiated": true,
        "Details Sent": false,
        "Approved": true
      }
      const rrb = {
        "Application Submitted": false,
        "Request Initiated": true,
        "Details Sent": false,
        "Approved": true
      }

      return (<td>
        <Button onClick={() => { this.requestDetails(id) }} basic color='green' disabled={rdb[status]}>
          Request Details
        </Button>
        <Button onClick={() => { this.onBoardPolicy(id, details, policyType, oldVendor) }} basic color='pink' disabled={opb[status]}>
          OnBoard Policy
        </Button>
        <Button onClick={() => { this.rejectRequest(id) }} basic color='red' disabled={rrb[status]}>
          Reject Request
        </Button>
      </td>)
    }
    else{
      return(<td>

      </td>)
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
        claimAction = {this.claimAction}
        key={currentclaim[0]}/>;
    })
  }

  handlePortList() {
    return this.state.portsList.map(currentport => {
      return <PortCardVendor portCard={currentport} 
      vendorMapping = {this.state.vendorMapping}
      handlePortButtons = {this.handlePortButtons}
      handleStatusComment = {this.handleStatusComment}
      key={currentport[0]}/>;
    })
  }

  hideRequestDetailsModal = (e) => {
    this.setState({
      showRequestDetails: false,
    });
  };

  showRequestDetailsModal = (e) => {
    this.setState({
      showRequestDetails: true,
    });
  };

  hideSendDetailsModal = (e) => {
    this.setState({
      showSendDetails: false,
    });
  };

  showSendDetailsModal = (e) => {
    this.setState({
      showSendDetails: true,
    });
  };

  hideOnboardDetailsModal = (e) => {
    this.setState({
      showOnboardDetails: false,
    });
  };

  showOnboardDetailsModal = (e) => {
    this.setState({
      showOnboardDetails: true,
    });
  };
  
  hideRejectRequestModal = (e) => {
    this.setState({
      showRejectRequest: false,
    });
  };

  showRejectRequestModal = (e) => {
    this.setState({
      showRejectRequest: true,
    });
  };

  hideCompletePortingModal = (e) => {
    this.setState({
      showCompletePorting: false,
    });
  };

  showCompletePortingModal = (e) => {
    this.setState({
      showCompletePorting: true,
    });
  };


  render() {
    if(this.props.loginStatus===true && this.state.account === this.props.myOwner){
      return (
        <div>
          <br></br>
         
          <div align="center">
          <Modal
              show={this.state.showRequestDetails}
              onHide={this.hideRequestDetailsModal}
            >
              <Modal.Header>
                <Modal.Title><b>Requesting Details</b></Modal.Title>
              </Modal.Header>
            </Modal>
          </div>
          <div align="center">
          <Modal
              show={this.state.showSendDetails}
              onHide={this.hideSendDetailsModal}
            >
              <Modal.Header>
                <Modal.Title><b>Sending Details</b></Modal.Title>
              </Modal.Header>
            </Modal>
          </div>
          <div align="center">
          <Modal
              show={this.state.showOnboardDetails}
              onHide={this.hideOnboardDetailsModal}
            >
              <Modal.Header>
                <Modal.Title><b>Onboarding Policy</b></Modal.Title>
              </Modal.Header>
            </Modal>
          </div>
          <div align="center">
          <Modal
              show={this.state.showRejectRequest}
              onHide={this.hideRejectRequestModal}
            >
              <Modal.Header>
                <Modal.Title><b>Rejecting Request</b></Modal.Title>
              </Modal.Header>
            </Modal>
          </div>
          <div align="center">
          <Modal
              show={this.state.showCompletePorting}
              onHide={this.hideCompletePortingModal}
            >
              <Modal.Header>
                <Modal.Title><b>Completing Transfer</b></Modal.Title>
              </Modal.Header>
            </Modal>
          </div>

          <div style={{margin:"30px"}}>
                <div style={{fontSize:"25px"}} align = "center"><strong>All Policies</strong></div>
                <table className="ui celled table ">
                  <thead>
                  <tr>
                    <th style={{textAlign:"center"}}>Policy ID</th>
                    <th style={{textAlign:"center"}}>Customer ID</th>
                    <th style={{textAlign:"center"}}>Name</th>
                    <th style={{textAlign:"center"}}>Email ID</th>
                    <th style={{textAlign:"center"}}>DOB</th>
                    <th style={{textAlign:"center"}}>Policy Type</th>
                    <th style={{textAlign:"center"}}>KYC Documents</th>
                    <th style={{textAlign:"center"}}>Application Type</th>
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
                  <th style={{textAlign:"center"}}>Policy ID</th>
                    <th style={{textAlign:"center"}}>New Vendor</th>
                    <th style={{textAlign:"center"}}>Old Vendor</th>
                    <th style={{textAlign:"center"}}>Details</th>
                    <th style={{textAlign:"center"}}>Policy Type</th>
                    <th style={{textAlign:"center"}}>Status</th>
                    <th style={{textAlign:"center"}}>Action</th>
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
          <br></br>
          <strong>You Should be Vendor</strong><br></br><br></br>
          Login with Vendor Account
      </div>
    );
    }
  }
}

export default Vendor;