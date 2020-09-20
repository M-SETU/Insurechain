import React from 'react';

const PortCardUser = props => {
        
    return(
    <tr>
        <td data-label="policyID" style={{textAlign:"center"}}>{props.portCard[0]}</td>
        <td data-label="newvendor" style={{textAlign:"center"}}>{props.vendorMapping[props.portCard[3]]}</td>
        <td data-label="oldvendor" style={{textAlign:"center"}}>{props.vendorMapping[props.portCard[2]]}</td>
        <td data-label="details" style={{textAlign:"center"}}>{props.portCard[1]}</td>
        <td data-label="policyType" style={{textAlign:"center"}}>{props.portCard[4]}</td>
        <td data-label="status" style={{textAlign:"center"}}>{props.portCard[6]}</td>
    </tr>
    );
  };

  export default PortCardUser;