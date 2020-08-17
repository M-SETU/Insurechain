import { Button, Card, Form, Input, Menu} from 'semantic-ui-react'
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
  </tr>
)

class CreateClaimPolicy extends Component {

  constructor(props) {
    super(props)
    this.state = {
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
  }

  async componentWillMount() {
    if(this.props.loginstatus == true)
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

  async handleClaimSubmit (){
    try{
      await this.state.policy.methods.claimPolicy(
        this.state.policyId, 
        this.state.claimDate,
        this.state.hospitalName,
        this.state.description,
        this.state.amount,
        this.state.claimHash)
      .send({from: this.state.account, gasPrice: 400000})
      .then ((receipt) => {
        console.log(receipt);
      })
      .catch((err)=> {
        console.log(err);
      });
    }
    catch{
      window.alert("Login First")
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
        let cl = await this.state.policy.methods.getClaim(allclaims[i].toNumber())
        .call({from: this.state.account});
        arr.push(cl);
      }
    }
    this.setState({
      claimsList: arr
    })
  }

  handleClaimList() {
    return this.state.claimsList.map(currentclaim => {
      return <ClaimCard claimCard={currentclaim} key={currentclaim[0].toNumber()}/>;
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
                          id='form-input-control-policyid'
                          control={Input}
                          label='Policy ID'
                          placeholder='Policy Id'
                          name="policyId"
                          onChange={this.handleChange}
                        />
                        <Form.Field
                          id='form-input-control-claimdate'
                          control={Input}
                          label='Claim Date'
                          placeholder='Date'
                          name="claimDate"
                          onChange={this.handleChange}
                        />
                        <Form.Field
                          id='form-input-control-claimdate'
                          control={Input}
                          label='Claim Date'
                          placeholder='Date'
                          name="claimDate"
                          onChange={this.handleChange}
                        />
                      </Form.Group>
                    </Form>
                  </div>
                  
                  <div >
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
                      </Form.Group>
                    </Form>
                  </div>
                  <div >
                    <Form>
                      <Form.Group widths='equal'>
                        <Form.Field
                          id='form-input-control-claimdochash'
                          control={Input}
                          label='Claim Docs Hash'
                          placeholder='Claim Docs Hash'
                          name="claimHash"
                          onChange={this.handleChange}
                        />
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
                    <th>description</th>
                    <th>docs</th>
                    <th>amount</th>
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