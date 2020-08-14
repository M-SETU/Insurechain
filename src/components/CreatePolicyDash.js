import React from 'react';
import { Button, Card, Image , Form, Input, TextArea, Select} from 'semantic-ui-react'
import MenuExampleSizeMini from './MenuExampleSizeMini.js';

const CreatePolicyDash = () => (
    <>
   <MenuExampleSizeMini/>
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
                id='form-input-control-policyid'
                control={Input}
                label='Policy Id'
                placeholder='Policy Id'
                name="policyId"
               
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
                placeholder='Claim Date'
                name="claimDate"
                
              />
            </Form.Group>
          </Form>
        </div>
          </div>


        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className='ui two buttons'>
          <Button basic color='green'>
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
      
 <div  style={{marginLeft: "350px",marginTop: "40px"}} align="center">
 <Card>
    <Card.Content>
      <Card.Header>Policy 1</Card.Header>
      <Card.Meta>Co-Worker</Card.Meta>
      <Card.Description>
        Matthew is a pianist living in Nashville.
      </Card.Description>
    </Card.Content>
  </Card>

  <Card>
    <Card.Content>
      <Card.Header content='Policy 2' />
      <Card.Meta content='Musicians' />
      <Card.Description content='Jake is a drummer living in New York.' />
    </Card.Content>
  </Card>
     </div>

  <div  style={{marginLeft: "10px",marginTop: "40px"}} align="center">
  <Card>
    <Card.Content
      header='Policy 3'
      meta='Friend'
      description='Elliot is a music producer living in Chicago.'
    />
  </Card>

  <Card
    header='Policy 4'
    meta='Friend'
    description='Jenny is a student studying Mediachool'
  />
      </div>
      
</Card.Group>
</>

)

export default CreatePolicyDash;