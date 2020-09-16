import React from 'react';

import { Button } from 'semantic-ui-react'


const PortCardVendor = props => {

  const approverejectButton = {
    "active": false,
    "approved": true,
    "completed": true
  }
  const onBoardButton = {
    "active": true,
    "approved": true,
    "completed": false
  }


  return (
    <tr>
      <td data-label="policyID" style={{textAlign:"center"}}>{props.portCard[0]}</td>
      <td data-label="vendor" style={{textAlign:"center"}}>{props.vendorMapping[props.portCard[3]]}</td>
      <td data-label="status" style={{textAlign:"center"}}>{props.portCard[5]}</td>
      <td style={{textAlign:"center"}}>
        <Button 
          onClick={() => {props.handleApproveRequestButton(props.portCard[0])}} 
          basic color='green'
          disabled = {approverejectButton[props.portCard[5]]}>
          Approve
        </Button>
        <Button 
          onClick={() => {props.handleRejectRequestButton(props.portCard[0])}} 
          basic color='red'
          disabled = {approverejectButton[props.portCard[5]]}>
          Reject
        </Button>
        <Button 
          onClick={() => {props.handleTransferRequestButton(props.portCard)}} 
          basic color='yellow'
          disabled = {onBoardButton[props.portCard[5]]}>
          OnBoard
        </Button>
      </td>
    </tr>
  )
};

export default PortCardVendor;