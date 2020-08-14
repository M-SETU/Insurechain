import React, { Component } from 'react'
import { Button, Card, Image } from 'semantic-ui-react'
import { Redirect, Route } from "react-router-dom";
import CreatePolicy from './CreatePolicy.js';

class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: "",
      network: "",
      click: false
    };
    this.handleSubmit1 = this.handleSubmit1.bind(this);
    this.handleSubmit2 = this.handleSubmit2.bind(this);
  }

  async handleSubmit1() {
    await this.setState({
      name: "LIC",
      network: "goerli",
      click: true
    })
  }

  async handleSubmit2() {
    await this.setState({
      name: "HDFC",
      network: "maticMumbai",
      click: true
    })
  }

  render () {
    if (this.state.click === true) {
      return <Redirect to={{
        pathname: '/createpolicy',
        state: { name: this.state.name, network: this.state.network }
    }}
/>
      
    }

    return (
      <div style={{
        margin: "20px"
      }}>
          <Card.Group>
          <Card>
            <Card.Content>
              <Card.Header>Vendor 1</Card.Header>
              <Card.Meta>LC</Card.Meta>
              <Card.Description>
              <strong>LIC</strong>
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div className='ui two buttons'>
                <Button onClick={this.handleSubmit1} basic color='green'>
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
                HDFC
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div className='ui two buttons'>
                <Button onClick={this.handleSubmit2} basic color='green'>
                  Select
                </Button>
              </div>
            </Card.Content>
          </Card>
        </Card.Group>
      </div>
    )
  }
  
}

export default Home;