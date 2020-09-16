import React from 'react';

import { Button } from 'semantic-ui-react'


const PortCardVendor = props => (
    <tr>
      <td data-label="policyID">{props.portCard[0]}</td>
      <td data-label="vendor">{props.portCard[3]}</td>
      <td data-label="status">{props.portCard[5]}</td>
      <td>
        <Button onClick={() => {props.handleApproveRequestButton(props.portCard)}} basic color='green'>
          Approve
        </Button>
        <Button onClick={() => {props.handleRejectRequestButton(props.portCard)}} basic color='red'>
          Reject
        </Button>
        <Button onClick={() => {props.handleTransferRequestButton(props.portCard)}} basic color='yellow'>
          OnBoard
        </Button>
      </td>
    </tr>
);

export default PortCardVendor;