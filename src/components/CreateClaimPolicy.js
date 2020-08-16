import { Button, Card, Form, Input, Menu} from 'semantic-ui-react'
import React, { Component } from 'react'
import Web3 from 'web3'
import Policy from '../abis/policy.json';
import Portis from '@portis/web3';
import logo from '../images/logos/Matic logo symbol.png';

const ClaimCard = props => (
  <div style={{display: "inline-block", marginright:"10px"}}>
    <Card>
      <Card.Content>
        <Card.Header>{props.claimCard[0].toNumber()}</Card.Header>
        <Card.Meta>{props.claimCard[1].toNumber()}</Card.Meta>
        <Card.Meta>{props.claimCard[2]}</Card.Meta>
        <Card.Description>
          {props.claimCard[3]}
        </Card.Description>
        <Card.Meta>{props.claimCard[4].toNumber()}</Card.Meta>
        <Card.Meta>{props.claimCard[5]}</Card.Meta>
        <Card.Meta>{props.claimCard[6]}</Card.Meta>
      </Card.Content>
    </Card>
  </div>
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
      claimsList: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClaimSubmit = this.handleClaimSubmit.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.loadWeb3 = this.loadWeb3.bind(this);
    this.loadBlockchainData = this.loadBlockchainData.bind(this);
    this.handleClaimList = this.handleClaimList.bind(this);

  
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

    let b = await this.state.policy.methods.getUserCustomerId(
      this.state.account)
    .call({from: this.state.account});
    console.log(b.toNumber());

    let c = await this.state.policy.methods.getUserPolicies(
      this.state.account)
    .call({from: this.state.account});
    console.log(c[0].toNumber());

    this.setState({
      policyIdsArray: c,
    })
  }

  async handleClaimSubmit (){

    this.state.policy.methods.claimPolicy(
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
      <div>
          <nav className="navbar navbar-light" style={{backgroundColor:"#0B1647"}}>
              <div className="navbar-brand">
                <img src={logo} style = {{width: "40px" , height: "40px"}} />
              </div>
          </nav> 
             <>
          <div style={{margin: "20px"}} align="center" >
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

          <div style={{marginLeft: "350px",marginTop: "40px"}} align="center">
        <Card.Group>
            <Card>
              <Card.Content>
                
                <Card.Header>Claim Policy</Card.Header>
                <Card.Meta>Claim</Card.Meta>
                <Card.Description>
                
                <div  align="center" >
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
                      </Form.Group>
                    </Form>
                  </div>
                  <div >
                    <Form>
                      <Form.Group widths='equal'>
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
                      </Form.Group>
                    </Form>
                  </div>
                  <div >
                    <Form>
                      <Form.Group widths='equal'>
                        <Form.Field
                          id='form-input-control-description'
                          control={Input}
                          label='Description'
                          placeholder='Description'
                          name="description"
                          onChange={this.handleChange}
                        />
                      </Form.Group>
                    </Form>
                  </div>
                  <div >
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


                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className='ui two buttons'>
                  <Button onClick={this.handleClaimSubmit} basic color='blue'>
                    Claim
                  </Button>
                
                </div>
              </Card.Content>
            </Card>
              <Card.Group>  
                <div align="center">
                  { this.handleClaimList() }
                </div> 
              </Card.Group>
          </Card.Group>
        </div>   
        </>
      </div>
    );
  }
}

export default CreateClaimPolicy;