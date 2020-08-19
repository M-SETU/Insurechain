import { Button, Card, Form, Input} from 'semantic-ui-react'
import React, { Component } from 'react'
import Web3 from 'web3'
import Policy from '../abis/policy.json';
import Portis from '@portis/web3';
import {Link } from 'react-router-dom';
import ipfs from './ipfs.js'

const PolicyCard = props => (
  <tr>
    <td data-label="policyID">{props.policyCard[0]}</td>
    <td data-label="custID">{props.policyCard[2]}</td>
    <td data-label="poltype">{props.policyCard[4]}</td>
    <td data-label="hash">
      <a href={`https://ipfs.infura.io/ipfs/${props.policyCard[3]}`}>{props.policyCard[3]}</a>
    </td>
  </tr>
)

const OptionCard = props => (
  <option value={props.opt}>
    {props.opt}
  </option>
)


class CreatePolicyDash extends Component {

  constructor(props) {
    super(props)
    this.state = {
      buffer: null,
      account: '',
      hash: '',
      policySelected: 'None',
      policyTypes: [],
      portis: {},
      policyIdsArray: [],
      web3: {},
      policiesList: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handlePolicySubmit = this.handlePolicySubmit.bind(this);
    this.loadBlockchainData = this.loadBlockchainData.bind(this);
    this.policyList = this.policyList.bind(this);
    this.handleSelectPolicyType = this.handleSelectPolicyType.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    

  
  }
  async componentWillMount() {
    if(this.props.loginstatus === true)
    {
      await this.setState({
        policy: this.props.policy,
        web3: this.props.web3,
        portis: this.props.portis,
        account: this.props.account
      })
      await this.loadBlockchainData();
      await this.handlePoliciesLoop();
    }
  }

  async loadBlockchainData(){
    const policy = new this.state.web3.eth.Contract(Policy, this.props.address);
    this.setState({policy});

    let a = await this.state.policy.methods.getPolicyTypes().call({from: this.state.account});
    this.setState({
      policyTypes: a
    })

    let c = await this.state.policy.methods.getUserPolicies(
      this.state.account)
    .call({from: this.state.account});

    this.setState({
      policyIdsArray: c,
    })
  }

  async handleFileChange(event){
    event.preventDefault()
    try{
      const file = event.target.files[0]
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
      }
    } 
    catch(err){
      console.log(err)
    }
  }

  async handlePolicySubmit (event){
    event.preventDefault()
    try{
      console.log("Submitting file to ipfs...")
      ipfs.add(this.state.buffer, (error, result) => {
        console.log('Ipfs result', result)
        if(error) {
          console.error(error)
          return
        }
        this.setState({ hash: result[0].hash })
        const policy = new this.state.web3.eth.Contract(Policy, this.props.address);
        policy.methods.createPolicy(
          this.state.hash, this.state.policySelected)
        .send({from: this.state.account, gas:500000, gasPrice:10000000000})
        .then ((receipt) => {
          console.log(receipt);
        })
        .catch((err)=> {
          console.log(err);
        });
      })
    } catch(err) {
      console.log(err);
    }
    
  }

  handleChange (evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  async handleSelectPolicyType (evt) {
    await this.setState({ policySelected: evt.target.value });
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
      return <PolicyCard policyCard={currentpolicy} key={currentpolicy[0]}/>;
    })
  }

  optionsList() {
    return this.state.policyTypes.map(currenttype => {
      return <OptionCard opt={currenttype} key={currenttype}/>;
    })
  }


  render() {

    return (
      <div>
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
                      <Form.Field>
                        <div>
                          <strong>Policy Type</strong>
                          <select id="typespolicy" onChange={this.handleSelectPolicyType}
                            style = {{
                              width: "equal"
                            }}
                            >
                            <option value="None" defaultValue>
                              {"None"}
                            </option>
                            {this.optionsList()}
                          </select>
                        </div>
                      </Form.Field>
                    </Form.Group>
                  </Form>
                </div>
                <div >
                  <Form>
                    <Form.Group widths='equal'>
                      <Form.Field
                        id='form-input-control-documenthash'
                        control={Input}
                        label='KYC Document'
                        name="hash"
                      >
                        <input type="file" onChange={this.handleFileChange} />
                      </Form.Field>
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
                  <Button basic color='green' disabled={true}>
                PORT
                  </Button>
                  
                </div>
              </Card.Content>
            </Card>
          
          </Card.Group>

          </div>
          <br></br>
          <div style={{padding:"20px"}}>
            <div style={{fontSize:"20px", position:"center"}} align = "center"><strong>All Policies</strong></div>
              <table className="ui celled table ">
                <thead>
                <tr>
                  <th>Policy Id</th>
                  <th>Customer ID</th>
                  <th>Policy Type</th>
                  <th>KYC Hash</th>
                </tr></thead>
                <tbody>
                  { this.policyList() }
                </tbody>
              </table>
          </div>
          
        
      </div>
    );
  }
}

export default CreatePolicyDash;