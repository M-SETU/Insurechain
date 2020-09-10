import { Button, Card} from 'semantic-ui-react'
import React, { Component } from 'react'
import Web3 from 'web3'
import Policy from '../policy.json';
import Portis from '@portis/web3';
import logo from '../images/logos/Matic logo symbol.png';
import {Route, Switch, NavLink } from 'react-router-dom';
import CreatePolicyDash from "./CreatePolicyDash.js";
import Vendor from "./vendor.js";
import Modal from "react-bootstrap/Modal";
import "./dashboard.css"
import insurechain from '../images/logos/home-insurance-getty.jpg';


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
        loginText: "Login",
        owner : "",
        showNewCustomer: false,
        showOldCustomer: false,
        showVendor: false,
        loginButtonDisabled: true,
        copyVis: "hidden"
      };

        this.login = this.login.bind(this);
        this.loadWeb3 = this.loadWeb3.bind(this);
        this.handleSubmit1 = this.handleSubmit1.bind(this);
        this.handleSubmit2 = this.handleSubmit2.bind(this);
        this.newCustomerCheck = this.newCustomerCheck.bind(this);
    }
    async handleSubmit1() {
        await this.setState({
          name: "LIC",
          network: "goerli",
          address: "0xD22b4C3D639d85C255449Dc535B523a214219E0E",
          click: true,
          config: {
            nodeUrl: 'https://rpc.goerli.mudit.blog/', 
            chainId: 5
            }
        })
        this.login();
    }
    
    async handleSubmit2() {
        await this.setState({
            name: "HDFC",
            network: "maticMumbai",
            address:"0x21C5111620aEd2Fe7885c96C4b72fBf89095A085",
            click: true,
            config: {
                nodeUrl: 'https://rpc-mumbai.matic.today', 
                chainId: 80001
            },
        })
        this.login();
    }
    

    async login() {
        try {
        if(this.state.loginText==="Login"){
            await this.loadWeb3();
            await this.setState({
                login: true
            })
            if(this.state.account == this.state.owner){
              // await this.setState({
              //   // displayAdmin: "visible",
              //   // displayUser: "hidden"
              // })
              this.showVendorModal();
            }else{
              // await this.setState({
              //   // displayAdmin: "hidden",
              //   // displayUser: "visible"
              // })
              await this.newCustomerCheck();
            }
            if(this.state.account!==''){
                await this.setState({
                    loginButtonDisabled: false,
                    loginText: "Logout",
                    copyVis: "visible"
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
                // displayAdmin: "hidden",
                // displayUser: "hidden",
                loginButtonDisabled: true,
                copyVis: "hidden"
            })
          }
        } catch {
            await this.state.portis.logout(() => {});
            await this.setState({
              // displayAdmin: "hidden",
              // displayUser: "hidden",
              account: '',
              login: false,
              loginText: "Login",
              policy:{},
              portis: {},
              web3: {}, 
              copyVis: "hidden"
            })
        }
      
    }

    async newCustomerCheck(){
      const policy = new this.state.web3.eth.Contract(Policy, this.state.address);
      let isOldCustomer = await policy.methods.checkNewCustomer().call({from: this.state.account});
      if(isOldCustomer){
        this.showOldCustomerModal();
      }
      else{
        let customerId = await policy.methods.createNewCustomer()
          .send({from: this.state.account, gas:500000, gasPrice:10000000000})
        this.showNewCustomerModal();
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
      console.log(this.state.account);
      const policy = new this.state.web3.eth.Contract(Policy, this.state.address);
      this.setState({
          policy: policy
      });
      let owner = await policy.methods.getOwner().call({from: this.state.account});
      this.setState({
        owner: owner
      })
    }

    hideVendorModal = (e) => {
      this.setState({
        showVendor: false,
      });
    };
  
    showVendorModal = (e) => {
      this.setState({
        showVendor: true,
      });
    };

    hideNewCustomerModal = (e) => {
      this.setState({
        showNewCustomer: false,
      });
    };
  
    showNewCustomerModal = (e) => {
      this.setState({
        showNewCustomer: true,
      });
    };

    hideOldCustomerModal = (e) => {
      this.setState({
        showOldCustomer: false,
      });
    };
  
    showOldCustomerModal = (e) => {
      this.setState({
        showOldCustomer: true,
      });
    };
  
    render() {
      return (
        <div>
            <header>
              <Modal
                show={this.state.showNewCustomer}
                onHide={this.hideNewCustomerModal}
              >
                <Modal.Header>
                  <Modal.Title><b>Welcome to the Dapp</b></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {this.state.account}
                </Modal.Body>
                  
                <Modal.Footer>
                  <Card.Content extra>
                      <div className='ui two buttons' style={{paddingRight: "20px"}}>
                        <Button onClick={this.hideNewCustomerModal} basic color='green'>
                          Ok
                        </Button>
    
                      </div>
                    </Card.Content>
                </Modal.Footer>
              </Modal>
              <Modal
                show={this.state.showOldCustomer}
                onHide={this.hideOldCustomerModal}
              >
                <Modal.Header>
                  <Modal.Title><b>Welcome Back</b></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {this.state.account}
                </Modal.Body>
                  
                <Modal.Footer>
                <Card.Content extra>
                    <div className='ui two buttons' style={{paddingRight: "20px"}}>
                      <Button onClick={this.hideOldCustomerModal} basic color='green'>
                        Ok
                      </Button>
                    </div>
                  </Card.Content>
                </Modal.Footer>
              </Modal>
              <Modal
                show={this.state.showVendor}
                onHide={this.hideVendorModal}
              >
                <Modal.Header>
                  <Modal.Title><b>Welcome Vendor</b></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {this.state.account}
                </Modal.Body>
                  
                <Modal.Footer>
                  <Card.Content extra>
                    <div className='ui two buttons' style={{paddingRight: "20px"}}>
                      <Button onClick={this.hideVendorModal} basic color='green'>
                        Ok
                      </Button>
                    </div>
                  </Card.Content>
                </Modal.Footer>
              </Modal>

                <nav className="navbar navbar-light" style={{backgroundColor:"#0B1647"}}>
                    <div className=" col-0 navbar-brand" position="inline-block">
                      <NavLink to={{
                            pathname: '/',
                      }}><img src={logo} style = {{width: "40px" , height: "40px"}} />
                      <b style={{
                        position: "absolute",
                        color: "white",
                        top: "22px",
                        fontSize: "20px",
                        fontFamily: "arial"}}>Matic</b>
                      </NavLink> 
                    </div>
                    
                    <div className= "col-1" style={{fontSize:"17px",color:"white", visibility: "hidden"}}>
                        <NavLink to={{
                            pathname: '/CreatePolicyDash',
                        }}>My Policies</NavLink>
                    </div>
                    <div className= "col-1" style={{fontSize:"17px",color:"white",  visibility: "hidden" }}>
                        <NavLink to={{
                            pathname: '/vendor',
                        }}>Customers' Policies</NavLink>
                    </div>
                    
                    <div className= "col-7" style={{fontSize:"15px", position:"right", color:"white", visibility: this.state.copyVis}} align="right">
                      {/* <CopyToClipboard text={this.state.account}>
                        <Button basic color='yellow'>
                          Copy
                        </Button>
                      </CopyToClipboard> */}
                        {this.state.account} 
                    </div>
                    <div className= "col-1" style={{fontSize:"17px"}} align = "Right">
                        <NavLink to={{
                            pathname: '/',
                        }}>
                          <Button onClick={this.login} basic color='green'  disabled= {this.state.loginButtonDisabled} >
                            {this.state.loginText}
                          </Button>
                        </NavLink>
                        
                    </div>
                </nav>
            </header>
            <Switch>  

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
                    <div className="mainly">
                      <div className="title">
                        <h1>InsureChain</h1>
                      </div>
                      <div className="heading">
                        <h3> Your One Stop Smart Savings Accounts DeFi Platform</h3>
                      </div>
                      <div className="vendorCard1">
                        <h3>HDFC</h3>
                        <div className="btnVendor">
                          <NavLink to={{
                              pathname: '/vendor',
                          }}>
                            <p onClick={this.handleSubmit2} className="btnbtn" style={{color: "white"}}>
                              Vendor
                            </p>
                          </NavLink>
                        </div>

                        <div className="btnUser">
                          <NavLink to={{
                              pathname: '/CreatePolicyDash',
                          }}>
                            <p onClick={this.handleSubmit2} className="btnbtn" style={{color: "white"}}>
                              User
                            </p>
                          </NavLink>
                        </div>
                      </div>
                      <div className="vendorCard2">
                        <h3>ICICI</h3>
                        <div className="btnVendor1">
                          <NavLink to={{
                              pathname: '/vendor',
                          }}>
                            <p onClick={this.handleSubmit2} className="btnbtn" style={{color: "white"}}>
                              Vendor
                            </p>
                          </NavLink>
                        </div>

                        <div className="btnUser1">
                          <NavLink to={{
                              pathname: '/CreatePolicyDash',
                          }}>
                            <p onClick={this.handleSubmit2} className="btnbtn" style={{color: "white"}}>
                              User
                            </p>
                          </NavLink>
                        </div>
                      </div>
                      
                    </div>

                    <section id="about">
                      <div className="container">
                        <div className="row">
                          <div className="col-md-6">
                            <img src={insurechain} style={{width: "500px", height: "300px"}}/>
                            {/* <video autoPlay muted loop id="video" width= "500" height="300">
                              <source src={savifyvid} type="video/mp4">
                              </source>
                            </video> */}
                          </div>  
                          <div className ="col-md-6">
                            <h2>About Us</h2>
                            <div className="about-content">
                              One Stop Smart Savings Account platform that provides the facility to a user to let SaviFi do the job of managing his fund’s hassle-free. We plan to enable this by automatically toggling the users' funds from one platform to another basis the interest rates being offered across various Defi platforms. We aim to also incorporate trending methods like Yield farming to leverage on Defi protocols and generate higher returns for our users.
                            </div>
                          </div>      
                        </div>
                      </div>
                    </section>
                  </div>
                  


                  //   <div>
                  //   <div align="center">
                  //     <div style={{margin: "20px", display: "inline-block"}}>
                  //       <div align= "left">
                  //         <Card.Group>

                  //         {/* <Card>
                  //           <Card.Content>
                  //             <Card.Header>Vendor 1</Card.Header>
                  //             <Card.Meta>HF</Card.Meta>
                  //             <Card.Description>
                  //               <strong>HDFC</strong><br></br>
                  //               <strong>Matic</strong>
                  //             </Card.Description>
                  //           </Card.Content>
                  //           <Card.Content extra>
                  //             <div className='ui two buttons'>
                  //                   <Button onClick={this.handleSubmit2} basic color='blue'>
                  //                   Sign Up
                  //                   </Button>
                  //             </div>
                  //           </Card.Content>
                  //         </Card> */}
                          


                  //         {/* <Card>
                  //           <Card.Content>
                  //             <Card.Header>Vendor 2</Card.Header>
                  //             <Card.Meta>LC</Card.Meta>
                  //             <Card.Description>
                  //               <strong>LIC</strong><br></br>
                  //               <strong>Goerli</strong>
                  //             </Card.Description>
                  //           </Card.Content>
                  //           <Card.Content extra>
                  //             <div className='ui two buttons'>
                  //                   <Button onClick={this.handleSubmit1} basic color='blue'>
                  //                   SignUp
                  //                   </Button>
                  //             </div>
                  //           </Card.Content>
                  //         </Card> */}
                          
                  //       </Card.Group>
                  //       </div>
                  //     </div>
                  //   </div>
                  // </div>
                }/>
            </Switch>           
        </div>
      );
    }
}
  
  export default Dashboard;