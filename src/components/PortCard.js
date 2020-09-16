import React from 'react';
import { Button } from 'semantic-ui-react'

const PortCard = props => {
    return(
        <tr>
            <td data-label="policyID">{props.portCard[0]}</td>
            <td data-label="vendor">{props.portCard[3]}</td>
            <td data-label="status">{props.portCard[5]}</td>
            <td>
                <a href={`https://mumbai-explorer.matic.today/tx/${localStorage.getItem('burnHash')}/token_transfers`} target="_blank">Hash</a>
            </td>
            <td>
                <Button onClick={() => {props.handleTransferButton(props.portCard, props.portCard[5],props.portCard[0])}} basic color='yellow'>
                Transfer
                </Button>
            </td>
        </tr>
    );
  };

  export default PortCard;