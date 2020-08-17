import { Button, Card, Form, Input,  Select, Menu} from 'semantic-ui-react'
import React, { Component } from 'react'
import Web3 from 'web3'
import Policy from '../abis/policy.json';
import Portis from '@portis/web3';
import logo from '../images/logos/Matic logo symbol.png';
import {Route, Link, Switch, NavLink } from 'react-router-dom';
import CreatePolicyDash from "./CreatePolicyDash.js";
import CreateClaimPolicy from "./CreateClaimPolicy.js";
import Admin from "./admin.js";
import Home from './Home.js';

class Dashboard extends Component {

    constructor(props) {
      super(props)
      this.state = {
        account: '',
        policy:{},
        portis: {},
        web3: {},
        name: "",
        network: "",
        address:"",
        chainId: 0,
        click: false,
        login: false
      };

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.loadWeb3 = this.loadWeb3.bind(this);
        this.loadBlockchainData = this.loadBlockchainData.bind(this);
        this.handleSubmit1 = this.handleSubmit1.bind(this);
        this.handleSubmit2 = this.handleSubmit2.bind(this);
    
    }
    async handleSubmit1() {
        await this.setState({
          name: "LIC",
          network: "goerli",
          address: "0x9bf61c1e0Fdd845e0b7C6C33598cA830fDa6fCbF",
          click: true,
          chainId: 5
        })
    }
    
    async handleSubmit2() {
    await this.setState({
        name: "HDFC",
        network: "maticMumbai",
        address:"0x9bf61c1e0Fdd845e0b7C6C33598cA830fDa6fCbF",
        click: true,
        chainId: 80001
    })
    }
    

    async login() {
      await this.loadWeb3();
      await this.loadBlockchainData();
      this.setState({
          login: true
      })
    }
  
    async logout() {
      await this.state.portis.logout(() => {
        console.log('User logged out');
      });
      this.setState({
        login: false
    })
    }
  
    
    async loadWeb3() {

   // const myPrivateEthereumNode = {
   //   rpcUrl: 'https://rpc-mumbai.matic.today', // your own node url
   //  chainId: 80001 // chainId of your own node
   //  }
  
      const portis = new Portis('a16b70b3-8f7c-49cc-b33f-98db6607f425', myPrivateEthereumNode);
      this.setState({
        portis: portis
      })
      const web3 = new Web3(portis.provider);
      this.setState({ 
          web3: web3 })
      let acc = await web3.eth.getAccounts();
      this.setState({
        account: acc[0]
      })
    }
  
    async loadBlockchainData(){
      const policy = new this.state.web3.eth.Contract(Policy, this.props.address);
      this.setState({
          policy: policy});
    }
  
    render() {
      return (
        <div>
            <>
            <header>
                <nav className="navbar navbar-light" style={{backgroundColor:"#0B1647"}}>
                    <ul>
                        <li style={{display:"inline-block"}}>
                            <div className="navbar-brand" position="inline-block">
                                <img src={logo} style = {{width: "40px" , height: "40px"}} />
                            </div>
                        </li>
                        <li style={{display:"inline-block"}}><NavLink
                            to="/admin"
                            exact
                            activeClassName="my-active"
                            activeStyle={{
                                color: '#fa923f',
                                textDecoration: 'underline'
                            }}
                            >Admin</NavLink></li>
                        <li style={{display:"inline-block"}}><NavLink to={{
                            pathname: '/CreatePolicyDash',
                        }}>policy</NavLink></li>
                        <li style={{display:"inline-block"}}><NavLink to={{
                            pathname: '/CreateClaimPolicy',
                        }}>claims</NavLink></li>
                        <li style={{display:"inline-block", position:"right"}} >
                            {this.state.account}
                        </li>
                        <li style={{display:"inline-block", position:"right"}} >
                            <Button onClick={this.login} basic color='green'>
                                Login
                            </Button>
                        </li>
                    </ul>
                </nav>
            </header>
            <Switch>    
                <Route path="/admin" component={
                    () => <Admin 
                        policy={this.state.policy} 
                        web3={this.state.web3} 
                        account = {this.state.account}
                        portis = {this.state.portis} />}/>

                <Route path="/CreateClaimPolicy" component={
                    () => <CreateClaimPolicy 
                        policy={this.state.policy} 
                        web3={this.state.web3} 
                        account = {this.state.account}
                        portis = {this.state.portis} />}/>

                <Route path="/CreatePolicyDash" component={
                    () => <CreatePolicyDash 
                        address={this.state.address} 
                        web3={this.state.web3} 
                        account = {this.state.account}
                        portis = {this.state.portis}
                        loginstatus = {this.state.login} />}/>

                <Route path="/" render={() => 
                    <div>
                    <div align="center">
                      <div style={{margin: "20px", display: "inline-block"}}>
                        <div align= "left">
                          <Card.Group>
                          <Card>
                            <Card.Content>
                              <Card.Header>Vendor 1</Card.Header>
                              <Card.Meta>LC</Card.Meta>
                              <Card.Description>
                                <strong>LIC</strong><br></br>
                                <strong>Goerli</strong>
                              </Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                              <div className='ui two buttons'>
                                <NavLink to={{
                                    pathname: '/CreatePolicyDash',
                                }}
                                >
                                    <Button onClick={this.handleSubmit1} basic color='blue'>
                                    Select
                                    </Button>
                                </NavLink>
                              </div>
                            </Card.Content>
                          </Card>
                          <Card>
                            <Card.Content>
                              <Card.Header>Vendor 2</Card.Header>
                              <Card.Meta>HF</Card.Meta>
                              <Card.Description>
                                <strong>HDFC</strong><br></br>
                                <strong>Matic</strong>
                              </Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                              <div className='ui two buttons'>
                                <NavLink to={{
                                    pathname: '/CreatePolicyDash',
                                }}
                                >
                                    <Button onClick={this.handleSubmit2} basic color='blue'>
                                    Select
                                    </Button>
                                </NavLink>
                              </div>
                            </Card.Content>
                          </Card>
                        </Card.Group>
                        </div>
                      </div>
                    </div>
                  </div>
                }/>
            </Switch>           
            </>
        </div>
      );
    }
}
  
  export default Dashboard;