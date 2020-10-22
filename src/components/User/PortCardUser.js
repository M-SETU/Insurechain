import React from 'react';

const PortCardUser = props => {

    const statusmapping = {
        "Application Submitted": "Application Submitted",
        "Request Initiated": "Application Received",
        "Details Sent": "Application Approved by "+ props.vendorMapping[props.portCard[2]],
        "Approved": "Application Approved by "+ props.vendorMapping[props.portCard[3]]+", Awaiting Transfer"
    }
        
    return(
    <tr>
        <td data-label="policyID" style={{textAlign:"center"}}>{props.portCard[0]}</td>
        <td data-label="newvendor" style={{textAlign:"center"}}>{props.vendorMapping[props.portCard[3]]}</td>
        <td data-label="oldvendor" style={{textAlign:"center"}}>{props.vendorMapping[props.portCard[2]]}</td>
        <td data-label="policyType" style={{textAlign:"center"}}>{props.portCard[4]}</td>
        <td data-label="reason" style={{textAlign:"center"}}>{props.portCard[7]}</td>
        <td data-label="status" style={{textAlign:"center"}}>{statusmapping[props.portCard[6]]}</td>
    </tr>
    );
  };

  export default PortCardUser;