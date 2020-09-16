import React from 'react';
import { Button } from 'semantic-ui-react'

const PolicyCardUser = props => {
    return(
      <tr>
      <td data-label="policyID" style={{textAlign:"center"}}>{props.policyCard[0]}</td>
      <td data-label="custID" style={{textAlign:"center"}}>{props.policyCard[2]}</td>
      <td data-label="name" style={{textAlign:"center"}}>{props.policyCard[7]}</td>
      <td data-label="poltype" style={{textAlign:"center"}}>{props.policyCard[4]}</td>
      <td data-label="hash" style={{textAlign:"center"}}>
        <a href={`https://ipfs.infura.io/ipfs/${props.policyCard[3]}`}>View Document</a>
      </td>
      <td data-label="appType" style={{textAlign:"center"}}>{props.policyCard[8]}</td>
      {/* <td style={{textAlign:"center"}}>
        <a href={`https://mumbai-explorer.matic.today/tx/${localStorage.getItem('mint1Hash')}/token_transfers`} target="_blank">Hash</a>
      </td> */}
      <td style={{textAlign:"center"}}>
          <Button onClick={() => { props.handleClaimButton(props.policyCard[0]) }} basic color='yellow'>
            Raise Claim
          </Button>
          <Button onClick={() => { props.handlePortButton(props.policyCard) }} basic color='pink'>
            Port
          </Button>
      </td>
    </tr>
    );
  };

  export default PolicyCardUser;