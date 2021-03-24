import { Button, Card} from 'semantic-ui-react'
import React, { Component } from 'react'
import Web3 from 'web3'
import Policy from '../abis/policy_1.json';
import Portis from '@portis/web3';
import logo from '../images/logos/polygon.png';
import infosysLogo from '../images/logos/infosys.png';
import {Route, Switch, NavLink } from 'react-router-dom';
import CreatePolicyDash from "./CreatePolicyDash.js";
import Vendor from "./vendor.js";
import Modal from "react-bootstrap/Modal";
import "./dashboard.css"
import insuranc from "../images/logos/43951.jpg";
import question from "../images/logos/64627.jpg";
import customer from "../images/logos/2650149.jpg";
import MainImage from "../images/logos/help.png";
import details from '../details.json'


class Dashboard extends Component {

    constructor(props) {
      super(props)
      this.state = {
        email: '',
        account: '',
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
        showUser: false,
        showVendor: false,
        loginButtonDisabled: true,
        heading: "",
        
      };

        this.login = this.login.bind(this);
        this.loadWeb3 = this.loadWeb3.bind(this);
        this.handleSubmit1 = this.handleSubmit1.bind(this);
        this.handleSubmit2 = this.handleSubmit2.bind(this);
    }
    async handleSubmit1() {
        await this.setState({
          heading: details["VENDOR1_NAME"],
          network: "maticMumbai",
          address: details["CONTRACT1_ADDRESS"],
          myOwner: details["VENDOR1_ADDRRESS"],
          otherVendorOwner: details["VENDOR2_ADDRRESS"],
          click: true,
          config: {
            nodeUrl: 'https://rpc-mumbai.matic.today', 
            chainId: 80001
          },
        })
        this.login();
    }
    
    async handleSubmit2() {
        await this.setState({
          heading: details["VENDOR2_NAME"],
          network: "maticMumbai",
          address: details["CONTRACT2_ADDRESS"],
          myOwner: details["VENDOR2_ADDRRESS"],
          otherVendorOwner: details["VENDOR1_ADDRRESS"],
          click: true,
          // config: {
          //   nodeUrl: 'https://rpc-60001.matic.today', 
          //   chainId: 60001
          // },
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
            if(this.state.account === this.state.owner){
              this.showVendorModal();
            }else{
              this.showUserModal();
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
                loginButtonDisabled: true,
                copyVis: "hidden",
                email:'',
            })
          }
        } catch {
            await this.state.portis.logout(() => {});
            await this.setState({
              account: '',
              login: false,
              loginText: "Login",
              policy:{},
              portis: {},
              web3: {}, 
              copyVis: "hidden",
              email: ''
            })
        }
      
    }

    async loadWeb3() {
      const portis = new Portis('8f5bb2d2-4810-4f48-8023-df9f6cfc9711', this.state.config,  { scope: ['email']});
      const portisGoerli = new Portis('8f5bb2d2-4810-4f48-8023-df9f6cfc9711', {
        nodeUrl: 'https://goerli.infura.io/v3/166476a8c1cc4b4c93f6f81b2c97aeb1', 
        chainId: 5
      });
      portis.onLogin(async (walletAddress, email) => {
        console.log(walletAddress)
        console.log(email)
        await this.setState({
          email: email,
          
        })
      });

      await this.setState({
        portis: portis,
        portisGoerli: portisGoerli
      })
      const web3 = new Web3(portis.provider);
      const web3Goerli = new Web3(portisGoerli.provider);
      await this.setState({ 
          web3: web3,
          web3Goerli: web3Goerli })
      let acc = await web3.eth.getAccounts();
      await this.setState({
        account: acc[0]
      })
      const policy = new web3.eth.Contract(Policy, this.state.address);
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

    hideUserModal = (e) => {
      this.setState({
        showUser: false,
      });
    };
  
    showUserModal = (e) => {
      this.setState({
        showUser: true,
      });
    };


  
    render() {
      return (
        <div>
            <header>
              <Modal
                show={this.state.showUser}
                onHide={this.hideUserModal}
              >
                <Modal.Header>
                  <Modal.Title><b>Welcome to the Dapp</b></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {this.state.email}
                </Modal.Body>
                  
                <Modal.Footer>
                  <Card.Content extra>
                      <div className='ui two buttons' style={{paddingRight: "20px"}}>
                        <Button onClick={this.hideUserModal} basic color='green'>
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
                {this.state.email}
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

                <nav className="navbar navbar-light" style={{backgroundColor:"#00145B"}}>
                    <div className=" col-0 navbar-brand" position="inline-block">
                      <NavLink to={{
                            pathname: '/',
                      }}>
                      <img src={logo} style = {{width: "40px" , height: "40px"}} />
                      <b style={{
                        position: "absolute",
                        color: "white",
                        top: "22px",
                        fontSize: "20px",
                        paddingLeft: "8px",
                        fontFamily: "arial"}}>Polygon</b>
                      <img src={infosysLogo} style = {{width: "290px" , height: "40px", paddingLeft: "90px"}} />
                      <b style={{
                        position: "absolute",
                        color: "white",
                        top: "22px",
                        fontSize: "20px",
                        paddingLeft: "8px",
                        fontFamily: "arial"}}>{this.state.heading}</b>
                      </NavLink> 
                    </div>
                    
                    {/* <div className= "col-1" style={{fontSize:"17px",color:"white", visibility: "hidden"}}>
                        <NavLink to={{
                            pathname: '/CreatePolicyDash',
                        }}>My Policies</NavLink>
                    </div>
                    <div className= "col-1" style={{fontSize:"17px",color:"white",  visibility: "hidden" }}>
                        <NavLink to={{
                            pathname: '/vendor',
                        }}>Customers' Policies</NavLink>
                    </div> */}
                    
                    <div className= "col-7" style={{fontSize:"15px", position:"right", color:"white", visibility: this.state.copyVis}} align="right">
                        {this.state.email} 
                    </div>
                    <div className= "col-1" style={{fontSize:"17px"}} align = "Right">
                        <NavLink to={{
                            pathname: '/',
                        }}>
                          <Button onClick={this.login}  disabled= {this.state.loginButtonDisabled} >
                            {this.state.loginText}
                          </Button>
                        </NavLink>
                        
                    </div>
                </nav>
            </header>
            <Switch>  

                <Route path="/vendor" component={
                    () => <Vendor
                        heading={this.state.heading}
                        address={this.state.address} 
                        web3={this.state.web3} 
                        web3Goerli = {this.state.web3Goerli}
                        account = {this.state.account}
                        portis = {this.state.portis}
                        portisGoerli = {this.state.portisGoerli}
                        myOwner = {this.state.myOwner}
                        otherVendorOwner = {this.state.otherVendorOwner}
                        loginStatus = {this.state.login}/>}/>

                <Route path="/CreatePolicyDash" component={
                    () => <CreatePolicyDash 
                        heading={this.state.heading}
                        address={this.state.address} 
                        web3={this.state.web3} 
                        web3Goerli = {this.state.web3Goerli}
                        account = {this.state.account}
                        portis = {this.state.portis}
                        portisGoerli = {this.state.portisGoerli}
                        myOwner = {this.state.myOwner}
                        otherVendorOwner = {this.state.otherVendorOwner}
                        loginStatus = {this.state.login}/>}/>

                <Route path="/" render={() => 
                  <div> 
                    <div className="mainly">
                      <div className="title">
                        <h1>InsureChain</h1>
                      </div>
                      <div className="heading">
                        <h3> Your One Stop Smart Insurance Policy</h3>
                      </div>
                      <div className="main-image">
                        <img src={MainImage}></img>
                      </div>
                      <div className="vendorCard1">
                        <h3>HDFC</h3>
                        <div className="btnVendor">
                          <NavLink to={{
                              pathname: '/vendor',
                          }}>
                            <p onClick={this.handleSubmit1} className="btnbtn" style={{color: "white"}}>
                              Vendor
                            </p>
                          </NavLink>
                        </div>

                        <div className="btnUser">
                          <NavLink to={{
                              pathname: '/CreatePolicyDash',
                          }}>
                            <p onClick={this.handleSubmit1} className="btnbtn" style={{color: "white"}}>
                              User
                            </p>
                          </NavLink>
                        </div>
                      </div>
                      <div className="vendorCard2">
                        <h3>LIC</h3>
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
                          
                          <div className ="row">
                            <h2 style={{marginLeft:"-50px"}}>Key Benefits</h2>
                            <div className="about-content">We plan to enable this by automatically toggling the users' funds from one platform to another basis the interest rates being offered across various Defi platforms. We aim to also incorporate trending methods like Yield farming
                            </div>
                          </div>   
                          <div className="next-content">
<div className="section1">
                          <div className="ui link cards">
                          <div className="card">
    <div className="image">
      <img src={insuranc}></img>
    </div>
    <div className="content">
      <div className="header">
Lowest Price
</div>
      <div className="meta">
        <a>
Guaranteed</a>
      </div>
      <div className="description">
        Matthew is an interior designer living in New York.
      </div>
    </div>
    <div className="extra content">
      <span className="right floated">
        Joined in 2013
      </span>
      <span>
        <i className="user icon"></i>
        75 Friends
      </span>
    </div>
  </div>

  <div className="card">
    <div className="image">
      <img src={insuranc}></img>
    </div>
    <div className="content">
      <div className="header">
Unbiased Advice</div>
      <div className="meta">
        <span className="date">


Keeping customers first

</span>
      </div>
      <div className="description">
        Molly is a personal assistant living in Paris.
      </div>
    </div>
    <div className="extra content">
      <span className="right floated">
        Joined in 2011
      </span>
      <span>
        <i className="user icon"></i>
        35 Friends
      </span>
    </div>
  </div>


  <div className="card">
    <div className="image">
      <img src={insuranc}></img>
    </div>
    <div className="content">
      <div className="header">
100% Reliable</div>
      <div className="meta">
        <span className="date">Regulated by IRDAI</span>
      </div>
      <div className="description">
        Molly is a personal assistant living in Paris.
      </div>
    </div>
    <div className="extra content">
      <span className="right floated">
        Joined in 2011
      </span>
      <span>
        <i className="user icon"></i>
        35 Friends
      </span>
    </div>
  </div>

  
  </div>
  </div>
  </div>

                        </div>
                      </div>
                    </section>


                    <section id="about1">
                      <div className="container">
                        <div className="row">
                         
                          <div className ="row">

                            <div className="col-md-6">
                            <h2>What Our Customers Are Saying </h2>
                            <div className="about-content">
                              One Stop Smart Savings Account platform that provides the facility to a user to let SaviFi do the job of managing his fund’s hassle-free. We plan to enable this by automatically toggling the users' funds from one platform to another basis the interest rates being offered across various Defi platforms. We aim to also incorporate trending methods like Yield farming to leverage on Defi protocols and generate higher returns for our users.
                            </div>
                            </div>

                            <div className="col-md-6">
                            <img src={customer} style={{width: "500px", height: "400px"}}/>
                          </div>  
                          </div>      
                        </div>
                      </div>
                    </section>

             

                    <section id="about">
                      <div className="container">
                        <div className="row">
                          <div className="col-md-6">
                            <img src={insuranc} style={{width: "500px", height: "400px"}}/>
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


                
                    <section id="about1">
                      <div className="container">
                        <div className="row">
                         
                          <div className ="row">

                            <div className="col-md-6">
                            <h2>Have a question?
Here to help. </h2>
                            <div className="about-content">
                              One Stop Smart Savings Account platform that provides the facility to a user to let SaviFi do the job of managing his fund’s hassle-free. We plan to enable this by automatically toggling the users' funds from one platform to another basis the interest rates being offered across various Defi platforms. We aim to also incorporate trending methods like Yield farming to leverage on Defi protocols and generate higher returns for our users.
                            </div>
                            </div>

                            <div className="col-md-6">
                            <img src={question} style={{width: "500px", height: "400px"}}/>
                          </div>  
                          </div>      
                        </div>
                      </div>
                    </section>

                 
    <footer className="site-footer">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <h6>About</h6>
            <p className="text-justify">Scanfcode.com <i>CODE WANTS TO BE SIMPLE </i> is an initiative  to help the upcoming programmers with the code. Scanfcode focuses on providing the most efficient code or snippets as the code wants to be simple. We will help programmers build up concepts in different programming languages that include C, C++, Java, HTML, CSS, Bootstrap, JavaScript, PHP, Android, SQL and Algorithm.</p>
          </div>

          <div className="col-xs-6 col-md-3">
            <h6>Categories</h6>
            <ul className="footer-links">
              <li><a href="http://scanfcode.com/category/c-language/">C</a></li>
              <li><a href="http://scanfcode.com/category/front-end-development/">UI Design</a></li>
              <li><a href="http://scanfcode.com/category/back-end-development/">PHP</a></li>
              <li><a href="http://scanfcode.com/category/java-programming-language/">Java</a></li>
              <li><a href="http://scanfcode.com/category/android/">Android</a></li>
              <li><a href="http://scanfcode.com/category/templates/">Templates</a></li>
            </ul>
          </div>

          <div className="col-xs-6 col-md-3">
            <h6>Quick Links</h6>
            <ul className="footer-links">
              <li><a href="http://scanfcode.com/about/">About Us</a></li>
              <li><a href="http://scanfcode.com/contact/">Contact Us</a></li>
              <li><a href="http://scanfcode.com/contribute-at-scanfcode/">Contribute</a></li>
              <li><a href="http://scanfcode.com/privacy-policy/">Privacy Policy</a></li>
              <li><a href="http://scanfcode.com/sitemap/">Sitemap</a></li>
            </ul>
          </div>
        </div>
        
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-sm-6 col-xs-12">
            <p className="copyright-text">Copyright &copy; 2017 All Rights Reserved by 
         <a href="#">Scanfcode</a>.
            </p>
          </div>

          <div className="col-md-4 col-sm-6 col-xs-12">
            <ul className="social-icons">
              <li><a className="facebook" href="#"><i className="fa fa-facebook"></i></a></li>
              <li><a className="twitter" href="#"><i className="fa fa-twitter"></i></a></li>
              <li><a className="dribbble" href="#"><i className="fa fa-dribbble"></i></a></li>
              <li><a className="linkedin" href="#"><i className="fa fa-linkedin"></i></a></li>   
            </ul>
          </div>
        </div>
      </div>
</footer>





                    
                  </div>
                }/>
            </Switch>           
        </div>
      );
    }
}
  
  export default Dashboard;