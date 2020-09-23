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
        <td style={{textAlign:"center"}}>{props.claimCard[1]}</td>
        <td style={{textAlign:"center"}}>{props.claimCard[2]["claimDate"]}</td>
        <td style={{textAlign:"center"}}>{props.claimCard[2]["hospitalName"]}</td>
        <td style={{textAlign:"center"}}>{props.claimCard[2]["description"]}</td>
        <td style={{textAlign:"center"}}>{"$" +props.claimCard[2]["amount"]}</td>
        <td data-label="hash" style={{textAlign:"center"}}>
          <a href={`https://${props.claimCard[2]["claimHash"]}.ipfs.infura-ipfs.io`}>View Document</a>
        </td>
        <td style={{textAlign:"center"}}>{props.claimCard[3]}</td>
        <td style={{textAlign:"center"}}>
          <Button onClick={() => { props.claimAction(props.claimCard[0], props.claimCard[1], "Approved") }} basic color='green'
            disabled={claimAction[props.claimCard[3]]}>
             Approve
           </Button>
         <Button onClick={() => { props.claimAction(props.claimCard[0], props.claimCard[1], "Rejected") }} basic color='red'
            disabled={claimAction[props.claimCard[3]]}>
            Reject
           </Button>
        </td>
      </tr>
  )
}


export default ClaimCardVendor;