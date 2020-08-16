import { Button, Card, Form, Input,  Select, Menu} from 'semantic-ui-react'
import React, { Component } from 'react'
import Web3 from 'web3'
import Policy from '../abis/policy.json';
import Portis from '@portis/web3';
import logo from '../images/logos/Matic logo symbol.png';

const PolicyCard = props => (
  <div style={{display: "inline-block", marginright:"10px"}}>
    <Card>
      <Card.Content>
        <Card.Header>{props.policyCard[0].toNumber()}</Card.Header>
        <Card.Meta>{props.policyCard[4]}</Card.Meta>
        <Card.Meta>{props.policyCard[2].toNumber()}</Card.Meta>
        <Card.Description>
          {props.policyCard[3]}
        </Card.Description>
      </Card.Content>
    </Card>
  </div>
)

class CreatePolicyDash extends Component {

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
      policyIdsArray: [],
      policiesList: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handlePolicySubmit = this.handlePolicySubmit.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.loadWeb3 = this.loadWeb3.bind(this);
    this.loadBlockchainData = this.loadBlockchainData.bind(this);
    this.policyList = this.policyList.bind(this);

  
  }
  // async componentWillMount() {
  //   await this.loadWeb3()
  //   await this.loadBlockchainData()
  // }
  async login() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.handlePoliciesLoop();
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
    const policy = new this.state.web3.eth.Contract(Policy, this.props.location.state.address);
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

    this.setState({
      policyIdsArray: c,
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
    })
    .catch((err)=> {
      console.log(err);
    });
  }

  handleChange (evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  async handlePoliciesLoop(){
    var ids = this.state.policyIdsArray;
    var arr = [];
    for(let i = 0; i <ids.length; i++) {
      let id = ids[i];
      let details = await this.state.policy.methods.getPolicy(id)
        .call({from: this.state.account});
      arr.push(details);
    }
    this.setState({
      policiesList: arr
    })
  }

  policyList() {
    return this.state.policiesList.map(currentpolicy => {
      return <PolicyCard policyCard={currentpolicy} key={currentpolicy.policyId.toNumber()}/>;
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
              <Menu.Item
                name= {this.state.account}
              />
          

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
                
                <Card.Header>Create Policy</Card.Header>
                <Card.Meta>Policy</Card.Meta>
                <Card.Description>
                
                <div  align="center" >
                <div>
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
                <div >
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
                  </div>


                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className='ui two buttons'>
                  <Button onClick={this.handlePolicySubmit} basic color='blue'>
                    BUY
                  </Button>
                
                </div>
              </Card.Content>
            </Card>
            <Card>
              <Card.Content>
                
                <Card.Header>Port Policy</Card.Header>
                <Card.Meta>Policy</Card.Meta>
                <Card.Description>
                  Molly wants to add you to the group <strong>musicians</strong>
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <div className='ui two buttons'>
                  <Button basic color='green'>
                PORT
                  </Button>
                  
                </div>
              </Card.Content>
            </Card>
          
          </Card.Group>

              </div>
          <Card.Group>  
              <div  style={{marginLeft: "350px",marginTop: "40px", padding: "20px"}} align="center">
                { this.policyList() }
              </div> 
          </Card.Group>
        </>
      </div>
    );
  }
}

export default CreatePolicyDash;