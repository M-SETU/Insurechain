import { Button} from 'semantic-ui-react'
import React, { Component } from 'react'
import Modal from "react-bootstrap/Modal";
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
      goerliAddress: "0x4Ce44d92273bc9cd4efF18E2dC4acB731B3a0738",
      vendorMapping: {
        "0x0C3388508dB0CA289B49B45422E56479bCD5ddf9":"WellCare New York",
        "0xFE6c916d868626Becc2eE0E5014fA785A17893ec":"Health Net California",
      },
      showAcceptPortRequest: false,
      showRejectPortRequest: false,
      showPortOnBoarding: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.loadBlockchainData = this.loadBlockchainData.bind(this);
    this.claimAction = this.claimAction.bind(this);
    this.handleRequestApprove = this.handleRequestApprove.bind(this);
    this.handleRequestReject = this.handleRequestReject.bind(this);
    this.handleRequestTransfer = this.handleRequestTransfer.bind(this);
    this.hideAcceptPortRequestModal = this.hideAcceptPortRequestModal.bind(this);
    this.showAcceptPortRequestModal = this.showAcceptPortRequestModal.bind(this);
    this.hideRejectPortRequestModal = this.hideRejectPortRequestModal.bind(this);
    this.showRejectPortRequestModal = this.showRejectPortRequestModal.bind(this);
    this.hidePortOnBoardingModal = this.hidePortOnBoardingModal.bind(this);
    this.showPortOnBoardingModal = this.showPortOnBoardingModal.bind(this);

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

    this.setState({
      policyIds: b,
    })
    await this.handleLoop();
    await this.handlePortsLoop();
  }

  async claimAction (id, action){
    const policy = new this.state.web3.eth.Contract(Policy, this.props.address);
    await policy.methods.actionClaim(
      id, action)
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
    var arr2 = [];
    for(let i = 0; i <pol_ids.length; i++) {
      let details = await policy.methods.getPolicy(pol_ids[i])
        .call({from: this.state.account});
      if(details[6]){
        arr1.push(details);
        let c = details[5];
        for (let j = 0; j <c.length; j++){
          let det = await policy.methods.getClaim(c[j])
            .call({from: this.state.account});
          arr2.push(det);
        }
      }
      
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
        if(details && details[3]===this.state.account){ 
            arr.push(details);
        }
      }
    }
    this.setState({
      portsList: arr
    })
  } 

  async handleRequestApprove(id){
    await this.showAcceptPortRequestModal();
    const policy = new this.state.web3Goerli.eth.Contract(Consortium, this.state.goerliAddress);
    policy.methods.approveRequest(
      id)
    .send({from: this.state.account, gas:500000, gasPrice:10000000000})
    .then (async (receipt) => {
      console.log(receipt);
      await this.hideAcceptPortRequestModal();
      this.handlePortsLoop();
    })
    .catch(async (err)=> {
      await this.hideAcceptPortRequestModal();
      console.log(err);   
    });
  }

  async handleRequestReject(id){
    await this.showRejectPortRequestModal();
    const policy = new this.state.web3Goerli.eth.Contract(Consortium, this.state.goerliAddress);
    policy.methods.deleteRequest(
      id)
    .send({from: this.state.account, gas:500000, gasPrice:10000000000})
    .then (async (receipt) => {
      console.log(receipt);
      await this.hideRejectPortRequestModal();
      this.handlePortsLoop();
    })
    .catch(async (err)=> {
      await this.hideRejectPortRequestModal();
      console.log(err);   
    });
  }

  async handleRequestTransfer(pol){
    await this.showPortOnBoardingModal();

    const decrypted = cryptr.decrypt(pol[1]); 
    const obj = JSON.parse(decrypted);
    const kycHash = obj['kycHash'];
    const policyType = obj['policyType'];
    const name = obj['name'];

    const policy = new this.state.web3.eth.Contract(Policy, this.props.address);
      policy.methods.addPortData(
        pol[4],
        pol[0],
        kycHash,
        policyType,
        name
        )
      .send({from: this.state.account, gas:600000, gasPrice:15000000000})
      .then(async (rec) => {
        console.log(rec);
        const policyGoerli = new this.state.web3Goerli.eth.Contract(Consortium, this.state.goerliAddress);
        policyGoerli.methods.deleteRequest(
          pol[0])
        .send({from: this.state.account, gas:500000, gasPrice:10000000000})
        .then (async (receipt) => {
          console.log(receipt);
          let b = await policy.methods.getPolicyIds()
            .call({from: this.state.account});
            this.setState({
              policyIds: b,
            })
            await this.hidePortOnBoardingModal();
            await this.handleLoop();
            await this.handlePortsLoop();
        })
        .catch(async (err)=> {
          await this.hidePortOnBoardingModal();
          console.log(err);   
        });
      })
      .catch(async (err)=> {
        await this.hidePortOnBoardingModal();
        console.log(err);
      })



    
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
      handleApproveRequestButton = {this.handleRequestApprove} 
      handleRejectRequestButton = {this.handleRequestReject} 
      handleTransferRequestButton = {this.handleRequestTransfer} 
      vendorMapping = {this.state.vendorMapping}
      key={currentport[0]}/>;
    })
  }

  hideAcceptPortRequestModal = (e) => {
    this.setState({
      showAcceptPortRequest: false,
    });
  };

  showAcceptPortRequestModal = (e) => {
    this.setState({
      showAcceptPortRequest: true,
    });
  };

  hideRejectPortRequestModal = (e) => {
    this.setState({
      showRejectPortRequest: false,
    });
  };

  showRejectPortRequestModal = (e) => {
    this.setState({
      showRejectPortRequest: true,
    });
  };

  hidePortOnBoardingModal = (e) => {
    this.setState({
      showPortOnBoarding: false,
    });
  };

  showPortOnBoardingModal = (e) => {
    this.setState({
      showPortOnBoarding: true,
    });
  };
  
  render() {
    if(this.props.loginStatus===true && this.state.account === this.props.myOwner){
      return (
        <div>
          <br></br>
          <div style={{fontSize:"20px", position:"center",PaddingBottom: "10px"}} align = "center">
            <strong>{this.props.heading}</strong>
          </div>

          <div align="center">
            <Modal
              show={this.state.showAcceptPortRequest}
              onHide={this.hideAcceptPortRequestModal}
            >
              <Modal.Header>
                <Modal.Title><b>Approving Request...</b></Modal.Title>
              </Modal.Header>
            </Modal>
          </div>
          <div align="center">
            <Modal
              show={this.state.showRejectPortRequest}
              onHide={this.hideRejectPortRequestModal}
            >
              <Modal.Header>
                <Modal.Title><b>Rejecting Request...</b></Modal.Title>
              </Modal.Header>
            </Modal>
          </div>
          <div align="center">
          <Modal
              show={this.state.showPortOnBoarding}
              onHide={this.hidePortOnBoardingModal}
            >
              <Modal.Header>
                <Modal.Title><b>OnBoarding Policy</b></Modal.Title>
              </Modal.Header>
              <Modal.Body>
                You will have to accept 2 transaction
              </Modal.Body>
            </Modal>
          </div>

          <div style={{margin:"30px"}}>
                <div style={{fontSize:"25px"}} align = "center"><strong>All Policies</strong></div>
                <table className="ui celled table ">
                  <thead>
                  <tr>
                    <th style={{textAlign:"center"}}>Policy ID</th>
                    <th style={{textAlign:"center"}}>Customer ID</th>
                    <th style={{textAlign:"center"}}>Applicant Name</th>
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
          <div style={{fontSize:"20px", position:"center",PaddingBottom: "10px"}} align = "center">
            <strong>{this.props.heading}</strong>
          </div>
          <br></br>
          <strong>You Should be Vendor</strong><br></br><br></br>
          Login with Vendor Account
      </div>
    );
    }
  }
}

export default Vendor;