import React from 'react';
import { Button } from 'semantic-ui-react'
import ipfs from '../ipfs.js'

const PolicyCardUser = props => {

    return(<tr>
      <td data-label="policyID" style={{textAlign:"center"}}>{props.policyCard[0]}</td>
      <td data-label="custID" style={{textAlign:"center"}}>{props.policyCard[2]}</td>
      <td data-label="name" style={{textAlign:"center"}}>{props.policyCard[3]["name"]}</td>
      <td data-label="emailId" style={{textAlign:"center"}}>{props.policyCard[3]["email"]}</td>
      <td data-label="poltype" style={{textAlign:"center"}}>{props.policyCard[4]}</td>
      <td data-label="hash" style={{textAlign:"center"}}>
        <a href={`https://${props.policyCard[3]["kycHash"]}.ipfs.infura-ipfs.io`}>View Document</a>
      </td>
      <td data-label="appType" style={{textAlign:"center"}}>{props.policyCard[8]}</td>
      <td style={{textAlign:"center"}}>
          <Button onClick={() => { props.handleClaimButton(props.policyCard[0]) }} basic color='yellow'>
            Raise Claim
          </Button>
      </td>
    </tr>
    );

    
  };

  export default PolicyCardUser;