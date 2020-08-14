import React from 'react';
import { Button, Card, Image , Form, Input, TextArea, Select} from 'semantic-ui-react'
import MenuExampleSizeMini from './MenuExampleSizeMini.js';

const Admin = () => (
    <>
   <MenuExampleSizeMini/>
  
<div style={{marginLeft: "150px",marginTop: "100px"}} className= "col-sm-2 col-sm-push-0 col-md-4 col-md-push-0" align="center">
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
 <div style={{marginLeft: "450px",marginTop: "-490px"}} className= "col-sm-2 col-sm-push-0 col-md-4 col-md-push-0" align="center">

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
        <div style={{marginLeft: "750px",marginTop: "-450px"}} className= "col-sm-2 col-sm-push-0 col-md-4 col-md-push-0" align="center">

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

export default Admin;