import React from 'react';
import { Button, Card, Form, Input} from 'semantic-ui-react'

const PolicyCard = props => {
    return(
      <tr>
      <td data-label="policyID">{props.policyCard[0]}</td>
      <td data-label="custID">{props.policyCard[2]}</td>
      <td data-label="poltype">{props.policyCard[4]}</td>
      <td data-label="hash">
        <a href={`https://ipfs.infura.io/ipfs/${props.policyCard[3]}`}>{props.policyCard[3]}</a>
      </td>
      <td>
          <Button onClick={() => { props.handleClaimButton(props.policyCard[0]) }} basic color='yellow'>
            Raise Claim
          </Button>
          <Button basic color='pink'>
            Port
          </Button>
      </td>
    </tr>
    );
  };

  export default PolicyCard;