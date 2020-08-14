import React from 'react';
import { Button, Card, Image , Form, Input, TextArea, Select} from 'semantic-ui-react'
import MenuExampleSizeMini from './MenuExampleSizeMini.js';

const CreateClaimPolicy = () => (
    <>
   <MenuExampleSizeMini/>
  <div style={{marginLeft: "280px",marginTop: "40px"}} align="center">
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
  </Card.Group>
</div>
<div style={{marginLeft: "650px",marginTop: "-300px"}} className= "col-sm-2 col-sm-push-0 col-md-4 col-md-push-0" align="center">
<Card.Group>
   
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
  
   
        </Card.Group>
  
    </div>
 </>

)

export default CreateClaimPolicy;