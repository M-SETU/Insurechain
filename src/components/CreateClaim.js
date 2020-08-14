import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import Policy from '../abis/policy.json';
import { Form, Input, TextArea, Button, Select } from 'semantic-ui-react'
import Portis from '@portis/web3';

const policyaddress = "0xF601fc2817Df7A3232bC177214B6C01c32e0978a";

class CreateClaim extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      hash: '',
      hospitalName: '',
      claimDate: '',
      policyId: '',
      claimHash: '',
      description: '',
      amount: '',
      policy:{},
      portis: {}
    };
    this.handleChange = this.handleChange.bind(this);
    //this.handlePolicySubmit = this.handlePolicySubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.login = this.login.bind(this);
    // this.logout = this.logout.bind(this);
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  
  async loadWeb3() {
      
    // if (window.ethereum) {
    //   const web3 = new Web3(window.ethereum)
    //   await window.ethereum.enable()
    // this.setState({ web3 })
    // }
    // else if (window.web3) {
    //   const web3 = new Web3(window.web3.currentProvider)
    // this.setState({ web3 })
    // }
    // else {
    //   window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    // }

    const portis = new Portis('a16b70b3-8f7c-49cc-b33f-98db6607f425', "maticMumbai");
    this.setState({
      portis: portis
    })
    const web3 = new Web3(portis.provider);
    this.setState({ web3 })
    let acc = await web3.eth.getAccounts();
    this.setState({
      account: acc[0]
    })
  }

  async loadBlockchainData(){
    const policy = new this.state.web3.eth.Contract(Policy, policyaddress);
    this.setState({policy});

    let b = await this.state.policy.methods.getUserCustomerId(this.state.account).call({from: this.state.account});
    console.log(b);

  }

  handleChange (evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  async handleSubmit() {    
    let result;
    result = await this.state.policy.methods.claimPolicy(
        this.state.policyId,
        this.state.claimDate,
        this.state.hospitalName,
        this.state.description,
        this.state.amount,
        this.state.claimdocs)
    .send({from: this.state.account})
    .on('transactionHash', (hash) => {
      console.log(result);
    })    
  }


  render() {

    return (
      <div style={{margin: "20px"}} align="center" >
        <div className= "col-sm-2 col-sm-push-0 col-md-4 col-md-push-0">
          <Form>
            <Form.Group widths='equal'>
              <Form.Field
                id='form-input-control-policyid'
                control={Input}
                label='Policy Id'
                placeholder='Policy Id'
                name="policyId"
                onChange={this.handleChange}
              />
            </Form.Group>
          </Form>
        </div>
        <div className= "col-sm-2 col-sm-push-0 col-md-4 col-md-push-0">
          <Form>
            <Form.Group widths='equal'>
              <Form.Field
                id='form-input-control-claimdate'
                control={Input}
                label='Claim Date'
                placeholder='Claim Date'
                name="claimDate"
                onChange={this.handleChange}
              />
            </Form.Group>
          </Form>
        </div>
        <div className= "col-sm-2 col-sm-push-0 col-md-4 col-md-push-0">
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
            </Form.Group>
          </Form>
        </div>
        <div className= "col-sm-2 col-sm-push-0 col-md-4 col-md-push-0">
          <Form>
            <Form.Group widths='equal'>
              <Form.Field
                id='form-input-control-desc'
                control={Input}
                label='Description'
                placeholder='Description'
                name="description"
                onChange={this.handleChange}
              />
            </Form.Group>
          </Form>
        </div>
        <div className= "col-sm-2 col-sm-push-0 col-md-4 col-md-push-0">
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
            </Form.Group>
          </Form>
        </div>
        <div className= "col-sm-2 col-sm-push-0 col-md-4 col-md-push-0">
          <Form>
            <Form.Group widths='equal'>
              <Form.Field
                id='form-input-control-claimhash'
                control={Input}
                label='Claim Hash'
                placeholder='claim Hash'
                name="claimHash"
                onChange={this.handleChange}
              />
            </Form.Group>
          </Form>
        </div>
        <div className= "col-sm-2 col-sm-push-0 col-md-4 col-md-push-0">
          <Form>
            <Form.Group widths='equal'>
              <Form.Field
                id='form-button-control-public'
                control={Button}
                content='Confirm'
                color="blue"
                onClick={this.handleSubmit}
              />
            </Form.Group> 
          </Form>
        </div>      
      </div>
    );
  }
}

export default CreateClaim;
