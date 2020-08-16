import { Button, Menu} from 'semantic-ui-react'
import React, { Component } from 'react'
import Web3 from 'web3'
import Policy from '../abis/policy.json';
import Portis from '@portis/web3';
import logo from '../images/logos/Matic logo symbol.png';

const ClaimCard = props => (
  <tr>
    <td>{props.claimCard[0].toNumber()}</td>
    <td>{props.claimCard[1].toNumber()}</td>
    <td>{props.claimCard[2]}</td>
    <td>{props.claimCard[3]}</td>
    <td>{props.claimCard[4].toNumber()}</td>
    <td>{props.claimCard[5]}</td>
    <td>{props.claimCard[6]}</td>
    { 
      props.handleClaimButton(props.claimCard[0].toNumber(), props.claimCard[6])
    }

  </tr>
)

const PolicyCard = props => (
  <tr>
    <td data-label="Name">{props.policyCard[0].toNumber()}</td>
    <td data-label="Age">{props.policyCard[2].toNumber()}</td>
    <td data-label="Job">{props.policyCard[4]}</td>
    <td data-label="Job">{props.policyCard[3]}</td>
  </tr>
)

class Admin extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      policy:{},
      portis: {},
      policyIds: [],
      claimIds: [],
      policiesList: [],
      claimsList: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.loadWeb3 = this.loadWeb3.bind(this);
    this.loadBlockchainData = this.loadBlockchainData.bind(this);
    this.handleClaimButton = this.handleClaimButton.bind(this);
    this.claimReject = this.claimReject.bind(this);
    this.claimApprove = this.claimApprove.bind(this);
  
  }

  async login() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.handleClaimsLoop();
  }

  async logout() {
    await this.state.portis.logout(() => {
      console.log('User logged out');
    });
  }

  async loadWeb3() {
    const portis = new Portis('a16b70b3-8f7c-49cc-b33f-98db6607f425', "goerli");
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
    const policy = new this.state.web3.eth.Contract(Policy, "0x9bf61c1e0Fdd845e0b7C6C33598cA830fDa6fCbF");
    this.setState({policy});

    let b = await this.state.policy.methods.getPolicyIds(
      this.state.account)
    .call({from: this.state.account});

    let c = await this.state.policy.methods.getAllClaimIds(
      this.state.account)
    .call({from: this.state.account});

    this.setState({
      policyIds: b,
      claimIds: c
    })
  }

  async claimApprove (id){
    await this.state.policy.methods.approveClaim(
      id)
    .send({from: this.state.account, gasPrice: 400000})
    .then ((receipt) => {
      console.log(receipt);
    })
    .catch((err)=> {
      console.log(err);
    });
  }

  async claimReject (id){
    await this.state.policy.methods.rejectClaim(
      id)
    .send({from: this.state.account, gasPrice: 400000})
    .then ((receipt) => {
      console.log(receipt);
    })
    .catch((err)=> {
      console.log(err);
    });
  }

  handleChange (evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  async handleLoop(){

    var pol_ids = this.state.policyIds;
    var arr1 = [];
    for(let i = 0; i <pol_ids.length; i++) {
      let details = await this.state.policy.methods.getPolicy(pol_ids[i])
        .call({from: this.state.account});
      arr1.push(details);
    }

    var claim_ids = this.state.claimIds;
    var arr2 = [];
    for(let i = 0; i <claim_ids.length; i++) {
      let details = await this.state.policy.methods.getClaim(claim_ids[i])
        .call({from: this.state.account});
      arr2.push(details);
    }
    this.setState({
      PoliciesList: arr1,
      claimsList: arr2
    })
  }

  handleClaimButton(id, status){
    if(status==="unprocessed"){
      return (<tr>
        <Button onClick={() => { this.claimApprove(id) }} basic color='green'>
          Approve
        </Button>
        <Button onClick={() => { this.claimReject(id) }} basic color='red'>
          Reject
        </Button>
      </tr>)
    }
    else{
      return <tr>Completed</tr>
    }
  }

  handlePolicyList() {
    return this.state.policiesList.map(currentpolicy => {
      return <PolicyCard policyCard={currentpolicy} key={currentpolicy[0].toNumber()}/>;
    })
  }

  handleClaimList() {
    return this.state.claimsList.map(currentclaim => {
      return <ClaimCard claimCard={currentclaim} 
        handleClaimButton = {this.handleClaimButton}
        key={currentclaim[0].toNumber()}/>;
    })
  }


  render() {

    return (
      <div>
        <nav className="navbar navbar-light" style={{backgroundColor:"#0B1647"}}>
              <div className="navbar-brand">
                <img src={logo} style = {{width: "40px" , height: "40px"}} />
              </div>
          </nav> 
             <>
          <div style={{margin: "20px"}}>
          <Menu size='mini'>
            <Menu.Item
              name='Admin'
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name='User'
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
          </div>
          <br></br>
          <div style={{margin:"30px"}}>
                <div style={{fontSize:"25px"}} align = "center"><strong>All Policies</strong></div>
                <table className="ui celled table ">
                  <thead>
                  <tr>
                    <th>Policy Id</th>
                    <th>Customer ID</th>
                    <th>Policy Type</th>
                    <th>KYC Hash</th>
                  </tr></thead>
                  <tbody>
                    { this.handlePolicyList() }
                  </tbody>
                </table>
          </div>
          <br></br>
          <div>
                <div style={{fontSize:"25px"}} align = "center"><strong>All Claims</strong></div>
                <table className="ui celled table">
                  <thead>
                    <tr>
                      <th>ClaimId</th>
                      <th>Date</th>
                      <th>Hospital Name</th>
                      <th>description</th>
                      <th>docs</th>
                      <th>amount</th>
                      <th>Status</th>
                      <th>result</th>
                    </tr>
                  </thead>
                  <tbody>
                    { this.handleClaimList() }
                  </tbody>
                </table>
        </div>   
        </>
      </div>
    );
  }
}

export default Admin;