import { Button, Form, Input} from 'semantic-ui-react'
import React, { Component } from 'react'
import Web3 from 'web3'
import Policy from '../abis/policy.json';
import Portis from '@portis/web3';
import {Link } from 'react-router-dom';
import ipfs from './ipfs.js'

const ClaimCard = props => (
  <tr>
    <td>{props.claimCard[0]}</td>
    <td>{props.claimCard[1]}</td>
    <td>{props.claimCard[2]}</td>
    <td>{props.claimCard[3]}</td>
    <td data-label="hash">
      <a href={`https://ipfs.infura.io/ipfs/${props.claimCard[5]}`}>{props.claimCard[5]}</a>
    </td>
    <td>{props.claimCard[4]}</td>
    <td>{props.claimCard[6]}</td>
  </tr>
)

const PolicyOptions = props => (
  <option value={props.opt}>
    {props.opt}
  </option>
)

class CreateClaimPolicy extends Component {

  constructor(props) {
    super(props)
    this.state = {
      buffer: null,
      account: '',
      policyId: '',
      claimDate: '',
      hospitalName: '',
      description: '',
      amount: 0,
      claimHash: '',
      policy:{},
      portis: {},
      policyIdsArray: [],
      claimsList: [],
      web3: {},
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClaimSubmit = this.handleClaimSubmit.bind(this); 
    this.loadBlockchainData = this.loadBlockchainData.bind(this);
    this.handleClaimList = this.handleClaimList.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handlePolicyId = this.handlePolicyId.bind(this);
  }

  async componentWillMount() {
    if(this.props.loginstatus === true)
    {
      await this.setState({
        policy: this.props.policy,
        web3: this.props.web3,
        portis: this.props.portis,
        account: this.props.account
      })
      await this.loadBlockchainData();
      await this.handleClaimsLoop();
    }
  }

  async loadBlockchainData(){
    const policy = new this.state.web3.eth.Contract(Policy, this.props.address);
    this.setState({policy});

    let b = await this.state.policy.methods.getUserCustomerId(
      this.state.account)
    .call({from: this.state.account});

    let c = await this.state.policy.methods.getUserPolicies(
      this.state.account)
    .call({from: this.state.account});

    this.setState({
      policyIdsArray: c,
    })
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

  async handleClaimSubmit (){
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
        .then ((receipt) => {
          console.log(receipt);
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

  async handleClaimsLoop(){
    var ids = this.state.policyIdsArray;
    var arr = [];
    for(let i = 0; i <ids.length; i++) {
      let details = await this.state.policy.methods.getPolicy(ids[i])
        .call({from: this.state.account});
      let allclaims = details[5];
      for (let j = 0; j<allclaims.length;j++){
        let cl = await this.state.policy.methods.getClaim(allclaims[j])
        .call({from: this.state.account});
        arr.push(cl);
      }
    }
    this.setState({
      claimsList: arr
    })
  }

  policyOptionsList() {
    return this.state.policyIdsArray.map(currentpol => {
      return <PolicyOptions opt={currentpol} key={currentpol}/>;
    })
  }

  async handlePolicyId (evt) {
    await this.setState({ policyId: evt.target.value });
  }

  handleClaimList() {
    return this.state.claimsList.map(currentclaim => {
      return <ClaimCard claimCard={currentclaim} key={currentclaim[0]}/>;
    })
  }
  render() {
    return (
      <div align="center">
          <div style={{
            marginLeft: "75px", 
            marginRight:"75px", 
            marginTop:"40px", 
            position:"center",
            }} align="center">
              <div style={{
                borderWidth:"2px", 
                borderColor:"blue", 
                padding:"25px",
                borderRadius:"15px" 
                }} className = "border border-dark">
                <div align="center">
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
                          name="id">
                            <select id="policyId" onChange={this.handlePolicyId}
                              >
                              <option value="None" defaultValue>
                                {"None"}
                              </option>
                              {this.policyOptionsList()}
                            </select>
                        </Form.Field>
                        <Form.Field
                          id='form-input-control-claimdate'
                          control={Input}
                          label='Claim Date'
                          placeholder='Date'
                          name="claimDate"
                          onChange={this.handleChange}
                        />
                        <Form.Field
                          id='form-input-control-hospitalname'
                          control={Input}
                          label='Hospital Name'
                          placeholder='Hospital Name'
                          name="hospitalName"
                          onChange={this.handleChange}
                        />
                      </Form.Group>
                    </Form>
                  </div>
                  
                  <div >
                    <Form>
                      <Form.Group widths='equal'>
                        
                        <Form.Field
                          id='form-input-control-description'
                          control={Input}
                          label='Description'
                          placeholder='Description'
                          name="description"
                          onChange={this.handleChange}
                        />
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
                          <input type="file" onChange={this.handleFileChange} />
                        </Form.Field>
                      </Form.Group>
                    </Form>
                  </div>
                </div>
                
                <div className='ui two buttons'>
                  <Button onClick={this.handleClaimSubmit} basic color='blue'>
                    Claim
                  </Button>
                </div>
            </div>
        </div> 
        <br></br>
          <div style={{padding:"20px"}}>
            <div style={{fontSize:"20px", position:"center"}} align = "center"><strong>All Claims</strong></div>
              <table className="ui celled table ">
                <thead>
                  <tr>
                    <th>ClaimId</th>
                    <th>Date</th>
                    <th>Hospital Name</th>
                    <th>Description</th>
                    <th>Docs</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  { this.handleClaimList() }
                </tbody>
              </table>
          </div>  
      </div>
    );
  }
}

export default CreateClaimPolicy;