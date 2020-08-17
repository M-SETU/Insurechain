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
        config: {
            rpcUrl: '', 
            chainId: 0
        },
        chainId: 0,
        click: false,
        login: false,
        loginText: "Login"
      };

        this.login = this.login.bind(this);
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
          config: {
            nodeUrl: 'https://rpc.goerli.mudit.blog/', 
            chainId: 5
            }
        })
    }
    
    async handleSubmit2() {
        await this.setState({
            name: "HDFC",
            network: "maticMumbai",
            address:"0x34c19b69dF26888041d593fBD4a06bD8983EB7CD",
            click: true,
            config: {
                nodeUrl: 'https://rpc-mumbai.matic.today', 
                chainId: 80001
            },
        })
    }
    

    async login() {
        try {
        if(this.state.loginText==="Login"){
            await this.loadWeb3();
            await this.loadBlockchainData();
            await this.setState({
                login: true
            })
            if(this.state.account!==''){
                await this.setState({
                    loginText: "Logout"
                })
            }
          }else{
            await this.state.portis.logout(() => {
                console.log('User logged out');
            });
            this.setState({
                login: false,
                loginText: "Login",
                account: ''
            })
          }
        } catch {
            window.alert("Select vendor first")
        }
      
    }
  
    
    async loadWeb3() {
  
      const portis = new Portis('a16b70b3-8f7c-49cc-b33f-98db6607f425', this.state.config);
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
            <header>
                <nav className="navbar navbar-light" style={{backgroundColor:"#0B1647"}}>
                    <div className=" col-1 navbar-brand" position="inline-block">
                        <img src={logo} style = {{width: "40px" , height: "40px"}} />
                    </div>
                    <div className= "col-1" style={{fontSize:"17px"}}>
                        <NavLink to={{
                            pathname: "/admin",
                        }}>Admin</NavLink>
                    </div>
                    <div className= "col-1" style={{fontSize:"17px"}}>
                        <NavLink to={{
                            pathname: '/CreatePolicyDash',
                        }}>policy</NavLink>
                    </div>
                    <div className= "col-1" style={{fontSize:"17px"}}>
                        <NavLink to={{
                            pathname: '/CreateClaimPolicy',
                        }}>claims</NavLink>
                    </div>
                    <div className= "col-6" style={{fontSize:"15px", position:"right", color:"white"}} align="right">
                        {this.state.account}
                    </div>
                    <div className= "col-1" style={{fontSize:"17px"}} align = "Right">
                        <Button onClick={this.login} basic color='green'>
                            {this.state.loginText}
                        </Button>
                    </div>
                    <ul>
                        {/* <li style={{display:"inline-block"}}>
                            <div className="navbar-brand" position="inline-block">
                                <img src={logo} style = {{width: "40px" , height: "40px"}} />
                            </div>
                        </li>
                        <li style={{display:"inline-block"}}><NavLink to={{
                            pathname: "/admin"
                            }}>Admin</NavLink>
                        </li> */}
                        {/* <li style={{display:"inline-block"}}><NavLink to={{
                            pathname: '/CreatePolicyDash',
                            }}>policy</NavLink>
                        </li>
                        <li style={{display:"inline-block"}}><NavLink to={{
                            pathname: '/CreateClaimPolicy',
                            }}>claims</NavLink>
                        </li> */}
                        {/* <li style={{display:"inline-block", position:"right"}} >
                            {this.state.account}
                        </li>
                        <li style={{display:"inline-block", position:"right"}} >
                            <Button onClick={this.login} basic color='green'>
                                {this.state.loginText}
                            </Button>
                        </li> */}
                    </ul>
                </nav>
            </header>
            <Switch>    
                <Route path="/admin" component={
                    () => <Admin 
                        address={this.state.address} 
                        web3={this.state.web3} 
                        account = {this.state.account}
                        portis = {this.state.portis}
                        loginstatus = {this.state.login}
                        config = {this.state.config}/>}/>

                <Route path="/CreateClaimPolicy" component={
                    () => <CreateClaimPolicy 
                        address={this.state.address} 
                        web3={this.state.web3} 
                        account = {this.state.account}
                        portis = {this.state.portis}
                        loginstatus = {this.state.login} 
                        config = {this.state.config}/>}/>

                <Route path="/CreatePolicyDash" component={
                    () => <CreatePolicyDash 
                        address={this.state.address} 
                        web3={this.state.web3} 
                        account = {this.state.account}
                        portis = {this.state.portis}
                        loginstatus = {this.state.login} 
                        config = {this.state.config}/>}/>

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
        </div>
      );
    }
}
  
  export default Dashboard;