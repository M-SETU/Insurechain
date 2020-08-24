import { Button, Card} from 'semantic-ui-react'
import React, { Component } from 'react'
import Web3 from 'web3'
import Policy from '../abis/policy.json';
import Portis from '@portis/web3';
import logo from '../images/logos/Matic logo symbol.png';
import {Route, Switch, NavLink } from 'react-router-dom';
import CreatePolicyDash from "./CreatePolicyDash.js";
import Vendor from "./vendor.js";
import Home from "./Home.js";
import Pos from "./matic.js"

class Dashboard extends Component {

    constructor(props) {
      super(props)
      this.state = {
        displayAdmin: "hidden",
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
        loginText: "Login",
        owner : ""
      };

        this.login = this.login.bind(this);
        this.loadWeb3 = this.loadWeb3.bind(this);
        this.handleSubmit1 = this.handleSubmit1.bind(this);
        this.handleSubmit2 = this.handleSubmit2.bind(this);
    
    }
    async handleSubmit1() {
        await this.setState({
          name: "LIC",
          network: "goerli",
          address: "0x6dB46d8c9C9A3Dc4B4493C04358D969aB763ED7f",
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
            address:"0x6E441c6E95387c6761Ec44CB006891583c4Bed06",
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
            await this.setState({
                login: true
            })
            if(this.state.account == this.state.owner){
              await this.setState({
                displayAdmin: "visible"
              })
            }else{
              await this.setState({
                displayAdmin: "hidden"
              })
            }
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
                account: '',
                displayAdmin: "hidden"
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
      const policy = new this.state.web3.eth.Contract(Policy, this.state.address);
      this.setState({
          policy: policy
      });
      let owner = await policy.methods.getOwner().call({from: this.state.account});
      this.setState({
        owner: owner
      })
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
                            pathname: '/home',
                        }}>Home</NavLink>
                    </div>
                    <div className= "col-1" style={{fontSize:"17px"}}>
                        <NavLink to={{
                            pathname: '/matic',
                        }}>Matic</NavLink>
                    </div>
                    <div className= "col-1" style={{fontSize:"17px"}}>
                        <NavLink to={{
                            pathname: '/CreatePolicyDash',
                        }}>User</NavLink>
                    </div>
                    <div className= "col-1" style={{fontSize:"17px", visibility: this.state.displayAdmin }}>
                        <NavLink to={{
                            pathname: '/vendor',
                        }}>Vendor</NavLink>
                    </div>
                    
                    <div className= "col-6" style={{fontSize:"15px", position:"right", color:"white"}} align="right">
                        {this.state.account}
                    </div>
                    <div className= "col-1" style={{fontSize:"17px"}} align = "Right">
                        <Button onClick={this.login} basic color='green'>
                            {this.state.loginText}
                        </Button>
                    </div>
                </nav>
            </header>
            <Switch>  
                <Route path="/home" component={
                    () => <Home/>}/>

                <Route path="/matic" component={
                    () => <Pos/>}/>

                <Route path="/vendor" component={
                    () => <Vendor
                        address={this.state.address} 
                        web3={this.state.web3} 
                        account = {this.state.account}
                        portis = {this.state.portis}
                        loginstatus = {this.state.login}
                        config = {this.state.config}
                        owner = {this.state.owner}/>}/>

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
                                    pathname: '/home',
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
                                    pathname: '/home',
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