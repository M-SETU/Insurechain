import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import Policy from '../abis/policy.json';
import { Form, Input, TextArea, Button, Select } from 'semantic-ui-react'
import Portis from '@portis/web3';

const policyaddress = "0xF601fc2817Df7A3232bC177214B6C01c32e0978a";

class CreatePolicy extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      hash: '',
      policySelected: 'SmartLife',
      policy:{},
      policyTypes: [],
      allpolicyTypes: [],
      portis: {}
    };
    this.handleChange = this.handleChange.bind(this);
    this.handlePolicySubmit = this.handlePolicySubmit.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.loadWeb3 = this.loadWeb3.bind(this);
    this.loadBlockchainData = this.loadBlockchainData.bind(this);

  
  }
  // async componentWillMount() {
  //   await this.loadWeb3()
  //   await this.loadBlockchainData()
  // }
  async login() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async logout() {
    await this.state.portis.logout(() => {
      console.log('User logged out');
    });
  }

  
  async loadWeb3() {

    // if (window.ethereum) {
    //   const web3 = new Web3(window.ethereum)
    //   await window.ethereum.enable()
    // this.setState({ web3 })
    // }
    // else if (window.web3) {
    //   const web3 = new Web3(window.web3.currentProvider)
    //   this.setState({ web3 })
    // }
    // else {
    //   window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    // }

    const portis = new Portis('a16b70b3-8f7c-49cc-b33f-98db6607f425', this.props.location.state.network);
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

    let a = await this.state.policy.methods.getPolicyTypes().call({from: this.state.account});
    this.setState({
      policyTypes: a
    })
    console.log(a)

    let b = await this.state.policy.methods.getUserCustomerId(
      this.state.account)
    .call({from: this.state.account});
    console.log(b.toNumber());

    let c = await this.state.policy.methods.getUserPolicies(
      this.state.account)
    .call({from: this.state.account});
    console.log(c.toNumber());

    this.setState({
      allpolicyTypes: [
        { key: 'a', text: this.state.policyTypes[0], value: this.state.policyTypes[0] },
        { key: 'b', text: this.state.policyTypes[1], value: this.state.policyTypes[1] },
        { key: 'c', text: this.state.policyTypes[2], value: this.state.policyTypes[2] },
        { key: 'd', text: this.state.policyTypes[3], value: this.state.policyTypes[3] }
      ],
    })
  }

  async handlePolicySubmit (){
    console.log(this.state.hash)
    console.log(this.state.policySelected)
    console.log(this.state.policy)
    console.log(this.state.account)

    this.state.policy.methods.createPolicy(
      this.state.hash, this.state.policySelected)
    .send({from: this.state.account, gasPrice: 400000})
    .then ((receipt) => {
      console.log(receipt);
    });
  }

  handleChange (evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }


  render() {

    return (
      <div style={{margin: "20px"}} align="center" >
        <div className= "col-sm-2 col-sm-push-0 col-md-4 col-md-push-0">
          <div className='ui two buttons' >
            <Button onClick={this.login} basic color='green'>
              Login
            </Button>
            <Button onClick={this.logout} basic color='red'>
              Logout
            </Button>
          </div>
          <div>
            <strong>{this.state.account}</strong>
          </div>
        </div>
        <br></br>
        <div className= "col-sm-2 col-sm-push-0 col-md-4 col-md-push-0">
          <Form>
            <Form.Group widths='equal'>
              <Form.Field
                control={Select}
                options={this.state.allpolicyTypes}
                label={{ children: 'Policy Type', htmlFor: 'form-select-policytype' }}
                placeholder='Policy Type'
                search
                searchInput={{ id: 'form-select-policytype' }}
                name="policySelected"
                onChange={this.handleChange}
              />
            </Form.Group>
          </Form>
        </div>
        <div className= "col-sm-2 col-sm-push-0 col-md-4 col-md-push-0">
          <Form>
            <Form.Group widths='equal'>
              <Form.Field
                id='form-input-control-documenthash'
                control={Input}
                label='Document Hash'
                placeholder='Document Hash'
                name="hash"
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
                onClick={this.handlePolicySubmit}
              />
            </Form.Group> 
          </Form>
        </div>      
      </div>
    );
  }
}

export default CreatePolicy;
