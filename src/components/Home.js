import React, { Component } from 'react'
import { Button, Card} from 'semantic-ui-react'
import { Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from '../images/logos/Matic logo symbol.png';

class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: "",
      network: "",
      address:"",
      click: false
    };
    this.handleSubmit1 = this.handleSubmit1.bind(this);
    this.handleSubmit2 = this.handleSubmit2.bind(this);
  }

  async handleSubmit1() {
    await this.setState({
      name: "LIC",
      network: "goerli",
      address: "0x9bf61c1e0Fdd845e0b7C6C33598cA830fDa6fCbF",
      click: true
    })
  }

  async handleSubmit2() {
    await this.setState({
      name: "HDFC",
      network: "maticMumbai",
      address:"0x9bf61c1e0Fdd845e0b7C6C33598cA830fDa6fCbF",
      click: true
    })
  }

  render () {
    if (this.state.click === true) {
      return <Redirect to={{
        pathname: '/createpolicydash',
        state: { name: this.state.name, network: this.state.network, address: this.state.address}
    }}
/>
      
    }

    return (
      <div>
        <nav className="navbar navbar-light" style={{backgroundColor:"#0B1647"}}>
            <div className="navbar-brand">
              <img src={logo} style = {{width: "40px" , height: "40px"}} />
            </div>
        </nav> 
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
                    <Button onClick={this.handleSubmit1} basic color='blue'>
                      Select
                    </Button>
                
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
                    <Button onClick={this.handleSubmit2} basic color='blue'>
                      Select
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            </Card.Group>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
}

export default Home;