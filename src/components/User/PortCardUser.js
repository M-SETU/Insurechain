import React from 'react';
import { Button } from 'semantic-ui-react'

const PortCardUser = props => {
    
    const transferButton = {
        "active": true,
        "approved": false,
        "completed": true
    }
        
    return(
        <tr>
            <td data-label="policyID" style={{textAlign:"center"}}>{props.portCard[0]}</td>
            <td data-label="vendor" style={{textAlign:"center"}}>{props.vendorMapping[props.portCard[3]]}</td>
            <td data-label="status" style={{textAlign:"center"}}>{props.portCard[5]}</td>
            <td style={{textAlign:"center"}}>
                <Button 
                    onClick={() => {props.handleTransferButton(props.portCard[0])}} 
                    basic color='yellow'
                    disabled = {transferButton[props.portCard[5]]}>
                Transfer
                </Button>
            </td>
        </tr>
    );
  };

  export default PortCardUser;