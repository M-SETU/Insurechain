import { Button, Card, Form, Input} from 'semantic-ui-react'
import React, { Component } from 'react'
import Policy from '../abis/policy_1.json';
import Consortium from '../abis/consortium.json';
import ipfs from './ipfs.js'
import Modal from "react-bootstrap/Modal";
import PolicyOptionsUser from './User/PolicyOptionsUser';
import OptionCardUser from './User/OptionCardUser';
import PortCardUser from './User/PortCardUser';
import ClaimCardUser from './User/ClaimCardUser';
import PolicyCardUser from './User/PolicyCardUser';

const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

class CreatePolicyDash extends Component {

  constructor(props) {
    super(props)
    this.state = {
      buffer: null,
      name: '',
      account: '',
      hash: '',
      policySelected: 'None',
      policyTypes: [],
      portis: {},
      policyIdsArray: [],
      web3: {},
      policiesList: [],
      policyId: '',
      claimDate: '',
      hospitalName: '',
      description: '',
      amount: 0,
      claimHash: '',
      policy:{},
      claimsList: [],
      portsList: [],
      showPolicyModal: false,
      showClaimModal: false,
      goerliAddress: "0x4Ce44d92273bc9cd4efF18E2dC4acB731B3a0738",
      vendorMapping: {
        "0x0C3388508dB0CA289B49B45422E56479bCD5ddf9":"WellCare New York",
        "0xFE6c916d868626Becc2eE0E5014fA785A17893ec":"Health Net California",
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handlePolicySubmit = this.handlePolicySubmit.bind(this);
    this.loadBlockchainData = this.loadBlockchainData.bind(this);
    this.policyList = this.policyList.bind(this);
    this.handleSelectPolicyType = this.handleSelectPolicyType.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleClaimSubmit = this.handleClaimSubmit.bind(this); 
    this.handleClaimList = this.handleClaimList.bind(this);
    this.handlePolicyId = this.handlePolicyId.bind(this);
    this.handleClaimButton = this.handleClaimButton.bind(this);
    this.deactivatePolicy = this.deactivatePolicy.bind(this);
    this.handlePortButton = this.handlePortButton.bind(this);
    this.handleTransfer = this.handleTransfer.bind(this);
    this.handlePortList = this.handlePortList.bind(this);
  
  }
  async componentWillMount() {
    
    let today = new Date();
    let date = today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + '-' + today.getHours() +':' + today.getMinutes();
    this.setState({
      claimDate: date
    })
    
    if(this.props.loginStatus === true)
    {
      await this.setState({
        policy: this.props.policy,
        web3: this.props.web3,
        portis: this.props.portis,
        portisGoerli: this.props.portisGoerli,
        account: this.props.account,
        web3Goerli: this.props.web3Goerli,
        otherVendorOwner: this.props.otherVendorOwner,
        address: this.props.address,
      })
      
      this.loadBlockchainData()
  
    }
  }

  async loadBlockchainData(){
    
    const policy = new this.state.web3.eth.Contract(Policy, this.props.address);
    this.setState({policy});

    let a = await policy.methods.getPolicyTypes().call({from: this.state.account});
    this.setState({
      policyTypes: a
    })

    let c = await policy.methods.getUserPolicies(
      this.state.account)
    .call({from: this.state.account});

    this.setState({
      policyIdsArray: c,
    })
    
    await this.handlePoliciesLoop();
    await this.handleClaimsLoop();
    await this.handlePortsLoop();
  }

  async handleFileChange(event){
    event.preventDefault()
    try{
      const file = event.target.files[0]
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
      }
    } 
    catch(err){
      console.log(err)
    }
  }

  async handlePolicySubmit(event){
    event.preventDefault()
    try{
      console.log("Submitting file to ipfs...")
      ipfs.add(this.state.buffer, (error, result) => {
        console.log('Ipfs result', result)
        if(error) {
          console.error(error)
          return
        }
        this.setState({ hash: result[0].hash })
        const policy = new this.state.web3.eth.Contract(Policy, this.props.address);
        policy.methods.createPolicy(
          this.state.hash, this.state.policySelected, this.state.name.toUpperCase())
        .send({from: this.state.account, gas:600000, gasPrice:15000000000})   
        .then (async (receipt) => {
          console.log(receipt);
          localStorage.setItem("mint1Hash",receipt['transactionHash']);
          this.hidePolicyModal();
          let c = await policy.methods.getUserPolicies(
            this.state.account)
          .call({from: this.state.account});
          await this.setState({
            policyIdsArray: c,
          });
         await this.handlePoliciesLoop();
        })
        .catch((err)=> {
          console.log(err); 
          this.hidePolicyModal();
          this.handlePoliciesLoop();
          this.handlePortsLoop();
        });
      })
    } catch(err) {
      console.log(err);
      this.hidePolicyModal();
    }
    
  }

  async handleClaimButton (id) {
    this.setState({
      policyId: id
    })
    this.showClaimModal()
  }

  async handleClaimSubmit(){
    try{
      console.log("Submitting file to ipfs...")
      ipfs.add(this.state.buffer, (error, result) => {
        console.log('Ipfs result', result)
        if(error) {
          console.error(error)
          return
        }
        this.setState({ claimHash: result[0].hash })
        const policy = new this.state.web3.eth.Contract(Policy, this.props.address);
        policy.methods.claimPolicy(
          this.state.policyId, 
          this.state.claimDate,
          this.state.hospitalName,
          this.state.description,
          this.state.amount,
          this.state.claimHash)
        .send({from: this.state.account, gas:500000, gasPrice:10000000000})
        .then (async (receipt) => {
          this.hideClaimModal();
          let c = await policy.methods.getUserPolicies(
            this.state.account)
          .call({from: this.state.account});
          await this.setState({
            policyIdsArray: c,
          });
          this.handleClaimsLoop();
        })
        .catch((err)=> {
          console.log(err);   
        });
      })
    }
    catch(err) {
      console.log(err);
    }
  }

  handleChange (evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  async handleSelectPolicyType (evt) {
    await this.setState({ policySelected: evt.target.value });
  }

  async deactivatePolicy(id){
    await this.state.policy.methods.burn(id)
        .call({from: this.state.account});
  }

  async handlePoliciesLoop(){
    const policy = new this.state.web3.eth.Contract(Policy, this.props.address);
    var ids = await policy.methods.getUserPolicies(
      this.state.account)
    .call({from: this.state.account});
  
   let arr = [];
    for(let i = 0; i <ids.length; i++) {
      let id = ids[i];
      let details = await policy.methods.getPolicy(id)
        .call({from: this.state.account});
      if(details[6]===true){
        arr.push(details);
      }
  
    }
   await this.setState({
    policiesList: arr
  })
  }

  async handleClaimsLoop(){
    const policy = new this.state.web3.eth.Contract(Policy, this.props.address);
    var ids = await policy.methods.getUserPolicies(
      this.state.account)
    .call({from: this.state.account});
    var arr = [];
    for(let i = 0; i <ids.length; i++) {
      let details = await policy.methods.getPolicy(ids[i])
        .call({from: this.state.account});
      if(details[6]===true){
        let allclaims = details[5];
        for (let j = 0; j<allclaims.length;j++){
          let cl = await policy.methods.getClaim(allclaims[j])
          .call({from: this.state.account});
          arr.push(cl);
        }
      }
    }
    this.setState({
      claimsList: arr
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
        if(details && this.state.account === details[4]){  
            arr.push(details);
        }
      }
    }
    await this.setState({
      portsList: arr
    })
    
  } 

  async handleTransfer(id){
    const policyGoerli = new this.state.web3Goerli.eth.Contract(Consortium, this.state.goerliAddress);
    policyGoerli.methods.completeRequest(id)
    .send({from: this.state.account, gas:500000, gasPrice:10000000000})
    .then (async (receipt) => {
      console.log(receipt);
      const policy = new this.state.web3.eth.Contract(Policy, this.state.address);
      policy.methods.burn(id)
      .send({from: this.state.account, gas:500000, gasPrice:10000000000})
      .then(async (rec) => {
        console.log(rec);
        //localStorage.setItem("burnHash",rec['transactionHash']);
        let c = await policy.methods.getUserPolicies(
          this.state.account)
        .call({from: this.state.account});
        await this.setState({
          policyIdsArray: c,
        });
        await this.handlePoliciesLoop();
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

  async handlePortButton(pol){
    const id = pol[0];
    const policyOwner = pol[1];
    const oldvendor = this.props.myOwner;
    const newvendor = this.state.otherVendorOwner;
    const text = '{"kycHash": "' + pol[3] + '", "policyType": "' + pol[4] + '", "name": "' + pol[7] + '"}';
    const encryptedString = cryptr.encrypt(text);
    //const encryptedData = key.encrypt(text, 'base64');
    console.log(encryptedString);
    const policy = new this.state.web3Goerli.eth.Contract(Consortium, this.state.goerliAddress);
    policy.methods.startPort(
      id,
      oldvendor,
      newvendor,
      encryptedString)
    .send({from: this.state.account, gas:500000, gasPrice:10000000000})
    .then (async (receipt) => {
      console.log(receipt);
      this.handlePortsLoop();
    })
    .catch((err)=> {
      console.log(err);   
    });
  }

  policyList() {
    return this.state.policiesList.map(currentpolicy => {
      return <PolicyCardUser policyCard={currentpolicy} 
      handleClaimButton = {this.handleClaimButton} 
      handlePortButton = {this.handlePortButton} 
      key={currentpolicy[0]}/>;
    })
  }

  optionsList() {
    return this.state.policyTypes.map(currenttype => {
      return <OptionCardUser opt={currenttype} key={currenttype}/>;
    })
  }

  policyOptionsList() {
    return this.state.policyIdsArray.map(currentpol => {
      return <PolicyOptionsUser opt={currentpol} key={currentpol}/>;
    })
  }

  async handlePolicyId (evt) {
    await this.setState({ policyId: evt.target.value });
  }

  handleClaimList() {
    return this.state.claimsList.map(currentclaim => {
      return <ClaimCardUser claimCard={currentclaim} key={currentclaim[0]}/>;
    })
  }

  handlePortList() {
    return this.state.portsList.map(currentport => {
      return <PortCardUser portCard={currentport} 
      handleTransferButton = {this.handleTransfer} 
      vendorMapping = {this.state.vendorMapping}
      key={currentport[0]}/>;
    })
  }

  hidePolicyModal = (e) => {
    this.setState({
      showPolicyModal: false,
    });
  };

  showPolicyModal = (e) => {
    this.setState({
      showPolicyModal: true,
    });
  };

  hideClaimModal = (e) => {
    this.setState({
      showClaimModal: false,
    });
  };

  showClaimModal = (e) => {
    this.setState({
      showClaimModal: true,
    });
  };


  render() {

    return (
      <div>
        <div style={{marginLeft: "80px",marginTop: "20px"}} align="center">
        
        <div align = "center">
          <Modal
            show={this.state.showPolicyModal}
            onHide={this.hidePolicyModal}
            align="center"
          >
            <Modal.Header>
              <Modal.Title><b>BUY POLICY</b></Modal.Title>
            </Modal.Header>
            <Modal.Body>
            
                <div>
                <div>
                  <Form>
                    <Form.Group widths='equal'>
                      <Form.Field>
                        <div>
                          <strong>Policy Type</strong>
                          <select id="typespolicy" onChange={this.handleSelectPolicyType}
                            style = {{
                              width: "equal"
                            }}
                            >
                            <option value="None" defaultValue>
                              {"None"}
                            </option>
                            {this.optionsList()}
                          </select>
                        </div>
                      </Form.Field>
                    </Form.Group>
                  </Form>
                </div>
                <div >
                    <Form>
                      <Form.Group widths='equal'>
                        <Form.Field
                          id='form-input-control-hospitalname'
                          control={Input}
                          label='Name'
                          placeholder='Name'
                          name="name"
                          onChange={this.handleChange}
                        />
                      </Form.Group>
                    </Form>
                  </div>
                <div >
                  <Form>
                    <Form.Group widths='equal'>
                      <Form.Field
                        id='form-input-control-documenthash'
                        control={Input}
                        label='KYC Document'
                        name="hash"
                      >
                        <input type="file" onChange={this.handleFileChange} />
                      </Form.Field>
                    </Form.Group>
                  </Form>
                </div>
                  </div>
            </Modal.Body>
            <Modal.Footer>
              <Card.Content extra>
                  <div className='ui two buttons' style={{paddingRight: "20px"}}>
                    <Button onClick={this.handlePolicySubmit} basic color='green'>
                      Buy
                    </Button>
                    <div style={{paddingRight: "20px"}}></div>
                    <Button onClick={this.hidePolicyModal} basic color='red' >
                      Cancel
                    </Button>
                  </div>
                </Card.Content>
            </Modal.Footer>
          </Modal>
        </div>
        <div align = "center">
          <Modal
            show={this.state.showClaimModal}
            onHide={this.hideClaimModal}
            align="center"
          >
            <Modal.Header>
              <Modal.Title><b>CLAIM POLICY</b></Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div>
              <div>
                <div >
                  <div style={{fontSize:"20px"}}>
                    <strong>Claim Policy</strong>
                  </div>
                  <br></br>
                  <div >
                    <Form>
                      <Form.Group widths='equal'>
                        <Form.Field
                          id='form-input-control-polid'
                          control={Input}
                          label='Policy Id'
                          name="id"
                          value={this.state.policyId}   
                        />
                        <Form.Field
                          id='form-input-control-claimdate'
                          control={Input}
                          label='Claim Date'
                          name="claimDate"
                          value={this.state.claimDate}
                        /> 
                        
                      </Form.Group>
                    </Form>
                  </div>
                  
                  <div >
                    <Form>
                      <Form.Group widths='equal'>
                        <Form.Field
                          id='form-input-control-hospitalname'
                          control={Input}
                          label='Hospital Name'
                          placeholder='Hospital Name'
                          name="hospitalName"
                          onChange={this.handleChange}
                        />
                        
                        <Form.Field
                          id='form-input-control-description'
                          control={Input}
                          label='Description'
                          placeholder='Description'
                          name="description"
                          onChange={this.handleChange}
                        />
                      </Form.Group>
                    </Form>
                  </div>
                  <div >
                    <Form>
                      <Form.Group widths='equal'>
                        <Form.Field
                          id='form-input-control-amount'
                          control={Input}
                          label='Amount'
                          placeholder='Amount'
                          name="amount"
                          onChange={this.handleChange}
                        />
                        <Form.Field
                          id='form-input-control-claimdochash'
                          control={Input}
                          label='Upload Claim Docs'
                          name="claimHash"
                        >
                          <input style={{width: "90px"}} type="file" onChange={this.handleFileChange} />
                        </Form.Field>
                        
                      </Form.Group>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
            
            </Modal.Body>
            <Modal.Footer>
              <Card.Content extra>
                  <div className='ui two buttons' style={{paddingRight: "20px"}}>
                    <Button onClick={this.handleClaimSubmit} basic color='green'>
                      Claim
                    </Button>
                    <div style={{paddingRight: "20px"}}></div>
                    <Button onClick={this.hideClaimModal} basic color='red'>
                      Cancel
                    </Button>
                  </div>
                </Card.Content>
            </Modal.Footer>
          </Modal>
        </div>
        <br></br>
          </div>

          <div style={{paddingLeft: "20px", paddingRight: "20px"}}>
            <div style={{fontSize:"20px", position:"center",PaddingBottom: "10px"}} align = "center">
              <strong>{this.props.heading}</strong>
            </div>
            <div style={{fontSize:"20px", position:"center",PaddingBottom: "10px"}} align = "center"></div>
              <div style={{fontSize:"20px", display:"inline-block", paddingLeft: "20px"}}>
                <strong>My Policies</strong>
              </div>
              <div style={{display:"inline-block", float: "right"}}>
                <Button onClick={this.showPolicyModal} basic color='blue'>
                  Buy Policy
                </Button>
              </div>
              <table className="ui celled table ">
                <thead>
                <tr>
                  <th style={{textAlign:"center"}}>Policy ID</th>
                  <th style={{textAlign:"center"}}>Customer ID</th>
                  <th style={{textAlign:"center"}}>Applicant Name</th>
                  <th style={{textAlign:"center"}}>Policy Type</th>
                  <th style={{textAlign:"center"}}>KYC Documents</th>
                  <th style={{textAlign:"center"}}>Application Type</th>
                  <th style={{textAlign:"center"}}>Action</th>
                </tr></thead>
                <tbody>
                  { this.policyList() }
                </tbody>
              </table>
          </div>
          <br></br>
          <div style={{padding:"20px"}}>
            <div style={{fontSize:"20px", position:"center"}} align = "center"></div>
              <div style={{fontSize:"20px", position:"center", display:"inline-block", paddingLeft: "20px"}} align = "center">
                <strong>My Claims</strong>
              </div>
              <table className="ui celled table ">
                <thead>
                  <tr>
                    <th style={{textAlign:"center"}}>Claim ID</th>
                    <th style={{textAlign:"center"}}>Policy ID</th>
                    <th style={{textAlign:"center"}}>Date</th>
                    <th style={{textAlign:"center"}}>Hospital Name</th>
                    <th style={{textAlign:"center"}}>Description</th>
                    <th style={{textAlign:"center"}}>Documents</th>
                    <th style={{textAlign:"center"}}>Amount</th>
                    <th style={{textAlign:"center"}}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  { this.handleClaimList() }
                </tbody>
              </table>
          </div>  

          <br></br>
          <div style={{padding:"20px"}}>
            <div style={{fontSize:"20px", position:"center"}} align = "center"></div>
              <div style={{fontSize:"20px", position:"center", display:"inline-block", paddingLeft: "20px"}} align = "center">
                <strong>My Port Requests</strong>
              </div>
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
    );
  }
}

export default CreatePolicyDash;