import React from 'react';
import { Button } from 'semantic-ui-react'


const ClaimCardVendor = props => {
  const claimAction = {
    "unprocessed": false,
    "Approved": true,
    "Rejected" : true
  }


  return (
      <tr>
        <td style={{textAlign:"center"}}>{props.claimCard[0]}</td>
        <td style={{textAlign:"center"}}>{props.claimCard[7]}</td>
        <td style={{textAlign:"center"}}>{props.claimCard[1]}</td>
        <td style={{textAlign:"center"}}>{props.claimCard[2]}</td>
        <td style={{textAlign:"center"}}>{props.claimCard[3]}</td>
        <td data-label="hash" style={{textAlign:"center"}}>
          <a href={`https://ipfs.infura.io/ipfs/${props.claimCard[5]}`}>View Document</a>
        </td>
        <td style={{textAlign:"center"}}>{props.claimCard[4]}</td>
        <td style={{textAlign:"center"}}>{props.claimCard[6]}</td>
        <td style={{textAlign:"center"}}>
          <Button onClick={() => { props.claimAction(props.claimCard[0], "Approved") }} basic color='green'
            disabled={claimAction[props.claimCard[6]]}>
             Approve
           </Button>
         <Button onClick={() => { props.claimAction(props.claimCard[0], "Rejected") }} basic color='red'
            disabled={claimAction[props.claimCard[6]]}>
            Reject
           </Button>
        </td>
    
      </tr>
  )
    
}


export default ClaimCardVendor;