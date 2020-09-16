import React from 'react';
import { Button } from 'semantic-ui-react'

const PolicyCardUser = props => {
    return(
      <tr>
      <td data-label="policyID">{props.policyCard[0]}</td>
      <td data-label="custID">{props.policyCard[2]}</td>
      <td data-label="poltype">{props.policyCard[4]}</td>
      <td data-label="hash">
        <a href={`https://ipfs.infura.io/ipfs/${props.policyCard[3]}`}>View Document</a>
      </td>
      <td>
        <a href={`https://mumbai-explorer.matic.today/tx/${localStorage.getItem('mint1Hash')}/token_transfers`} target="_blank">Hash</a>
      </td>
      <td>
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