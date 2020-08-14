import React, { Component } from 'react';
import Web3 from 'web3'
import { Button, Dropdown, Menu } from 'semantic-ui-react'
import Portis from '@portis/web3';
import Policy from '../abis/policy.json';

export default class MenuExampleSizeMini extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      hash: '',
      policySelected: 'SmartLife',
      policy:{},
      policyTypes: [],
      allpolicyTypes: [],
      portis: {},
      activeItem: 'home'
    };
    //this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.loadWeb3 = this.loadWeb3.bind(this);
    this.loadBlockchainData = this.loadBlockchainData.bind(this);

  }

  async login() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {

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
    const policy = new this.state.web3.eth.Contract(Policy, this.props.location.state.address);
    this.setState({policy});

    let a = await this.state.policy.methods.getPolicyTypes().call({from: this.state.account});
    this.setState({
      policyTypes: a
    })
    console.log(a)

    // let b = await this.state.policy.methods.getUserCustomerId(
    //   this.state.account)
    // .call({from: this.state.account});
    // console.log(b.toNumber());

    // let c = await this.state.policy.methods.getUserPolicies(
    //   this.state.account)
    // .call({from: this.state.account});
    // console.log(c.toNumber());

    this.setState({
      allpolicyTypes: [
        { key: 'a', text: this.state.policyTypes[0], value: this.state.policyTypes[0] },
        { key: 'b', text: this.state.policyTypes[1], value: this.state.policyTypes[1] },
        { key: 'c', text: this.state.policyTypes[2], value: this.state.policyTypes[2] },
        { key: 'd', text: this.state.policyTypes[3], value: this.state.policyTypes[3] }
      ],
    })
  }

  

  async logout() {
    await this.state.portis.logout(() => {
      console.log('User logged out');
    });
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    

    return (
      <Menu size='mini'>
        <Menu.Item
          name='Admin'
          active={activeItem === 'home'}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          name='User'
          active={activeItem === 'messages'}
          onClick={this.handleItemClick}
        />

        <Menu.Menu position='right'>
       

          <Menu.Item>
          <Button onClick={this.login} basic color='green'>
            Login
          </Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }
}